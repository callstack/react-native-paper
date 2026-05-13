const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
const { withMetroConfig } = require('react-native-monorepo-config');

/** @type {import('metro-config').MetroConfig} */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root: path.resolve(__dirname, '..'),
  dirname: __dirname,
});

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
