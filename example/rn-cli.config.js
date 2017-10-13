/* eslint-disable import/no-commonjs */

const path = require('path');
const escape = require('escape-string-regexp');
const blacklist = require('metro-bundler/src/blacklist');

module.exports = {
  getProjectRoots() {
    return [__dirname, path.resolve(__dirname, '..')];
  },
  getProvidesModuleNodeModules() {
    return ['react-native', 'react', 'prop-types', 'color', 'lodash'];
  },
  getBlacklistRE() {
    return blacklist([
      new RegExp(
        `^${escape(
          path.resolve(
            __dirname,
            'node_modules/react-native-svg/node_modules/color'
          )
        )}\\/.*$`
      ),
      new RegExp(
        `^${escape(
          path.resolve(__dirname, 'node_modules/xmlbuilder/node_modules/lodash')
        )}\\/.*$`
      ),
      new RegExp(
        `^${escape(path.resolve(__dirname, '..', 'node_modules'))}\\/.*$`
      ),
      new RegExp(
        `^${escape(
          path.resolve(__dirname, '..', 'docs', 'node_modules')
        )}\\/.*$`
      ),
    ]);
  },
};
