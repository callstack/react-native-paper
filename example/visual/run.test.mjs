/**
 * Unit tests for example/visual/run.mjs. No device, no adb/xcrun, no
 * agent-device, no new dependencies, only the pure decision helpers are
 * exercised, with the device observers faked.
 *
 *   node --test example/visual/run.test.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  RunFailure,
  atListRoot,
  checkCaptureSize,
  enforceEnvironment,
  findFloatingToolsNode,
  findSurfaceRow,
  isMainModule,
  parseArgs,
  pickAndroid,
  pickIosCandidate,
  resolveAndroid,
} from './run.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RUN_URL = new URL('./run.mjs', import.meta.url);
const RUN_PATH = fileURLToPath(RUN_URL);

const env = {};
const wrongSize = { width: 1280, height: 700 };

/**
 * Writes a file carrying a PNG signature and an IHDR of the given size. Only
 * those first 24 bytes are what run.mjs reads, so no encoder is needed.
 */
function writePngHeader(dir, name, width, height) {
  const header = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(header, 0);
  header.writeUInt32BE(13, 8);
  header.write('IHDR', 12, 'ascii');
  header.writeUInt32BE(width, 16);
  header.writeUInt32BE(height, 20);
  const file = path.join(dir, name);
  fs.writeFileSync(file, header);
  return file;
}

const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'paper-visual-'));
process.on('exit', () => fs.rmSync(TMP_DIR, { recursive: true, force: true }));

test('isMainModule is false for another argv[1] and true for the script itself', () => {
  assert.equal(isMainModule(path.join(HERE, 'other.mjs'), RUN_URL), false);
  assert.equal(isMainModule(undefined, RUN_URL), false);
  assert.equal(isMainModule(RUN_PATH, RUN_URL), true);
});

test('checkCaptureSize skips the check in update mode', () => {
  // Regression: this is the gate that used to abort `--update` before
  // writeBaseline ever ran, so a story with no baseline could never get one.
  assert.doesNotThrow(() =>
    checkCaptureSize(env, 'new-story', wrongSize, { update: true })
  );
});

test('parseArgs rejects an empty story list and unknown flags', () => {
  const exit2 = (thrown) =>
    thrown instanceof RunFailure && thrown.exitCode === 2;
  // A typo here used to yield zero stories, zero captures and a green summary.
  assert.throws(() => parseArgs(['--platform', 'ios', '--story', '']), exit2);
  assert.throws(() => parseArgs(['--platform', 'ios', '--story', ',,']), exit2);
  assert.throws(() => parseArgs(['--platform', 'ios', '--force']), exit2);
  assert.throws(() => parseArgs(['--platform', 'web']), exit2);
  assert.deepEqual(
    parseArgs(['--platform', 'android', '--story', ' a, b ']).stories,
    ['a', 'b']
  );
});

test('checkCaptureSize fails with exit code 3 in diff mode', () => {
  const baselineFile = writePngHeader(TMP_DIR, 'story.png', 1206, 642);

  assert.throws(
    () => checkCaptureSize(env, 'story', wrongSize, { baselineFile }),
    (thrown) => {
      assert.ok(thrown instanceof RunFailure);
      assert.equal(thrown.exitCode, 3);
      assert.match(thrown.message, /capture dimensions do not match/);
      return true;
    }
  );

  assert.doesNotThrow(() =>
    checkCaptureSize(
      env,
      'story',
      { width: 1206, height: 642 },
      {
        baselineFile,
      }
    )
  );

  // A story added today: whatever size its freshly written baseline has is the
  // size the check expects, so no env.json edit is needed to make it pass.
  const fresh = writePngHeader(TMP_DIR, 'new-story.png', 837, 219);
  assert.doesNotThrow(() =>
    checkCaptureSize(
      env,
      'new-story',
      { width: 837, height: 219 },
      {
        baselineFile: fresh,
      }
    )
  );
});

test('enforceEnvironment compares the image of the device it resolved', () => {
  // Fake observer: the check compares env.json with this, so the test needs no
  // adb on PATH. It also records the serial it was addressed with.
  const seen = [];
  const observers = {
    observeAndroid: (serial) => {
      seen.push(serial);
      return { observed: { apiLevel: 37, androidRelease: '17', density: 480 } };
    },
  };
  const device = { id: 'emulator-5556', name: 'Pixel 10 Pro' };
  const check = (apiLevel, density) =>
    enforceEnvironment(
      'android',
      { avd: 'Pixel_10_Pro', apiLevel, density },
      device,
      observers
    );

  assert.throws(
    () => check(36, 420),
    (thrown) => {
      assert.ok(thrown instanceof RunFailure);
      assert.equal(thrown.exitCode, 2);
      // Both the observed and the expected image are named.
      assert.match(thrown.message, /API 37 \/ 480 dpi/);
      assert.match(thrown.message, /API 36 \/ 420 dpi/);
      return true;
    }
  );
  assert.doesNotThrow(() => check(37, 480));
  // adb was addressed at the resolved emulator, not at adb's default device.
  assert.deepEqual(seen, ['emulator-5556', 'emulator-5556']);
  // iOS is fully resolved by then, so there is nothing left to observe.
  assert.deepEqual(enforceEnvironment('ios', {}, device, observers), {});
  assert.equal(seen.length, 2);
});

// Shapes captured from `agent-device devices --platform android --json`: a
// running emulator is listed under its serial, a stopped AVD under its name.
const emu = (id, name, booted, kind = 'emulator') => ({
  id,
  name,
  kind,
  booted,
});
const COLD = emu('Pixel_10_Pro', 'Pixel_10_Pro', false);
const WARM = emu('emulator-5554', 'Pixel 10 Pro', true);
const PROFILE = { avd: 'Pixel_10_Pro', device: 'Pixel 10 Pro' };

test('pickAndroid finds the AVD warm or cold and ignores a real device', () => {
  assert.equal(pickAndroid([COLD], PROFILE)?.id, 'Pixel_10_Pro');
  assert.equal(pickAndroid([WARM], PROFILE)?.id, 'emulator-5554');
  // A booted emulator wins over the stopped AVD entry for the same profile.
  assert.equal(pickAndroid([COLD, WARM], PROFILE)?.id, 'emulator-5554');
  // A physical phone with the same marketing name is not the AVD.
  assert.equal(
    pickAndroid([emu('R5CT80', 'Pixel 10 Pro', true, 'device')], PROFILE),
    null
  );
  assert.equal(pickAndroid([], PROFILE), null);
});

test('pickIosCandidate matches the name on the pinned runtime only', () => {
  // Shape of `xcrun simctl list -j devices`, trimmed to what the picker reads.
  const sim = (udid, name, state, isAvailable = true) => ({
    udid,
    name,
    state,
    isAvailable,
  });
  const PINNED = 'com.apple.CoreSimulator.SimRuntime.iOS-26-5';
  const OTHER = 'com.apple.CoreSimulator.SimRuntime.iOS-26-4';
  const profile = { device: 'iPhone 17 Pro', runtime: PINNED };
  const listing = (proState) => ({
    devices: {
      [PINNED]: [
        sim('U-PRO', 'iPhone 17 Pro', proState),
        sim('U-MAX', 'iPhone 17 Pro Max', 'Shutdown'),
        sim('U-17', 'iPhone 17', 'Shutdown'),
      ],
      [OTHER]: [sim('U-OLD', 'iPhone 17 Pro', 'Booted')],
    },
  });

  const picked = pickIosCandidate(listing('Booted'), profile);
  assert.equal(picked.device.id, 'U-PRO');
  assert.equal(picked.device.booted, true);
  // The other runtime's simulator is not chosen even when it is the only
  // Booted one, and neither is the Pro Max on the pinned runtime.
  assert.equal(
    pickIosCandidate(listing('Shutdown'), profile).device.id,
    'U-PRO'
  );

  // Nothing on the pinned runtime: report the runtimes that do have the name.
  const missing = pickIosCandidate(
    { devices: { [OTHER]: [sim('U-OLD', 'iPhone 17 Pro', 'Booted')] } },
    profile
  );
  assert.equal(missing.device, null);
  assert.deepEqual(missing.elsewhere, [OTHER]);
});

test('resolveAndroid boots a stopped AVD by name and takes the serial back', () => {
  const calls = [];
  const fakeAd = (label, args) => {
    calls.push(args);
    return label === 'devices-android'
      ? { ok: true, data: { devices: [COLD] } }
      : { ok: true, data: { id: 'emulator-5554', booted: true } };
  };

  assert.equal(resolveAndroid(PROFILE, fakeAd).id, 'emulator-5554');
  // A session on boot would collide with a binding left from an earlier run.
  assert.deepEqual(calls[1], [
    'boot',
    '--platform',
    'android',
    '--device',
    'Pixel_10_Pro',
  ]);
});

test('atListRoot needs the "Examples" title and no Back element', () => {
  const title = { label: 'Examples' };
  const back = { label: 'Back' };

  assert.equal(atListRoot([title]), true);
  assert.equal(atListRoot([title, back]), false);
  // A screen with no header at all is not the list root.
  assert.equal(atListRoot([{ label: 'Elevated surface' }]), false);
  assert.equal(atListRoot([]), false);
});

test('findFloatingToolsNode finds the dev-client button, not the dev menu', () => {
  // Shape taken from a real Android snapshot (480 dpi, top-right of the crop).
  const floating = {
    ref: 'e18',
    type: 'android.widget.ImageView',
    label: 'Tools',
    rect: { x: 1115, y: 243, width: 78, height: 78 },
  };

  assert.equal(
    findFloatingToolsNode([{ label: 'Elevated surface' }, floating])?.ref,
    'e18'
  );
  // The dev menu has a "TOOLS" section of its own: not the floating button.
  assert.equal(
    findFloatingToolsNode([
      { type: 'android.widget.TextView', label: 'TOOLS' },
      { type: 'android.widget.TextView', label: 'Reload' },
      { type: 'android.widget.TextView', label: 'Tools' },
    ]),
    null
  );
  assert.equal(findFloatingToolsNode([]), null);
});

test('findSurfaceRow picks the list row, not the Appbar title', () => {
  const nodes = [
    {
      ref: 'title',
      label: 'Examples',
      rect: { y: 60, height: 48, width: 402 },
    },
    // Appbar title of the Surface screen: above the list, must not win.
    {
      ref: 'header',
      label: 'Surface',
      rect: { y: 60, height: 48, width: 402 },
    },
    // Inset text child: below the header but too narrow to be the row.
    {
      ref: 'child',
      label: 'Surface',
      rect: { y: 300, height: 48, width: 360 },
    },
    { ref: 'row', label: 'Surface', rect: { y: 300, height: 48, width: 402 } },
  ];

  assert.equal(findSurfaceRow(nodes)?.ref, 'row');
  // No "Examples" title means this is not the list: report nothing.
  assert.equal(findSurfaceRow(nodes.filter((n) => n.ref !== 'title')), null);
});
