// /* eslint-disable import/no-commonjs */

const path = require('path');
const glob = require('glob-to-regexp');
const blacklist = require('metro-config/src/defaults/blacklist');
const pak = require('../package.json');

const dependencies = Object.keys(pak.dependencies);

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, '..')],

  resolver: {
    blacklistRE: blacklist([
      glob(`${path.resolve(__dirname, '..')}/node_modules/*`),
      glob(`${path.resolve(__dirname, '..')}/docs/node_modules/*`),
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
