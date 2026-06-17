// @ts-nocheck
import os from 'node:os';
import path from 'node:path';
import { defineConfig } from 'playwright/test';

const visualOutputRoot = path.join(
  os.tmpdir(),
  'react-native-paper-docs-visual'
);
const baseURL =
  process.env.DOCS_PREVIEW_URL ?? 'http://127.0.0.1:3000/react-native-paper/';

export default defineConfig({
  testDir: '.',
  outputDir: path.join(visualOutputRoot, 'test-results'),
  timeout: 30_000,
  use: {
    baseURL,
    viewport: {
      width: 1440,
      height: 960,
    },
  },
  webServer: process.env.DOCS_PREVIEW_URL
    ? undefined
    : {
        command: 'yarn preview --host 127.0.0.1 --port 3000',
        reuseExistingServer: true,
        timeout: 120_000,
        url: baseURL,
      },
});
