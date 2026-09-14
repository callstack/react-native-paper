import { afterEach, beforeEach, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const script = join(__dirname, '..', 'bump-example-version.ts');

let workingDir: string;

const writeAppJson = (version: string) => {
  const appJsonPath = join(workingDir, 'app.json');

  writeFileSync(
    appJsonPath,
    JSON.stringify({ expo: { name: 'Example', version } }, null, 2) + '\n'
  );

  return appJsonPath;
};

// stderr is captured rather than inherited so that the messages from the
// expected failures do not land in the test output.
const run = (appJsonPath: string) =>
  execFileSync('node', [script, appJsonPath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

const readVersion = (appJsonPath: string) =>
  JSON.parse(readFileSync(appJsonPath, 'utf8')).expo.version;

beforeEach(() => {
  workingDir = mkdtempSync(join(tmpdir(), 'bump-example-version-'));
});

afterEach(() => {
  rmSync(workingDir, { recursive: true, force: true });
});

it('bumps the minor version', () => {
  const appJsonPath = writeAppJson('3.16.0');

  run(appJsonPath);

  expect(readVersion(appJsonPath)).toBe('3.17.0');
});

it('resets the patch version when bumping the minor version', () => {
  const appJsonPath = writeAppJson('3.16.5');

  run(appJsonPath);

  expect(readVersion(appJsonPath)).toBe('3.17.0');
});

it('prints the version it bumped to', () => {
  const appJsonPath = writeAppJson('3.16.0');

  expect(run(appJsonPath)).toContain('3.17.0');
});

it('leaves the rest of the app config untouched', () => {
  const appJsonPath = writeAppJson('3.16.0');

  run(appJsonPath);

  expect(JSON.parse(readFileSync(appJsonPath, 'utf8')).expo.name).toBe(
    'Example'
  );
});

it('increments the minor version past a single digit', () => {
  const appJsonPath = writeAppJson('3.9.0');

  run(appJsonPath);

  expect(readVersion(appJsonPath)).toBe('3.10.0');
});

it('fails when no app config path is given', () => {
  expect(() =>
    execFileSync('node', [script], { stdio: ['ignore', 'pipe', 'pipe'] })
  ).toThrow(/Usage/);
});

it('fails when the app config has no expo section', () => {
  const appJsonPath = join(workingDir, 'app.json');
  writeFileSync(appJsonPath, JSON.stringify({}) + '\n');

  expect(() => run(appJsonPath)).toThrow(/got undefined/);
});

it('fails when the current version is not a valid version', () => {
  const appJsonPath = writeAppJson('not-a-version');

  expect(() => run(appJsonPath)).toThrow(/got "not-a-version"/);
});
