/* eslint-disable import/no-commonjs */

const path = require('path');
const glob = require('glob-to-regexp');
const blacklist = require('metro-bundler/src/blacklist');
const pak = require('../package.json');

const dependencies = Object.keys(pak.dependencies);

module.exports = {
  getProjectRoots() {
    return [__dirname, path.resolve(__dirname, '..')];
  },
  getProvidesModuleNodeModules() {
    return ['react-native', 'react', ...dependencies];
  },
  getBlacklistRE() {
    return blacklist([
      glob(`${path.resolve(__dirname, '..')}/node_modules/*`),
      glob(`${path.resolve(__dirname, '..')}/docs/node_modules/*`),
    ]);
  },
};
