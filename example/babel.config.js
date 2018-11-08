module.exports = {
  presets: ['expo'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-native-paper': '../src/index',
          'react-native-vector-icons': '@expo/vector-icons',
        },
      },
    ],
  ],
};
