// /* eslint-disable import/no-commonjs */

const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');
const pak = require('../package.json');

const dependencies = Object.keys(pak.dependencies);

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, '..')],

  resolver: {
    blacklistRE: blacklist([
      /react-native-paper\/node_modules\/(.*)/,
      /react-native-paper\/docs\/node_modules\/(.*)/,
    ]),

    providesModuleNodeModules: [
      'react-native',
      'react',
      '@expo/vector-icons',
      '@babel/runtime',
      ...dependencies,
    ],
  },
};
