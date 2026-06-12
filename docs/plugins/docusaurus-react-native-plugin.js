const path = require('path');
const webpack = require('webpack');

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
            '@react-native-vector-icons/get-image': false,
          },
          extensions: ['.web.js'],
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              include: [/react-native-reanimated/, /react-native-worklets/],
              resolve: { fullySpecified: false },
            },
          ],
        },
        plugins: [
          new webpack.ProvidePlugin({
            process: 'process/browser.js',
          }),
          new webpack.DefinePlugin({
            __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
          }),
        ],
      };
    },
  };
};
