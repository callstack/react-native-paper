/**
 * Unit tests for example/visual/run.mjs. No device, no agent-device, no new
 * dependencies — only the pure decision helpers are exercised.
 *
 *   node --test example/visual/run.test.mjs
 */

import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  RunFailure,
  atListRoot,
  checkCaptureSize,
  enforceEnvironment,
  findSurfaceRow,
  isMainModule,
} from './run.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RUN_URL = new URL('./run.mjs', import.meta.url);
const RUN_PATH = fileURLToPath(RUN_URL);

const env = { baselines: { cropWidth: 1206, cropHeight: 642 } };
const wrongSize = { width: 1280, height: 700 };

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
  // A brand-new story has no pinned size at all; --update must still get through.
  assert.doesNotThrow(() =>
    checkCaptureSize({ baselines: {} }, 'new-story', wrongSize, {
      update: true,
    })
  );
});

test('checkCaptureSize fails with exit code 3 in diff mode', () => {
  assert.throws(
    () => checkCaptureSize(env, 'story', wrongSize, { update: false }),
    (thrown) => {
      assert.ok(thrown instanceof RunFailure);
      assert.equal(thrown.exitCode, 3);
      assert.match(thrown.message, /capture dimensions do not match/);
      return true;
    }
  );

  assert.doesNotThrow(() =>
    checkCaptureSize(env, 'story', { width: 1206, height: 642 }, {})
  );
});

test('--force covers the device check but not the size check', () => {
  // An impossible API level mismatches whether or not an emulator is attached.
  const mismatched = { apiLevel: -1, density: -1 };

  assert.throws(
    () => enforceEnvironment('android', mismatched, false),
    (thrown) => {
      assert.ok(thrown instanceof RunFailure);
      assert.equal(thrown.exitCode, 2);
      return true;
    }
  );
  assert.doesNotThrow(() => enforceEnvironment('android', mismatched, true));

  // The size check takes no force: a stray `force` in the options changes nothing.
  assert.throws(
    () =>
      checkCaptureSize(env, 'story', wrongSize, { update: false, force: true }),
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
