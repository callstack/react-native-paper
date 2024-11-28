const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

const { resolver } = require('./metro.config');

const root = path.resolve(__dirname, '..');
const node_modules = path.join(__dirname, 'node_modules');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.entry = path.join(__dirname, 'index.js');

  config.module.rules.push(
    {
      test: /\.(js|ts|tsx)$/,
      include: path.resolve(root, 'src'),
      use: 'babel-loader',
    },
    {
      test: /\.ttf$/,
      loader: 'url-loader', // or directly file-loader
      include: path.resolve(
        __dirname,
        'node_modules/react-native-vector-icons'
      ),
    }
  );

  config.ignoreWarnings = [
    {
      module: /Overlay\.js/,
    },
    () => true,
  ];

  // We need to make sure that only one version is loaded for peerDependencies
  // So we alias them to the versions in example's node_modules
  Object.assign(config.resolve.alias, {
    ...resolver.extraNodeModules,
    crypto: require.resolve('expo-crypto'), //Fixes issue with crypto not being found on web
    'react-native-web': path.join(node_modules, 'react-native-web'),
    '@expo/vector-icons/MaterialCommunityIcons': require.resolve(
      '@expo/vector-icons/MaterialCommunityIcons'
    ),
  });

  return config;
};
