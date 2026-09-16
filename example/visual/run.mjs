#!/usr/bin/env node
/**
 * Visual regression loop for the Surface example (PoC).
 *
 *   node example/visual/run.mjs --platform ios|android [--update] [--force]
 *                               [--threshold 0.02] [--story surface-example-elevated,surface-example-flat]
 *                               [--out <dir>]
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
 *
 * Every run relaunches the app: the example app persists its navigation state
 * (PERSISTENCE_KEY in example/src/index.tsx), and only a relaunch makes the app
 * fetch a fresh JS bundle from Metro — Fast Refresh alone was observed not to
 * reach the Android app, which made captures silently stale.
 *
 * Exit codes: 0 pass, 1 a story FAILed the diff, 2 setup/environment error,
 * 3 a capture came back with the wrong dimensions. `summary.json` is written in
 * the output directory in every one of those cases, except an argument error,
 * which prints the problem and exits 2 before there are any options to summarise.
 *
 * Unit tests: node --test example/visual/run.test.mjs
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
const DEFAULT_STORIES = ['surface-example-elevated', 'surface-example-flat'];
const DEFAULT_THRESHOLD = 0.02; // PoC finding: the CLI default of 0.1 misses soft-shadow regressions.
const SCROLL_STEP = 6; // rows per `scroll down` in the example list
const MAX_SCROLL_STEPS = 6; // bound the search so a wrong screen fails instead of looping
const MAX_BACK_STEPS = 8; // deepest example nesting is 2; 8 leaves room and still terminates
const MAX_OVERLAY_STEPS = 5; // dev menu + dev launcher, each possibly twice

// App-ready polling. Right after `open` the tree is just the splash screen
// (iOS: 3 nodes — Application, SplashScreenLogo, "Downloading 100%…"), and
// after leaving the Android dev launcher it is an 11-node "Connecting to the
// development server…" screen, so any check that snapshots immediately reads
// the wrong screen. Node count alone is not enough: the loading screens are
// matched by label too.
const READY_TIMEOUT_MS = 30000;
const READY_POLL_MS = 1000;
const READY_MIN_NODES = 10;
const NOT_READY_LABEL =
  /^(Downloading|Connecting to|Loading|Building JavaScript bundle)/i;
const NOT_READY_IDENTIFIER = /SplashScreen/i;

// Overlay detection. The dev-menu labels are generic, so they only count when
// a dev-menu-only marker is on screen too; the dev launcher is Expo's
// "DEVELOPMENT SERVERS / RECENTLY OPENED" screen, which no dev-menu label hits.
const DEV_MENU_LABELS = ['Close', 'Continue'];
const DEV_MENU_MARKERS = [
  'Reload',
  'Go home',
  'Fast refresh',
  'Fast Refresh',
  'TOOLS',
  'Toggle element inspector',
  'Open DevTools',
];
const DEV_LAUNCHER_MARKERS = ['DEVELOPMENT SERVERS', 'RECENTLY OPENED'];
const METRO_PORT = '8081';

// The Expo dev client's floating "Tools" button: a small image control labelled
// exactly "Tools", drawn on top of the app. On Android at 480 dpi it sits in the
// top-right corner of the surface-example-elevated crop, where it diffs as a
// deterministic ~2,800-pixel "regression" with the library untouched. The dev
// menu has a "TOOLS" section of its own, so a tree showing the dev menu is
// excluded outright; its rows are text nodes, which is what the type check
// rules out (android.widget.TextView on Android, StaticText on iOS).
const FLOATING_TOOLS_LABEL = 'Tools';
const TOOLS_TOGGLE_LABEL = 'Tools button'; // the dev menu row that toggles it
const DEV_MENU_CLOSE_LABEL = 'Close';
const ANDROID_KEYCODE_MENU = '82'; // opens the RN dev menu via adb

const LIST_ROOT_TITLE = 'Examples'; // Appbar title of the example-list root
const SURFACE_ROW_LABEL = 'Surface';
const BACK_LABEL = 'Back';

// agent-device sessions are keyed by cwd. Point this at the directory whose
// session is already bound to the intended device to reuse that binding;
// otherwise a fresh session is created and bound by `open --udid`.
const SESSION_CWD = process.env.AGENT_DEVICE_SESSION_CWD || VISUAL_DIR;

let commandSeq = 0;
let cmdDir = VISUAL_DIR;

/**
 * A failure with an exit code attached. Thrown rather than exiting on the spot
 * so that main() can still write summary.json before the process ends.
 */
class RunFailure extends Error {
  constructor(message, exitCode) {
    super(message);
    this.name = 'RunFailure';
    this.exitCode = exitCode;
  }
}

function fail(message, code = 2) {
  throw new RunFailure(message, code);
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
    force: false,
    threshold: DEFAULT_THRESHOLD,
    stories: DEFAULT_STORIES,
    outDir: null,
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
      case '--force':
        out.force = true;
        break;
      case '--threshold':
        out.threshold = Number(next());
        break;
      case '--out':
        out.outDir = path.resolve(next());
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
          'usage: node example/visual/run.mjs --platform ios|android [--update] [--force]\n' +
            '                                  [--threshold <0-1>] [--story|--stories a,b] [--out <dir>]\n' +
            '\n' +
            '  --update  write the captures to __baselines__/<platform>/ instead of diffing\n' +
            '            them (the capture-size check is skipped; the captured dimensions\n' +
            '            are printed instead)\n' +
            '  --force   run even though the device does not match env.json. It covers the\n' +
            '            device check only — a capture-size mismatch is never overridden.'
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
  if (out.outDir == null) {
    out.outDir = path.join(VISUAL_DIR, 'artifacts', 'run', out.platform);
  }

  return out;
}

/**
 * Environment for the nested `npx agent-device` call. When this script itself
 * runs under `npx -p node@20 node run.mjs`, npx exports `npm_config_package`
 * (and friends) into the child; the nested npx then reads that, installs
 * node@20 and treats `agent-device@0.21.0` as a command name inside it. Strip
 * every npm_config_* variable so the nested npx resolves its own package.
 */
function spawnEnv() {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith('npm_config_')) env[key] = value;
  }
  return env;
}

/** Runs one agent-device command, records its JSON, returns the parsed payload. */
function ad(label, args, { allowFail = false } = {}) {
  const argv = [AGENT_DEVICE, ...args, '--json'];
  const startedAt = Date.now();
  const proc = spawnSync('npx', argv, {
    cwd: SESSION_CWD,
    encoding: 'utf8',
    env: spawnEnv(),
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

/**
 * Snapshot helper. `--force-full` on every call: without it agent-device
 * returns an empty `nodes` array whenever the tree is unchanged, which reads
 * as "the element is gone" (PoC issue 13).
 */
function snapshot(label, globals, extra = []) {
  const snap = ad(label, ['snapshot', ...extra, '--force-full', ...globals]);
  return snap.data?.nodes || [];
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

/**
 * Reads the simulator matching `expectedUdid` out of `xcrun simctl list`.
 * Returns `{ observed }` on success, or `{ error }` describing why the device
 * could not be inspected.
 */
function observeIos(expectedUdid) {
  const res = sh('xcrun', ['simctl', 'list', '-j', 'devices']);
  if (res.status !== 0) {
    return {
      error: {
        what: 'device inspection',
        expected: `xcrun simctl list to succeed for udid ${expectedUdid}`,
        actual: `exit ${res.status} ${res.stderr.trim()}`,
      },
    };
  }

  let devices;
  try {
    devices = JSON.parse(res.stdout).devices || {};
  } catch {
    return {
      error: {
        what: 'device inspection',
        expected: 'parseable xcrun simctl list output',
        actual: 'unparseable JSON',
      },
    };
  }

  let match = null;
  for (const [runtime, list] of Object.entries(devices)) {
    for (const device of list) {
      if (device.udid === expectedUdid) match = { runtime, device };
    }
  }

  if (!match) {
    return {
      error: {
        what: 'udid',
        expected: expectedUdid,
        actual: 'not present in xcrun simctl list (no such simulator)',
      },
    };
  }

  return {
    observed: {
      udid: match.device.udid,
      name: match.device.name,
      runtime: match.runtime,
      state: match.device.state,
    },
  };
}

/** Reads API level, release and density off the connected device via adb. */
function observeAndroid() {
  const adb = adbPath();
  const prop = (name) => sh(adb, ['shell', 'getprop', name]).stdout.trim();
  const sdkLevel = prop('ro.build.version.sdk');
  if (!sdkLevel) {
    return {
      error: {
        what: 'device inspection',
        expected: `Android properties readable via ${adb}`,
        actual: 'no response (is an emulator connected?)',
      },
    };
  }

  const densityOut = sh(adb, ['shell', 'wm', 'density']).stdout;
  const densityMatch = densityOut.match(/(\d+)\s*$/m);

  return {
    observed: {
      apiLevel: Number(sdkLevel),
      androidRelease: prop('ro.build.version.release'),
      density: densityMatch ? Number(densityMatch[1]) : null,
    },
  };
}

const DEFAULT_OBSERVERS = { observeIos, observeAndroid };

/**
 * Compares the connected device with env.json. Returns the observed values and
 * the list of mismatches; the caller decides what to do with them. A device
 * that cannot be inspected counts as a mismatch: baselines are only meaningful
 * on a device we could actually identify. The observers are injected so the
 * comparison can be tested without xcrun/adb.
 */
function checkEnvironment(platform, env, observers = DEFAULT_OBSERVERS) {
  const mismatches = [];
  const mismatch = (what, expected, actual) =>
    mismatches.push(`${what}: expected ${expected}, observed ${actual}`);

  const read =
    platform === 'ios'
      ? observers.observeIos(env.udid)
      : observers.observeAndroid();
  if (read.error) {
    mismatch(read.error.what, read.error.expected, read.error.actual);
    return { observed: {}, mismatches };
  }
  const observed = read.observed;

  if (platform === 'ios') {
    // The runtime identifier carries the iOS version (…SimRuntime.iOS-26-5), so
    // comparing it also covers env.iosVersion.
    if (env.runtime && observed.runtime !== env.runtime) {
      mismatch('runtime', env.runtime, observed.runtime);
    }
    if (env.device && observed.name !== env.device) {
      mismatch('device name', env.device, observed.name);
    }
    if (observed.state !== 'Booted') {
      mismatch('device state', 'Booted', observed.state);
    }
    return { observed, mismatches };
  }

  if (env.apiLevel != null && observed.apiLevel !== env.apiLevel) {
    mismatch('Android API level', env.apiLevel, observed.apiLevel);
  }
  if (env.density != null && observed.density !== env.density) {
    mismatch('Android density', env.density, observed.density ?? 'unreadable');
  }
  return { observed, mismatches };
}

/**
 * Throws unless the device matches env.json. `--force` downgrades the
 * mismatches to warnings so a deliberate re-baseline on another device is
 * still possible, but never by accident. This is the only check `--force`
 * covers.
 */
function enforceEnvironment(
  platform,
  env,
  force,
  observers = DEFAULT_OBSERVERS
) {
  const { observed, mismatches } = checkEnvironment(platform, env, observers);
  if (mismatches.length === 0) return observed;

  const detail = mismatches.map((m) => `  - ${m}`).join('\n');
  if (force) {
    warn(`device does not match ${ENV_FILE} (--force):\n${detail}`);
    return observed;
  }
  fail(
    `device does not match ${ENV_FILE}:\n${detail}\n` +
      'refusing to run: baselines are only comparable on the device they were captured on. ' +
      'Boot/point at the right device, or pass --force to continue anyway.'
  );
  return observed; // unreachable; keeps the return type honest
}

/** Canonical baseline path: __baselines__/<platform>/<story>.png */
function baselinePath(platform, story) {
  return path.join(BASELINE_DIR, platform, `${story}.png`);
}

/** Normal mode: a missing baseline is a hard error naming the exact path. */
function requireBaseline(platform, story) {
  const baseline = baselinePath(platform, story);
  if (!fs.existsSync(baseline)) {
    fail(
      `no baseline for ${story}: expected ${baseline} — ` +
        'run with --update to create it'
    );
  }
  return baseline;
}

/**
 * `--update` mode: write the capture to the baseline, creating it if new. The
 * captured dimensions go in the log line because the size check is skipped in
 * this mode (see checkCaptureSize) — this is the only place a human sees what
 * the new baseline actually measures.
 */
function writeBaseline(platform, story, current, shotData) {
  const baseline = baselinePath(platform, story);
  const created = !fs.existsSync(baseline);
  fs.mkdirSync(path.dirname(baseline), { recursive: true });
  fs.copyFileSync(current, baseline);
  const size = `${shotData?.width ?? '?'}x${shotData?.height ?? '?'}`;
  console.log(
    `${platform} ${story} baseline ${created ? 'created' : 'updated'} (${size}) → ${path.relative(VISUAL_DIR, baseline)}`
  );
  return { baseline, created };
}

/**
 * Width and height out of a PNG's IHDR: the signature is 8 bytes, the IHDR
 * length+type another 8, so the two big-endian uint32s live at bytes 16–24. No
 * decoding and no dependency — the header is all this needs.
 */
function readPngSize(file) {
  const header = Buffer.alloc(24);
  let read = 0;
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    read = fs.readSync(fd, header, 0, 24, 0);
  } catch {
    return null;
  } finally {
    if (fd != null) fs.closeSync(fd);
  }
  if (read < 24 || header.toString('ascii', 12, 16) !== 'IHDR') return null;
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

/**
 * Fails unless the capture has the same dimensions as the committed baseline it
 * is about to be compared with. A wrong-sized capture would otherwise diff
 * clean and read as PASS — and so would a capture whose size agent-device did
 * not report at all, which is why a missing value is a failure rather than a
 * warning.
 *
 * The expected size comes from the baseline PNG itself rather than from
 * env.json: that makes it per story by construction, so a story that was just
 * added and `--update`d passes, and it cannot drift from the file the diff
 * actually uses.
 *
 * Skipped entirely in `--update` mode: the whole point of that mode is to
 * record what the device produces now, and a new story has no baseline to check
 * against. In diff mode there is no override — a size mismatch on a device that
 * matches env.json means something is wrong that no flag should paper over, so
 * `--force` does not reach this check.
 */
function checkCaptureSize(
  env,
  story,
  shotData,
  { update = false, baselineFile = null } = {}
) {
  if (update) return;

  const expected = baselineFile ? readPngSize(baselineFile) : null;
  const problems = [];

  if (!expected) {
    fail(
      `${story}: could not read the dimensions of the baseline PNG ` +
        `(${baselineFile ?? 'none given'}), so the capture cannot be ` +
        'size-checked — re-record the baseline with --update',
      3
    );
  }

  const compare = (what, want, got) => {
    if (got == null) {
      problems.push(
        `${what}: expected ${want}, agent-device reported no ${what}`
      );
      return;
    }
    if (Number(got) !== Number(want)) {
      problems.push(`${what}: expected ${want}, actual ${got}`);
    }
  };

  compare('width', expected.width, shotData?.width);
  compare('height', expected.height, shotData?.height);
  // pixelDensity is reported (and pinnable) on iOS only. Android screenshots
  // are native device pixels and env.json pins no density there, so the check
  // is skipped rather than warned about.
  if (env.pixelDensity != null) {
    compare('pixelDensity', env.pixelDensity, shotData?.pixelDensity);
  }

  if (problems.length === 0) return;

  const detail = problems.map((p) => `  - ${p}`).join('\n');
  fail(
    `${story}: capture dimensions do not match the baseline ` +
      `${path.relative(VISUAL_DIR, baselineFile)}:\n${detail}\n` +
      'a wrong-sized capture cannot be compared with the baseline. Check ' +
      '--crop-on/--pixel-density and the device; if the new size is the intended ' +
      'one, re-record the baselines with --update. (--force does not override this.)',
    3
  );
}

const labelOf = (node) => (node.label || '').trim();
const hasLabel = (nodes, label) => nodes.some((n) => labelOf(n) === label);

/**
 * Nodes that belong to the app. On Android a snapshot also carries the system
 * UI status bar (~10 nodes), which is present even while the app is still
 * starting, so it must not count towards readiness.
 */
function appNodes(nodes) {
  return nodes.filter((n) => !n.bundleId || n.bundleId === BUNDLE_ID);
}

function looksReady(nodes) {
  const own = appNodes(nodes);
  if (own.length <= READY_MIN_NODES) return false;
  return !own.some(
    (n) =>
      NOT_READY_LABEL.test(labelOf(n)) ||
      NOT_READY_IDENTIFIER.test(n.identifier || '')
  );
}

/**
 * Polls the accessibility tree until the app has rendered something real:
 * more than READY_MIN_NODES app nodes and no splash/"Downloading" node. Bounded
 * so a stuck launch fails instead of hanging.
 */
function waitForAppReady(globals, timeoutMs = READY_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  let nodes = snapshot('snapshot-ready', globals);
  while (!looksReady(nodes) && Date.now() < deadline) {
    sleepSync(READY_POLL_MS);
    nodes = snapshot('snapshot-ready', globals);
  }
  if (!looksReady(nodes)) {
    fail(
      `the app did not become ready within ${timeoutMs}ms — the last snapshot ` +
        `had ${appNodes(nodes).length} app nodes ` +
        `(${appNodes(nodes)
          .slice(0, 3)
          .map((n) => labelOf(n) || n.identifier || n.type)
          .join(' / ')})`
    );
  }
  console.log(`  app ready (${appNodes(nodes).length} app nodes)`);
  return nodes;
}

/** The RN dev menu: a Close/Continue control with a dev-menu-only marker next to it. */
function findDevMenuNode(nodes) {
  const marker = nodes.some((n) => DEV_MENU_MARKERS.includes(labelOf(n)));
  if (!marker) return null;
  return nodes.find((n) => DEV_MENU_LABELS.includes(labelOf(n))) || null;
}

/** The floating dev-client "Tools" button, or null when it is not on screen. */
function findFloatingToolsNode(nodes) {
  if (nodes.some((n) => DEV_MENU_MARKERS.includes(labelOf(n)))) return null;
  return (
    nodes.find(
      (n) => labelOf(n) === FLOATING_TOOLS_LABEL && !/text/i.test(n.type || '')
    ) || null
  );
}

function describeNode(node) {
  const rect = node.rect || {};
  const round = (value) => Math.round(value ?? -1);
  return (
    `${node.type || 'node'} label="${labelOf(node)}" at ` +
    `{x:${round(rect.x)}, y:${round(rect.y)}, ` +
    `w:${round(rect.width)}, h:${round(rect.height)}}`
  );
}

/**
 * Turns the floating dev-client "Tools" button off through the dev menu, once,
 * and returns the settled tree. A dev overlay inside the crop must never be
 * reported as a visual regression, so anything that leaves it on screen — a
 * platform with no way to open the dev menu, or a toggle that did not take —
 * is a setup error naming the node and the manual fix.
 *
 * Android opens the dev menu with KEYCODE_MENU. agent-device 0.21.0 has no
 * dev-menu/shake command (checked in `help commands`), so on iOS there is
 * nothing to drive and the run stops instead.
 */
function disableFloatingTools(platform, globals, nodes) {
  const tools = findFloatingToolsNode(nodes);
  if (!tools) return nodes;

  const giveUp = (why) =>
    fail(
      `the dev-client floating Tools button is inside the capture area ` +
        `(${describeNode(tools)}) and ${why}. Turn it off on the device: ` +
        'dev menu → Tools button.'
    );

  if (platform !== 'android') giveUp('cannot be toggled automatically on iOS');

  const menu = sh(adbPath(), [
    'shell',
    'input',
    'keyevent',
    ANDROID_KEYCODE_MENU,
  ]);
  if (menu.status !== 0) {
    fail(
      `adb input keyevent ${ANDROID_KEYCODE_MENU} failed: ${menu.stderr.trim()}`
    );
  }

  let current = waitForAppReady(globals);
  for (const label of [TOOLS_TOGGLE_LABEL, DEV_MENU_CLOSE_LABEL]) {
    if (!current.some((n) => labelOf(n) === label)) {
      giveUp(`the dev menu has no "${label}" entry`);
    }
    console.log(`  dev menu: pressing "${label}"`);
    // By selector, not by ref: the dev menu's "Close" is a container whose
    // tappable area belongs entirely to an unlabelled child, so pressing its
    // own ref is rejected (covered_by_interactive_descendants). The selector
    // lets agent-device resolve down to that child.
    ad(`press-${label.replace(/\s+/g, '-').toLowerCase()}`, [
      'press',
      `label="${label}"`,
      '--settle',
      ...globals,
    ]);
    current = waitForAppReady(globals);
  }

  if (findFloatingToolsNode(current))
    giveUp('is still on screen after one toggle');

  console.log(
    '  dev-client floating Tools button was inside the capture area — ' +
      'disabled it via the dev menu'
  );
  return current;
}

/**
 * The Expo dev launcher ("DEVELOPMENT SERVERS" / "RECENTLY OPENED"). It is left
 * behind by an Android relaunch and none of the dev-menu labels match it. The
 * way out is the recently-opened row carrying the Metro URL; if the launcher is
 * up but that row is not there, the run fails rather than pressing whatever row
 * happens to be nearby, which could open a different app.
 */
function findDevLauncherNode(nodes) {
  if (!nodes.some((n) => DEV_LAUNCHER_MARKERS.includes(labelOf(n)))) {
    return null;
  }

  const metroRow = nodes.find(
    (n) => labelOf(n).startsWith('http://') && labelOf(n).includes(METRO_PORT)
  );
  if (metroRow) return metroRow;

  fail(
    'the Expo dev launcher is on screen but has no recently-opened row for ' +
      `http://…:${METRO_PORT} — start Metro and open the app from the launcher once`
  );
  return null; // unreachable
}

/**
 * Clears the two dev overlays a relaunch can land in, handling them distinctly
 * and re-checking after every press. Returns the settled tree.
 */
function dismissOverlays(globals) {
  let nodes = waitForAppReady(globals);

  for (let step = 0; step < MAX_OVERLAY_STEPS; step++) {
    const devMenu = findDevMenuNode(nodes);
    if (devMenu) {
      console.log(
        `  dev menu: pressing "${labelOf(devMenu)}" (@${devMenu.ref})`
      );
      ad('press-devmenu', ['press', `@${devMenu.ref}`, '--settle', ...globals]);
      nodes = waitForAppReady(globals);
      continue;
    }

    const launcher = findDevLauncherNode(nodes);
    if (launcher) {
      console.log(
        `  dev launcher: pressing "${labelOf(launcher)}" (@${launcher.ref})`
      );
      ad('press-launcher', [
        'press',
        `@${launcher.ref}`,
        '--settle',
        ...globals,
      ]);
      nodes = waitForAppReady(globals);
      continue;
    }

    return nodes;
  }

  fail(
    `a dev overlay was still on screen after ${MAX_OVERLAY_STEPS} dismissal ` +
      'attempts (dev menu and/or Expo dev launcher)'
  );
  return nodes; // unreachable
}

function onSurfaceScreen(globals, stories) {
  const nodes = snapshot('snapshot-raw', globals, ['--raw']);
  return stories.every((story) => nodes.some((n) => n.identifier === story));
}

/**
 * The example-list root is the only screen whose Appbar title is "Examples",
 * and it shows the drawer button where every example screen shows "Back". Both
 * signals are required: "no Back element" on its own is also true of a screen
 * with no header at all, which would make any such screen read as the list.
 */
function atListRoot(nodes) {
  return hasLabel(nodes, LIST_ROOT_TITLE) && !hasLabel(nodes, BACK_LABEL);
}

/**
 * Pops the navigation stack until the example list root is on screen. Uses the
 * Appbar "Back" element when there is one (present on both platforms), and
 * falls back to platform back navigation for a screen with no header.
 */
function goBackToListRoot(platform, globals, nodes) {
  let current = nodes;

  for (let step = 0; step < MAX_BACK_STEPS; step++) {
    if (atListRoot(current)) return current;

    const back = current.find((n) => labelOf(n) === BACK_LABEL);
    if (back) {
      console.log(`  pressing "Back" (@${back.ref})`);
      ad('press-back', ['press', `@${back.ref}`, '--settle', ...globals]);
    } else if (platform === 'android') {
      console.log('  no "Back" element — sending Android KEYCODE_BACK');
      const res = sh(adbPath(), ['shell', 'input', 'keyevent', '4']);
      if (res.status !== 0) {
        fail(`adb input keyevent 4 failed: ${res.stderr.trim()}`);
      }
    } else {
      console.log('  no "Back" element — using system back');
      ad('back', ['back', '--system', '--settle', ...globals]);
    }

    current = waitForAppReady(globals);
  }

  fail(
    `could not reach the example list: after ${MAX_BACK_STEPS} back steps the ` +
      `"${LIST_ROOT_TITLE}" title was still not on screen (last screen: ` +
      `${current
        .map((n) => labelOf(n))
        .filter(Boolean)
        .slice(0, 5)
        .join(' / ')})`
  );
  return current; // unreachable
}

/**
 * Picks the "Surface" LIST ROW out of a snapshot of the example list.
 *
 * Several nodes can carry that label, and pressing the wrong one is a no-op
 * that reads as a navigation failure: the Appbar title of the Surface screen
 * itself, and on Android both the row container and its inset text child. The
 * row is the candidate that
 *   - sits below the Appbar — rect.y at or past the bottom of the
 *     "Examples" title node (iOS 108pt, Android 294px), which is what excludes
 *     any header/title node, and
 *   - spans the list — width at least 90% of the screen, which excludes the
 *     Android Appbar title (1100 of 1280px) a second way, and then the widest
 *     of what is left, i.e. the row container (iOS 402 of 402pt, Android 1280
 *     of 1280px) rather than its inset text child (Android 1160px).
 *
 * With no "Examples" title in the tree this is not the list root, so there is
 * no row to press and the function reports nothing rather than guessing.
 */
function findSurfaceRow(nodes) {
  const titles = nodes.filter((n) => labelOf(n) === LIST_ROOT_TITLE);
  if (titles.length === 0) return null;
  const headerBottom = Math.max(
    ...titles.map((n) => (n.rect?.y ?? 0) + (n.rect?.height ?? 0))
  );
  const screenWidth = Math.max(0, ...nodes.map((n) => n.rect?.width ?? 0));

  const candidates = nodes.filter(
    (n) =>
      labelOf(n) === SURFACE_ROW_LABEL &&
      (n.rect?.y ?? -1) >= headerBottom &&
      (n.rect?.width ?? 0) >= 0.9 * screenWidth
  );
  if (candidates.length === 0) return null;

  return candidates.sort(
    (a, b) => (b.rect?.width || 0) - (a.rect?.width || 0)
  )[0];
}

/**
 * Scrolls down the example list until the "Surface" row shows up, then opens
 * it. The caller must have put the app on the list root first, since scrolling
 * only ever goes down.
 */
function navigateToSurface(globals, stories) {
  for (let step = 0; step <= MAX_SCROLL_STEPS; step++) {
    const nodes = snapshot('snapshot-list', globals);
    const target = findSurfaceRow(nodes);

    if (target) {
      // Press by ref off a fresh snapshot: `find 'label="Surface"'` is
      // AMBIGUOUS_MATCH on Android and taps as a side effect on iOS.
      console.log(
        `  pressing the "Surface" row (@${target.ref}, ${target.type}, ` +
          `y=${Math.round(target.rect?.y ?? -1)}, w=${Math.round(target.rect?.width ?? -1)})`
      );
      ad('press-surface', ['press', `@${target.ref}`, '--settle', ...globals]);

      if (onSurfaceScreen(globals, stories)) return;
      fail(
        `pressed the "Surface" row but the example screen did not appear ` +
          `(expected ids: ${stories.join(', ')})`
      );
    }

    if (step < MAX_SCROLL_STEPS) {
      ad('scroll', [
        'scroll',
        'down',
        String(SCROLL_STEP),
        '--settle',
        ...globals,
      ]);
    }
  }

  fail(
    `could not find the "Surface" row after ${MAX_SCROLL_STEPS} scrolls of ` +
      `${SCROLL_STEP} rows — is the example list on screen?`
  );
}

/**
 * Relaunches the app and leaves it on the Surface example screen.
 *
 * The relaunch is unconditional. The app persists its navigation state
 * (PERSISTENCE_KEY in example/src/index.tsx), so "already on the Surface
 * screen" says nothing about which screen a plain `open` will land on, and —
 * more importantly — only a relaunch makes the app fetch the current JS bundle
 * from Metro. Skipping it on the strength of the screen that happens to be up
 * captured a stale bundle on Android.
 */
function openOnSurfaceScreen(platform, globals, stories) {
  console.log('  relaunching the app (fresh bundle from Metro)');
  if (platform === 'ios') {
    ad('open-relaunch', ['open', BUNDLE_ID, '--relaunch', ...globals]);
  } else {
    const stop = sh(adbPath(), ['shell', 'am', 'force-stop', BUNDLE_ID]);
    if (stop.status !== 0) {
      fail(`adb force-stop ${BUNDLE_ID} failed: ${stop.stderr.trim()}`);
    }
    ad('open-after-force-stop', ['open', BUNDLE_ID, ...globals]);
  }

  const nodes = disableFloatingTools(
    platform,
    globals,
    dismissOverlays(globals)
  );

  if (onSurfaceScreen(globals, stories)) {
    console.log('  restored onto the Surface screen');
    return;
  }

  console.log('  not on the Surface screen — going back to the example list');
  const rootNodes = goBackToListRoot(platform, globals, nodes);
  console.log(`  at the example list root (${rootNodes.length} nodes)`);
  navigateToSurface(globals, stories);
}

/**
 * The whole device pass. Mutates `state` as it goes so main() can write a
 * summary whether this returns or throws. Returns the exit code (0 or 1).
 */
function runPass(state) {
  const opts = state.opts;
  const { platform } = opts;

  if (!fs.existsSync(ENV_FILE)) fail(`missing ${ENV_FILE}`);
  const envFile = JSON.parse(fs.readFileSync(ENV_FILE, 'utf8'));
  const env = platform === 'ios' ? envFile : { ...envFile.android };
  state.env = env;

  const globals =
    platform === 'ios'
      ? ['--platform', 'ios', '--udid', env.udid]
      : [
          '--platform',
          'android',
          '--session',
          env.agentDeviceSession || 'android',
        ];

  state.observedEnv = enforceEnvironment(platform, env, opts.force);

  openOnSurfaceScreen(platform, globals, opts.stories);
  ad('wait-stable', ['wait', 'stable', '500', '10000', ...globals]);
  sleepSync(2000); // covers the customFontLoaded theme swap, which has no node change

  let failed = false;

  for (const story of opts.stories) {
    const current = path.join(opts.outDir, `${story}.png`);
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

    if (opts.update) {
      checkCaptureSize(env, story, shot.data, { update: true });
      const { baseline, created } = writeBaseline(
        platform,
        story,
        current,
        shot.data
      );
      state.results.push({
        story,
        updated: !created,
        created,
        baseline,
        current,
        width: shot.data?.width ?? null,
        height: shot.data?.height ?? null,
      });
      continue;
    }

    const baseline = requireBaseline(platform, story);
    checkCaptureSize(env, story, shot.data, { baselineFile: baseline });

    const diffOut = path.join(opts.outDir, `${story}-diff.png`);
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

    state.results.push({
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

  return failed ? 1 : 0;
}

function writeSummary(state, exitCode, error) {
  const { opts } = state;
  const summary = {
    platform: opts.platform,
    threshold: opts.threshold,
    update: opts.update,
    force: opts.force,
    stories: opts.stories,
    outDir: opts.outDir,
    agentDeviceVersion: AGENT_DEVICE,
    sessionCwd: SESSION_CWD,
    expectedEnv: state.env,
    observedEnv: state.observedEnv,
    startedAt: new Date(state.startedAt).toISOString(),
    wallClockMs: Date.now() - state.startedAt,
    results: state.results,
    status: exitCode === 0 ? 'pass' : exitCode === 1 ? 'fail' : 'error',
    exitCode,
    error,
    pass: exitCode === 0,
  };
  const file = path.join(opts.outDir, 'summary.json');
  fs.mkdirSync(opts.outDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(summary, null, 2));
  return file;
}

function main() {
  const argv = process.argv.slice(2);

  // An argument error happens before there are options to summarise (not even
  // an output directory), so it just prints and exits; every later failure
  // goes through writeSummary below.
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (thrown) {
    if (!(thrown instanceof RunFailure)) throw thrown;
    console.error(`error: ${thrown.message}`);
    process.exit(thrown.exitCode);
  }

  const state = {
    opts,
    env: null,
    observedEnv: {},
    results: [],
    startedAt: Date.now(),
  };

  cmdDir = path.join(opts.outDir, 'cmds');
  fs.mkdirSync(cmdDir, { recursive: true });

  console.log(
    `# ${opts.platform} — threshold ${opts.threshold}${opts.update ? ' (update)' : ''}${opts.force ? ' (force)' : ''}`
  );
  console.log(`# output: ${opts.outDir}`);

  let exitCode = 0;
  let error = null;
  try {
    exitCode = runPass(state);
  } catch (thrown) {
    if (thrown instanceof RunFailure) {
      console.error(`error: ${thrown.message}`);
      exitCode = thrown.exitCode;
      error = { message: thrown.message, exitCode: thrown.exitCode };
    } else {
      console.error(thrown?.stack || String(thrown));
      exitCode = 2;
      error = {
        message: thrown?.message || String(thrown),
        stack: thrown?.stack,
        exitCode: 2,
      };
    }
  }

  const summaryFile = writeSummary(state, exitCode, error);
  console.log(`# summary: ${summaryFile} (exit ${exitCode})`);
  process.exit(exitCode);
}

/**
 * True when this module is the process entry point. `import.meta.main` would
 * say the same thing but only exists on Node >= 24.2, and this script has to
 * run on the Node 20 floor in example/package.json. Both sides are realpath'd
 * so a symlinked invocation still matches.
 */
function isMainModule(argvPath, moduleUrl) {
  if (!argvPath) return false;
  const real = (p) => {
    try {
      return fs.realpathSync(p);
    } catch {
      return path.resolve(p);
    }
  };
  return real(argvPath) === real(fileURLToPath(moduleUrl));
}

if (isMainModule(process.argv[1], import.meta.url)) {
  main();
}

// Exported for example/visual/run.test.mjs only.
export {
  RunFailure,
  isMainModule,
  checkCaptureSize,
  enforceEnvironment,
  atListRoot,
  findFloatingToolsNode,
  findSurfaceRow,
};
