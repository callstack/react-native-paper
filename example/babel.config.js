const path = require('path');

const pak = require('../package.json');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            [`${pak.name}/package.json`]: path.join(
              __dirname,
              '..',
              'package.json'
            ),
            // For development, we want to alias the library to the source
            [pak.name]: path.join(__dirname, '..', 'src'),
            'react-native-vector-icons': '@expo/vector-icons', //Fixes issue with icons not showing up on web (I also had to add @expo/vector-icons to react-native-paper devDependencies)
          },
        },
      ],
      ['@babel/plugin-proposal-export-namespace-from'],
      ['react-native-reanimated/plugin'],
    ],
  };
};
