const path = require('path');

module.exports = function () {
  return {
    name: 'docusaurus-react-native-plugin',
    configureWebpack() {
      return {
        mergeStrategy: { 'resolve.extensions': 'prepend' },
        resolve: {
          alias: {
            react: path.resolve('node_modules/react'),
            'react-native$': 'react-native-web',
            'react-native-paper': path.resolve('../src'),
            'react-native-vector-icons': path.resolve(
              'node_modules/react-native-vector-icons/dist'
            ),
          },
          extensions: ['.web.js'],
        },
      };
    },
  };
};
