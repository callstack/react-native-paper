const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, '..');

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Monorepo support: extend Expo's defaults rather than replacing them so
// expo-doctor's watchFolders check stays green.
config.watchFolders = [...(config.watchFolders || []), workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
