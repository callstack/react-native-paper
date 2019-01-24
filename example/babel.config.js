module.exports = {
  presets: ['expo'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-native-vector-icons': '@expo/vector-icons',
        },
      },
    ],
  ],
};
