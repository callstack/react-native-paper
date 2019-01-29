const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'App.web.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules[/\\](?!react-native-vector-icons)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                },
              ],
              '@babel/preset-react',
              '@babel/preset-flow',
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              [
                'module-resolver',
                {
                  alias: {
                    'react-native-paper': '../src/index',
                    'react-native$': require.resolve('react-native-web'),
                  },
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  devServer: {
    contentBase: [path.join(__dirname, 'public')],
    historyApiFallback: true,
  },
};
