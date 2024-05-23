module.exports = function (api) {
  api.cache(false);
  return {
    // These presets are used together to allow you to write modern,
    // React code that will be compatible with many browsers.
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@react-native/babel-preset',
      '@babel/preset-typescript',
    ],
  };
};
