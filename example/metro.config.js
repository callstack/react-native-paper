// /* eslint-disable import/no-commonjs */

const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');
const pak = require('../package.json');
const escape = require('escape-string-regexp');

const dependencies = Object.keys(pak.dependencies);

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, '..')],

  resolver: {
    blacklistRE: blacklist([
      new RegExp(
        `^${escape(path.resolve(__dirname, '..', 'node_modules'))}\\/.*$`
      ),
      new RegExp(
        `^${escape(
          path.resolve(__dirname, '..', 'docs', 'node_modules')
        )}\\/.*$`
      ),
    ]),

    providesModuleNodeModules: [
      'react-native',
      'react',
      'react-native-gesture-handler',
      '@expo/vector-icons',
      '@babel/runtime',
      ...dependencies,
    ],
  },
};
