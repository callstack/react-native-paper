const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { create } = require('babel-test');
const { toMatchFile } = require('jest-file-snapshot');

expect.extend({ toMatchFile });

spawnSync('node', [
  path.resolve(__dirname, '../../../scripts/generate-mappings.js'),
]);

const { fixtures } = create({
  plugins: [
    [
      require.resolve('../index'),
      { mappings: require.resolve('../../../lib/mappings.json') },
    ],
  ],
});

// https://nodejs.org/dist/latest/docs/api/os.html#os_os_platform
const platform = os.platform() === 'win32' ? 'windows' : 'unix';

fixtures(
  'generate mappings',
  path.join(__dirname, '..', `__fixtures-${platform}__`)
);
