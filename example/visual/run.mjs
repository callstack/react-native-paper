#!/usr/bin/env node
/**
 * Visual regression loop for the Surface example (PoC).
 *
 *   node example/visual/run.mjs --platform ios|android [--update]
 *                               [--threshold 0.02] [--story surface-example-elevated,surface-example-flat]
 *                               [--out <dir>]
 *
 * Drives agent-device 0.21.0 through `npx` and parses `--json` stdout. Its
 * Node client was not used because it requires adding agent-device as a
 * dependency, which this PoC avoided; a runner that adopts the tool should
 * switch to the client.
 *
 * The device is resolved from the profile in example/visual/env.json (simulator
 * name plus runtime on iOS, AVD name on Android) and booted if needed, so no
 * UDID or serial is pinned anywhere.
 *
 * Prerequisites (documented, not automated): the example app is already built
 * and installed on a device matching example/visual/env.json, Metro is running,
 * and the baselines in example/visual/__baselines__/<platform>/ were captured
 * on that same device profile.
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

// One fixed session name per platform, so a run is reproducible from any
// directory and the README's hand-run commands address the same session.
const sessionName = (platform) => `paper-visual-${platform}`;

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

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function parseArgs(argv) {
  const out = {
    update: false,
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
          'usage: node example/visual/run.mjs --platform ios|android [--update]\n' +
            '                                  [--threshold <0-1>] [--story|--stories a,b] [--out <dir>]\n' +
            '\n' +
            '  --update  write the captures to __baselines__/<platform>/ instead of diffing\n' +
            '            them (the capture-size check is skipped; the captured dimensions\n' +
            '            are printed instead)'
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
  // A documented lookup path for the Android SDK: agent-device needs the
  // `emulator` binary to list stopped AVDs at all, and looks for the SDK under
  // ANDROID_SDK_ROOT, ANDROID_HOME and ~/Android/Sdk. The standard macOS
  // install is at neither, so point it there when the user has set nothing.
  const sdk = path.join(process.env.HOME || '', 'Library/Android/sdk');
  if (!env.ANDROID_HOME && !env.ANDROID_SDK_ROOT && fs.existsSync(sdk)) {
    env.ANDROID_HOME = sdk;
  }
  return env;
}

/** Runs one agent-device command, records its JSON, returns the parsed payload. */
function ad(label, args, { allowFail = false } = {}) {
  const argv = [AGENT_DEVICE, ...args, '--json'];
  const startedAt = Date.now();
  const proc = spawnSync('npx', argv, {
    cwd: VISUAL_DIR,
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
        cwd: VISUAL_DIR,
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

/** adb addressed at the resolved device, so a second emulator cannot take the call. */
const adb = (device, args) => sh(adbPath(), ['-s', device.id, ...args]);

/**
 * Picks the simulator the baselines belong to out of a parsed
 * `xcrun simctl list -j devices`: the pinned name on the pinned runtime, a
 * booted one first so a second clone is not started for nothing. Pure, so it
 * can be tested against a captured listing. `elsewhere` collects the runtimes
 * that do carry that name, which is the useful half of a "not found" message.
 */
function pickIosCandidate(listing, env) {
  const candidates = [];
  const elsewhere = new Set();

  for (const [runtime, list] of Object.entries(listing?.devices || {})) {
    for (const device of list) {
      if (device.name !== env.device || device.isAvailable === false) continue;
      if (runtime === env.runtime) {
        candidates.push({
          id: device.udid,
          name: device.name,
          runtime,
          state: device.state,
          booted: device.state === 'Booted',
        });
      } else {
        elsewhere.add(runtime);
      }
    }
  }

  return {
    device: candidates.find((c) => c.booted) || candidates[0] || null,
    elsewhere: [...elsewhere],
  };
}

/** Resolves the iOS simulator from the profile. The runtime check is part of it. */
function resolveIos(env) {
  const res = sh('xcrun', ['simctl', 'list', '-j', 'devices']);
  if (res.status !== 0) {
    fail(`xcrun simctl list failed: exit ${res.status} ${res.stderr.trim()}`);
  }

  let listing;
  try {
    listing = JSON.parse(res.stdout);
  } catch {
    fail('xcrun simctl list did not return parseable JSON');
  }

  const { device, elsewhere } = pickIosCandidate(listing, env);
  if (!device) {
    fail(
      `no simulator named ${env.device} on ${env.runtime}` +
        (elsewhere.length
          ? `; that name exists on ${elsewhere.join(', ')}`
          : '') +
        '; create one in Xcode (Devices and Simulators)'
    );
  }
  return device;
}

/**
 * Picks the emulator or stopped AVD matching the profile. agent-device reports
 * a running emulator under its serial and the AVD name as `name`, and a stopped
 * one under the AVD name twice, so both handles are accepted; a physical device
 * with the same marketing name is not an AVD and is ignored. Pure, exported for
 * the tests.
 */
function pickAndroid(devices, env) {
  const candidates = (devices || []).filter(
    (d) => d.kind === 'emulator' && (d.id === env.avd || d.name === env.device)
  );
  return candidates.find((d) => d.booted) || candidates[0] || null;
}

/** Resolves the Android emulator from the profile, booting the AVD if it is stopped. */
function resolveAndroid(env, adFn = ad) {
  const list = adFn('devices-android', ['devices', '--platform', 'android']);
  const found = pickAndroid(list.data?.devices, env);
  if (!found) {
    fail(
      `no AVD named ${env.avd} (agent-device lists stopped AVDs only when the ` +
        'emulator binary is on PATH or ANDROID_HOME is set); create one in ' +
        `Android Studio with ${env.systemImage}`
    );
  }
  if (found.booted) return { id: found.id, name: found.name };

  // No --session on boot: the session may still be bound to a serial from an
  // earlier emulator, and a selector naming another identity is INVALID_ARGS.
  const boot = adFn(
    'boot-android',
    ['boot', '--platform', 'android', '--device', found.id],
    { allowFail: true }
  );
  if (!boot.ok) failAd(`boot ${found.id}`, boot);
  return { id: boot.data?.id || found.id, name: found.name };
}

/** Reports an agent-device failure with its own message and hint, verbatim. */
function failAd(what, res) {
  fail(
    `agent-device ${what} failed: ${res.error?.message || 'no message'}` +
      (res.error?.hint ? `\nhint: ${res.error.hint}` : '')
  );
}

/** Reads API level, release and density off the resolved device via adb. */
function observeAndroid(serial) {
  const adbBin = adbPath();
  const prop = (name) =>
    sh(adbBin, ['-s', serial, 'shell', 'getprop', name]).stdout.trim();
  const sdkLevel = prop('ro.build.version.sdk');
  if (!sdkLevel) {
    return {
      error: {
        what: 'device inspection',
        expected: `Android properties readable via ${adbBin} -s ${serial}`,
        actual: 'no response (is the emulator still up?)',
      },
    };
  }

  // An override set with `wm density` is what the screen actually renders at,
  // so it wins over the physical density of the image.
  const densityOut = sh(adbBin, [
    '-s',
    serial,
    'shell',
    'wm',
    'density',
  ]).stdout;
  const density =
    densityOut.match(/Override density:\s*(\d+)/) ||
    densityOut.match(/Physical density:\s*(\d+)/);

  return {
    observed: {
      apiLevel: Number(sdkLevel),
      androidRelease: prop('ro.build.version.release'),
      density: density ? Number(density[1]) : null,
    },
  };
}

const DEFAULT_OBSERVERS = { observeAndroid };

/**
 * The one check left after resolution, and Android only: an AVD name says
 * nothing about the system image behind it, so the API level and the density
 * the baselines were captured on are still compared. iOS needs nothing here,
 * because resolving the simulator already matched the name and the runtime.
 * The observer is injected so this can be tested without adb.
 */
function enforceEnvironment(
  platform,
  env,
  device,
  observers = DEFAULT_OBSERVERS
) {
  if (platform !== 'android') return {};

  const read = observers.observeAndroid(device.id);
  if (read.error) {
    fail(
      `${read.error.what}: expected ${read.error.expected}, ` +
        `observed ${read.error.actual}`
    );
  }
  const observed = read.observed;

  if (observed.apiLevel !== env.apiLevel || observed.density !== env.density) {
    fail(
      `AVD ${env.avd} reports API ${observed.apiLevel} / ` +
        `${observed.density ?? 'unreadable'} dpi, baselines were captured on ` +
        `API ${env.apiLevel} / ${env.density} dpi. To re-baseline on this ` +
        'image, set apiLevel and density in env.json and run with --update'
    );
  }
  return observed;
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
 * against. In diff mode there is no override: a size mismatch on a device that
 * matches env.json means something is wrong that no flag should paper over.
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
      'one, re-record the baselines with --update.',
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
function disableFloatingTools(platform, globals, device, nodes) {
  const tools = findFloatingToolsNode(nodes);
  if (!tools) return nodes;

  const giveUp = (why) =>
    fail(
      `the dev-client floating Tools button is inside the capture area ` +
        `(${describeNode(tools)}) and ${why}. Turn it off on the device: ` +
        'dev menu → Tools button.'
    );

  if (platform !== 'android') giveUp('cannot be toggled automatically on iOS');

  const menu = adb(device, [
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
function goBackToListRoot(platform, globals, device, nodes) {
  let current = nodes;

  for (let step = 0; step < MAX_BACK_STEPS; step++) {
    if (atListRoot(current)) return current;

    const back = current.find((n) => labelOf(n) === BACK_LABEL);
    if (back) {
      console.log(`  pressing "Back" (@${back.ref})`);
      ad('press-back', ['press', `@${back.ref}`, '--settle', ...globals]);
    } else if (platform === 'android') {
      console.log('  no "Back" element — sending Android KEYCODE_BACK');
      const res = adb(device, ['shell', 'input', 'keyevent', '4']);
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
 * Opens the app and binds the session to the resolved device in the same call.
 * A session left over from an earlier run can still be bound to a device that
 * is gone (a re-created emulator gets a new serial), and agent-device rejects
 * the selector rather than rebinding, so that one case is recovered by closing
 * the session and opening again. Everything else is a setup error carrying
 * agent-device's own message and hint, a foreign claim on the device included.
 */
function openApp(label, extra, globals, bind) {
  const args = ['open', BUNDLE_ID, ...extra, ...globals, ...bind];
  const first = ad(label, args, { allowFail: true });
  if (first.ok) return;

  const code = first.error?.code;
  if (code !== 'INVALID_ARGS' && code !== 'DEVICE_NOT_FOUND')
    failAd(label, first);

  console.log(`  ${code} from open, closing the session and retrying once`);
  ad('close-session', ['close', ...globals], { allowFail: true });
  const retry = ad(`${label}-retry`, args, { allowFail: true });
  if (!retry.ok) failAd(`${label} (after close)`, retry);
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
function openOnSurfaceScreen(platform, globals, bind, device, stories) {
  console.log('  relaunching the app (fresh bundle from Metro)');
  if (platform === 'ios') {
    openApp('open-relaunch', ['--relaunch'], globals, bind);
  } else {
    const stop = adb(device, ['shell', 'am', 'force-stop', BUNDLE_ID]);
    if (stop.status !== 0) {
      fail(`adb force-stop ${BUNDLE_ID} failed: ${stop.stderr.trim()}`);
    }
    openApp('open-after-force-stop', [], globals, bind);
  }

  const nodes = disableFloatingTools(
    platform,
    globals,
    device,
    dismissOverlays(globals)
  );

  if (onSurfaceScreen(globals, stories)) {
    console.log('  restored onto the Surface screen');
    return;
  }

  console.log('  not on the Surface screen — going back to the example list');
  const rootNodes = goBackToListRoot(platform, globals, device, nodes);
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

  // Resolve the instance from the profile, boot it if it is down, and only
  // then bind a session to it: `boot` takes a selector and no session, because
  // a session left bound to another identity would reject the selector.
  const device = platform === 'ios' ? resolveIos(env) : resolveAndroid(env);
  if (platform === 'ios' && !device.booted) {
    const boot = ad(
      'boot-ios',
      ['boot', '--platform', 'ios', '--udid', device.id],
      { allowFail: true }
    );
    if (!boot.ok) failAd(`boot ${device.id}`, boot);
  }
  state.device = { id: device.id, name: device.name };
  console.log(`# ${platform} ${device.name} (${device.id})`);
  if (platform === 'android') {
    // A cold-booted emulator has no tunnel to Metro; the dev launcher's
    // http://localhost:8081 row loads nothing without it.
    const reverse = adb(device, ['reverse', 'tcp:8081', 'tcp:8081']);
    if (reverse.status !== 0) {
      console.log(`  adb reverse failed: ${reverse.stderr.trim()}`);
    }
  }
  console.log(
    `# threshold ${opts.threshold}${opts.update ? ' (update)' : ''}, output: ${opts.outDir}`
  );

  // `open` binds the session to the device; every later command addresses the
  // session alone, so no selector can conflict with that binding mid-run.
  const globals = ['--platform', platform, '--session', sessionName(platform)];
  const bind = [platform === 'ios' ? '--udid' : '--serial', device.id];

  state.observedEnv = enforceEnvironment(platform, env, device);

  openOnSurfaceScreen(platform, globals, bind, device, opts.stories);
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
    stories: opts.stories,
    outDir: opts.outDir,
    agentDeviceVersion: AGENT_DEVICE,
    session: sessionName(opts.platform),
    device: state.device,
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
    device: null,
    observedEnv: {},
    results: [],
    startedAt: Date.now(),
  };

  cmdDir = path.join(opts.outDir, 'cmds');
  fs.mkdirSync(cmdDir, { recursive: true });

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
  pickAndroid,
  pickIosCandidate,
  resolveAndroid,
  atListRoot,
  findFloatingToolsNode,
  findSurfaceRow,
};
