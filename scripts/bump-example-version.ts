import { readFileSync, writeFileSync } from 'node:fs';

type AppConfig = { expo?: { version?: string } };

const appConfigPath = process.argv[2];

if (!appConfigPath) {
  console.error(
    'Usage: node scripts/bump-example-version.ts <path to the example app config>'
  );
  process.exit(1);
}

const appConfig: AppConfig = JSON.parse(readFileSync(appConfigPath, 'utf8'));
const expo = appConfig.expo;
const currentVersion = expo?.version;
const parsed = /^(\d+)\.(\d+)\.(\d+)$/.exec(currentVersion ?? '');

if (!expo || !parsed) {
  console.error(
    `Expected a "major.minor.patch" version at expo.version in ${appConfigPath}, got ${JSON.stringify(currentVersion)}.`
  );
  process.exit(1);
}

const [, major, minor] = parsed;
const nextVersion = `${major}.${Number(minor) + 1}.0`;

expo.version = nextVersion;

writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 2) + '\n');

console.log(`Bumped example app version to ${nextVersion}`);
