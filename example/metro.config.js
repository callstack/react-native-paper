// /* eslint-disable import/no-commonjs */

const path = require('path');

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname)],

  resolver: {
    providesModuleNodeModules: [
      'react-native',
      'react',
      '@expo/vector-icons',
      '@babel/runtime',
    ],
  },
};
