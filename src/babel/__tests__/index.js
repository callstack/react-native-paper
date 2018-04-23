const path = require('path');
const { spawnSync } = require('child_process');
const tester = require('babel-plugin-tester');

spawnSync('node', [
  path.resolve(__dirname, '../../../scripts/generate-mappings.js'),
]);

tester({
  plugin: require('../index'),
  pluginName: 'react-native-paper/babel',
  fixtures: path.join(__dirname, '..', '__fixtures__'),
});
