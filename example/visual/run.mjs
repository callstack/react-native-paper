#!/usr/bin/env node
/**
 * Visual regression loop for the Surface example (PoC).
 *
 *   node example/visual/run.mjs --platform ios|android [--update]
 *                               [--threshold 0.02] [--story surface-elevated,surface-flat]
 *
 * Drives agent-device 0.21.0 through `npx` and parses `--json` stdout. The
 * package does export `createAgentDeviceClient`, but it is not a dependency of
 * this repo and is not resolvable from `example/`, and the PoC rule is "no new
 * dependencies", so the CLI is spawned instead.
 *
 * Prerequisites (documented, not automated): the example app is already built
 * and installed on a device matching example/visual/env.json, Metro is running,
 * and the baselines in example/visual/__baselines__/<platform>/ were captured
 * on that same device.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VISUAL_DIR = path.dirname(fileURLToPath(import.meta.url));
const BASELINE_DIR = path.join(VISUAL_DIR, '__baselines__');
const ENV_FILE = path.join(VISUAL_DIR, 'env.json');
const AGENT_DEVICE = 'agent-device@0.21.0';
const BUNDLE_ID = 'com.callstack.reactnativepaperexample';
const DEFAULT_STORIES = ['surface-elevated', 'surface-flat'];
const DEFAULT_THRESHOLD = 0.02; // PoC finding: the CLI default of 0.1 misses soft-shadow regressions.
const DEV_MENU_LABELS = ['Close', 'Continue'];

// agent-device sessions are keyed by cwd. Point this at the directory whose
// session is already bound to the intended device to reuse that binding;
// otherwise a fresh session is created and bound by `open --udid`.
const SESSION_CWD = process.env.AGENT_DEVICE_SESSION_CWD || VISUAL_DIR;

let commandSeq = 0;
let cmdDir = VISUAL_DIR;

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(2);
}

function warn(message) {
  console.warn(`WARNING: ${message}`);
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function parseArgs(argv) {
  const out = {
    update: false,
    threshold: DEFAULT_THRESHOLD,
    stories: DEFAULT_STORIES,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      const value = argv[++i];
      if (value == null) fail(`${arg} needs a value`);
      return value;
    };

    switch (arg) {
      case '--platform':
        out.platform = next();
        break;
      case '--update':
        out.update = true;
        break;
      case '--threshold':
        out.threshold = Number(next());
        break;
      case '--story':
      case '--stories':
        out.stories = next()
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case '--help':
      case '-h':
        console.log(
          'usage: node example/visual/run.mjs --platform ios|android [--update] [--threshold <0-1>] [--story a,b]'
        );
        process.exit(0);
        break;
      default:
        fail(`unknown argument ${arg}`);
    }
  }

  if (out.platform !== 'ios' && out.platform !== 'android') {
    fail('--platform must be ios or android');
  }
  if (
    !Number.isFinite(out.threshold) ||
    out.threshold < 0 ||
    out.threshold > 1
  ) {
    fail('--threshold must be a number between 0 and 1');
  }

  return out;
}

/** Runs one agent-device command, records its JSON, returns the parsed payload. */
function ad(label, args, { allowFail = false } = {}) {
  const argv = [AGENT_DEVICE, ...args, '--json'];
  const startedAt = Date.now();
  const proc = spawnSync('npx', argv, {
    cwd: SESSION_CWD,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  const elapsedMs = Date.now() - startedAt;
  const stdout = proc.stdout || '';

  let parsed = null;
  const first = stdout.indexOf('{');
  const last = stdout.lastIndexOf('}');
  if (first !== -1 && last > first) {
    try {
      parsed = JSON.parse(stdout.slice(first, last + 1));
    } catch {
      parsed = null;
    }
  }

  const file = path.join(
    cmdDir,
    `${String(++commandSeq).padStart(3, '0')}-${label}.json`
  );
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        command: ['npx', ...argv],
        cwd: SESSION_CWD,
        exitCode: proc.status,
        elapsedMs,
        response: parsed,
        stdout: parsed ? undefined : stdout,
        stderr: proc.stderr || undefined,
      },
      null,
      2
    )
  );

  const ok = proc.status === 0 && parsed && parsed.success !== false;
  if (!ok && !allowFail) {
    const reason =
      parsed?.error?.details?.reason ||
      parsed?.error?.message ||
      proc.stderr?.trim() ||
      `exit ${proc.status}`;
    fail(`agent-device ${label} failed: ${reason} (see ${file})`);
  }

  return {
    ok,
    data: parsed?.data ?? null,
    error: parsed?.error ?? null,
    elapsedMs,
  };
}

function sh(command, args) {
  const proc = spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return {
    status: proc.status,
    stdout: proc.stdout || '',
    stderr: proc.stderr || '',
  };
}

function adbPath() {
  const home = process.env.HOME || '';
  const sdk =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    path.join(home, 'Library/Android/sdk');
  const candidate = path.join(sdk, 'platform-tools/adb');
  return fs.existsSync(candidate) ? candidate : 'adb';
}

/** Compares the connected device with env.json and warns (never refuses). */
function checkEnvironment(platform, env) {
  const observed = {};

  if (platform === 'ios') {
    const expectedUdid = env.udid;
    const res = sh('xcrun', ['simctl', 'list', '-j', 'devices']);
    if (res.status !== 0) {
      warn(`could not run xcrun simctl list: ${res.stderr.trim()}`);
      return observed;
    }

    let devices;
    try {
      devices = JSON.parse(res.stdout).devices || {};
    } catch {
      warn('could not parse xcrun simctl list output');
      return observed;
    }

    let match = null;
    for (const [runtime, list] of Object.entries(devices)) {
      for (const device of list) {
        if (device.udid === expectedUdid) match = { runtime, device };
      }
    }

    if (!match) {
      warn(`env.json udid ${expectedUdid} is not in xcrun simctl list`);
      return observed;
    }

    observed.udid = match.device.udid;
    observed.name = match.device.name;
    observed.runtime = match.runtime;
    observed.state = match.device.state;

    if (env.runtime && match.runtime !== env.runtime) {
      warn(
        `runtime mismatch: env.json ${env.runtime}, device ${match.runtime}`
      );
    }
    if (
      env.iosVersion &&
      !match.runtime.endsWith(env.iosVersion.replace(/\./g, '-'))
    ) {
      warn(
        `iOS version mismatch: env.json ${env.iosVersion}, device runtime ${match.runtime}`
      );
    }
    if (env.device && match.device.name !== env.device) {
      warn(
        `device name mismatch: env.json ${env.device}, device ${match.device.name}`
      );
    }
    if (match.device.state !== 'Booted') {
      warn(`device ${expectedUdid} is ${match.device.state}, not Booted`);
    }
    return observed;
  }

  const adb = adbPath();
  const prop = (name) => sh(adb, ['shell', 'getprop', name]).stdout.trim();
  const sdkLevel = prop('ro.build.version.sdk');
  if (!sdkLevel) {
    warn(
      `could not read Android properties via ${adb} (is an emulator connected?)`
    );
    return observed;
  }

  observed.apiLevel = Number(sdkLevel);
  observed.androidRelease = prop('ro.build.version.release');
  const densityOut = sh(adb, ['shell', 'wm', 'density']).stdout;
  const densityMatch = densityOut.match(/(\d+)\s*$/m);
  observed.density = densityMatch ? Number(densityMatch[1]) : null;

  if (env.apiLevel != null && observed.apiLevel !== env.apiLevel) {
    warn(
      `Android API mismatch: env.json ${env.apiLevel}, device ${observed.apiLevel}`
    );
  }
  if (
    env.density != null &&
    observed.density != null &&
    observed.density !== env.density
  ) {
    warn(
      `Android density mismatch: env.json ${env.density}, device ${observed.density}`
    );
  }
  return observed;
}

function resolveBaseline(platform, story) {
  const dir = path.join(BASELINE_DIR, platform);
  if (!fs.existsSync(dir)) fail(`no baseline directory ${dir}`);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png'));

  const exact = files.find((f) => f === `${story}.png`);
  if (exact) return path.join(dir, exact);

  // Baseline names differ per platform (ios: surface-elevated.png,
  // android: android-base-elevated.png), so match on the story's last segment.
  const suffix = story.split('-').pop();
  const bySuffix = files.filter((f) => f.endsWith(`-${suffix}.png`));
  if (bySuffix.length === 1) return path.join(dir, bySuffix[0]);
  if (bySuffix.length > 1) {
    fail(`ambiguous baseline for ${story} in ${dir}: ${bySuffix.join(', ')}`);
  }
  fail(
    `no baseline for ${story} in ${dir} (found: ${files.join(', ') || 'none'})`
  );
}

function dismissDevMenu(globals) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const snap = ad('snapshot-devmenu', ['snapshot', ...globals]);
    const nodes = snap.data?.nodes || [];
    const hit = nodes.find((n) =>
      DEV_MENU_LABELS.includes((n.label || '').trim())
    );
    if (!hit) return attempt > 0;
    console.log(`  dev menu: pressing "${hit.label}" (@${hit.ref})`);
    ad('press-devmenu', ['press', `@${hit.ref}`, ...globals]);
    sleepSync(1000);
  }
  warn('dev-menu labels still present after 3 dismissal attempts');
  return true;
}

function onSurfaceScreen(globals, stories) {
  const snap = ad('snapshot-raw', ['snapshot', '--raw', ...globals]);
  const nodes = snap.data?.nodes || [];
  return stories.every((story) => nodes.some((n) => n.identifier === story));
}

function navigateToSurface(globals, stories) {
  if (onSurfaceScreen(globals, stories)) {
    console.log('  already on the Surface screen');
    return;
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    ad('scroll-1', ['scroll', 'down', '6', '--settle', ...globals]);
    ad('scroll-2', ['scroll', 'down', '6', '--settle', ...globals]);

    // `find 'label="Surface"'` is AMBIGUOUS_MATCH on Android (and taps as a
    // side effect on iOS), so press by ref off a fresh snapshot instead.
    const snap = ad('snapshot-list', ['snapshot', ...globals]);
    const candidates = (snap.data?.nodes || []).filter(
      (n) => (n.label || '').trim() === 'Surface'
    );
    if (candidates.length === 0) {
      if (attempt === 2)
        fail('could not find the "Surface" row in the example list');
      continue;
    }

    // Prefer the largest match: the row container on Android, the label on iOS.
    const area = (n) => (n.rect?.width || 0) * (n.rect?.height || 0);
    const target = candidates.sort((a, b) => area(b) - area(a))[0];
    console.log(`  pressing "Surface" row (@${target.ref})`);
    ad('press-surface', ['press', `@${target.ref}`, '--settle', ...globals]);

    if (onSurfaceScreen(globals, stories)) return;
    if (attempt === 2)
      fail('pressed the "Surface" row but the example screen did not appear');
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { platform } = opts;

  if (!fs.existsSync(ENV_FILE)) fail(`missing ${ENV_FILE}`);
  const envFile = JSON.parse(fs.readFileSync(ENV_FILE, 'utf8'));
  const env = platform === 'ios' ? envFile : { ...envFile.android };

  const outDir = path.join(VISUAL_DIR, 'artifacts', 'run', platform);
  cmdDir = path.join(outDir, 'cmds');
  fs.mkdirSync(cmdDir, { recursive: true });

  const globals =
    platform === 'ios'
      ? ['--platform', 'ios', '--udid', env.udid]
      : [
          '--platform',
          'android',
          '--session',
          env.agentDeviceSession || 'android',
        ];

  console.log(
    `# ${platform} — threshold ${opts.threshold}${opts.update ? ' (update)' : ''}`
  );
  const observed = checkEnvironment(platform, env);

  const startedAt = Date.now();
  ad('open', ['open', BUNDLE_ID, ...globals]);
  dismissDevMenu(globals);
  navigateToSurface(globals, opts.stories);
  ad('wait-stable', ['wait', 'stable', '500', '10000', ...globals]);
  sleepSync(2000); // covers the customFontLoaded theme swap, which has no node change

  const results = [];
  let failed = false;

  for (const story of opts.stories) {
    const current = path.join(outDir, `${story}.png`);
    const shotArgs = [
      'screenshot',
      current,
      '--crop-on',
      `id="${story}"`,
      ...globals,
    ];
    // --pixel-density is iOS-only (UNSUPPORTED_OPERATION on Android).
    if (platform === 'ios')
      shotArgs.push('--pixel-density', String(env.pixelDensity || 3));
    const shot = ad(`screenshot-${story}`, shotArgs);

    const baseline = resolveBaseline(platform, story);

    if (opts.update) {
      fs.copyFileSync(current, baseline);
      console.log(
        `${platform} ${story} baseline updated → ${path.relative(VISUAL_DIR, baseline)}`
      );
      results.push({
        story,
        updated: true,
        baseline,
        current,
        width: shot.data?.width ?? null,
        height: shot.data?.height ?? null,
      });
      continue;
    }

    const diffOut = path.join(outDir, `${story}-diff.png`);
    const diff = ad(`diff-${story}`, [
      'diff',
      'screenshot',
      '--baseline',
      baseline,
      current,
      '--out',
      diffOut,
      '--threshold',
      String(opts.threshold),
      ...globals,
    ]);

    const changed = diff.data?.differentPixels ?? -1;
    const pct = diff.data?.mismatchPercentage ?? -1;
    const regions = diff.data?.regions?.length ?? 0;
    const pass = diff.data?.match === true;
    if (!pass) failed = true;

    console.log(
      `${platform} ${story} changed=${changed} (${pct}%) regions=${regions} threshold=${opts.threshold} → ${pass ? 'PASS' : 'FAIL'}`
    );

    results.push({
      story,
      baseline,
      current,
      diff: diffOut,
      totalPixels: diff.data?.totalPixels ?? null,
      changedPixels: changed,
      mismatchPercentage: pct,
      regions: diff.data?.regions ?? [],
      threshold: opts.threshold,
      pass,
    });
  }

  const summary = {
    platform,
    threshold: opts.threshold,
    update: opts.update,
    stories: opts.stories,
    agentDeviceVersion: AGENT_DEVICE,
    sessionCwd: SESSION_CWD,
    expectedEnv: env,
    observedEnv: observed,
    startedAt: new Date(startedAt).toISOString(),
    wallClockMs: Date.now() - startedAt,
    results,
    pass: !failed,
  };
  fs.writeFileSync(
    path.join(outDir, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );

  process.exit(failed ? 1 : 0);
}

main();
