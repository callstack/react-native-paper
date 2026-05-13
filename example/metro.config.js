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

// Web-only aliases (replaces the dropped @expo/webpack-config setup):
// - route @react-native-vector-icons/material-design-icons through @expo/vector-icons
//   so its bundled font file is picked up on web
// - shim Node's crypto with expo-crypto so libraries expecting it on web work
const webAliases = {
  '@react-native-vector-icons/material-design-icons': require.resolve(
    '@expo/vector-icons/MaterialCommunityIcons'
  ),
  crypto: require.resolve('expo-crypto'),
};

const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && webAliases[moduleName]) {
    return context.resolveRequest(context, webAliases[moduleName], platform);
  }
  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
