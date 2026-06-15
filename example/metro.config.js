const { getDefaultConfig } = require('@expo/metro-config');
const path = require('node:path');
const { withMetroConfig } = require('react-native-monorepo-config');

/** @type {import('metro-config').MetroConfig} */
module.exports = withMetroConfig(getDefaultConfig(__dirname), {
  root: path.resolve(__dirname, '..'),
  dirname: __dirname,
  conditions: ['react-native-paper-source'],
});
