/**
 * Unit tests for example/visual/run.mjs. No device, no adb/xcrun, no
 * agent-device, no new dependencies — only the pure decision helpers are
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
  // A brand-new story has no baseline at all; --update must still get through.
  assert.doesNotThrow(() =>
    checkCaptureSize(env, 'new-story', wrongSize, {
      update: true,
      baselineFile: path.join(TMP_DIR, 'missing.png'),
    })
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

test('--force covers the device check but not the size check', () => {
  // Fake observers: the check compares env.json with these, so the test needs
  // neither adb nor xcrun on PATH.
  const observers = {
    observeIos: () => ({
      observed: { udid: 'fake', name: 'iPhone', runtime: 'r', state: 'Booted' },
    }),
    observeAndroid: () => ({
      observed: { apiLevel: 37, androidRelease: '17', density: 480 },
    }),
  };
  const mismatched = { apiLevel: -1, density: -1 };

  assert.throws(
    () => enforceEnvironment('android', mismatched, false, observers),
    (thrown) => {
      assert.ok(thrown instanceof RunFailure);
      assert.equal(thrown.exitCode, 2);
      return true;
    }
  );
  assert.doesNotThrow(() =>
    enforceEnvironment('android', mismatched, true, observers)
  );
  // A matching device needs no force at all.
  assert.doesNotThrow(() =>
    enforceEnvironment(
      'android',
      { apiLevel: 37, density: 480 },
      false,
      observers
    )
  );

  // The size check takes no force: a stray `force` in the options changes nothing.
  assert.throws(
    () =>
      checkCaptureSize(env, 'story', wrongSize, {
        force: true,
        baselineFile: writePngHeader(TMP_DIR, 'force.png', 1206, 642),
      }),
    RunFailure
  );
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
