const webpack = require('webpack');

module.exports = function () {
  return {
    name: 'docusaurus-react-native-plugin',
    configureWebpack() {
      return {
        mergeStrategy: { 'resolve.extensions': 'prepend' },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude:
                /node_modules\/(?!(react-native-elements|react-native-vector-icons)\/).*/,
              loader: 'babel-loader',
            },
          ],
        },
        plugins: [
          new webpack.DefinePlugin({
            process: { env: {} },
            __DEV__: process.env.NODE_ENV !== 'production' || true,
          }),
        ],
        resolve: {
          alias: { 'react-native$': 'react-native-web' },
          extensions: ['.web.js'],
        },
      };
    },
  };
};
