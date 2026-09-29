import { afterEach, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const script = join(__dirname, '..', 'bump-example-version.ts');

const directories: string[] = [];

const writeAppConfig = (version: string) => {
  const directory = mkdtempSync(join(tmpdir(), 'bump-example-version-'));
  directories.push(directory);
  const appConfigPath = join(directory, 'app.json');

  writeFileSync(
    appConfigPath,
    JSON.stringify({ expo: { name: 'Example', version } }, null, 2) + '\n'
  );

  return appConfigPath;
};

const bump = (appConfigPath: string) => {
  execFileSync('node', [script, appConfigPath], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return JSON.parse(readFileSync(appConfigPath, 'utf8')).expo.version;
};

afterEach(() => {
  directories.splice(0).forEach((directory) => {
    rmSync(directory, { recursive: true, force: true });
  });
});

it('bumps the minor version', () => {
  expect(bump(writeAppConfig('3.16.0'))).toBe('3.17.0');
});

it('increments the minor version past a single digit', () => {
  expect(bump(writeAppConfig('3.9.0'))).toBe('3.10.0');
});

it('fails when the current version is not a valid version', () => {
  expect(() => bump(writeAppConfig('not-a-version'))).toThrow(
    /got "not-a-version"/
  );
});
