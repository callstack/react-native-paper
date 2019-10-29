const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
// eslint-disable-next-line import/no-extraneous-dependencies
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.(js|ts|tsx)$/,
    include: path.resolve('../src'),
    use: 'babel-loader',
  });

  config.resolve.plugins = config.resolve.plugins.filter(
    p => !(p instanceof ModuleScopePlugin)
  );

  Object.assign(config.resolve.alias, {
    react: path.resolve(__dirname, 'node_modules', 'react'),
    'react-native-web': path.resolve(
      __dirname,
      'node_modules',
      'react-native-web'
    ),
    '@expo/vector-icons/MaterialCommunityIcons': require.resolve(
      '@expo/vector-icons/MaterialCommunityIcons'
    ),
  });

  return config;
};
