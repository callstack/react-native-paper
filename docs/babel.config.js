module.exports = {
  presets: ['@docusaurus/core/lib/babel/preset'],
  plugins: [
    ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
    'react-native-reanimated/plugin',
  ],
};
