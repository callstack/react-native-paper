---
title: Using on the Web
---

# Using on the Web

React Native Paper supports web via [React Native for Web](https://necolas.github.io/react-native-web/), which lets you run React Native components in a browser using React DOM.

Before continuing, make sure you have React Native Paper installed and configured by following the [Getting Started guide](getting-started).

## Setting up web support with Expo

The recommended way to run React Native Paper on the web is with Expo, which has built-in web support via React Native for Web. Install the required dependencies:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

Then start the web server:

```bash
npx expo start --web
```

No additional bundler configuration is required. See the [Expo Web docs](https://docs.expo.dev/workflow/web/) for details on how Expo configures React Native for Web under the hood.

## Without Expo

If you're not using Expo, follow the [React Native for Web setup guide](https://necolas.github.io/react-native-web/docs/setup/) to configure your bundler. The setup covers aliasing `react-native` to `react-native-web` in webpack, Babel, and Jest.

You will also need to manually load the Material Design icon font used by Paper. Add the following to your HTML shell or inject it at the root of your app:

```css
@font-face {
  font-family: 'MaterialDesignIcons';
  src: url('~@react-native-vector-icons/material-design-icons/fonts/MaterialDesignIcons.ttf')
    format('truetype');
}
```

## Load the Roboto font (optional)

The default Paper theme uses the Roboto typeface. With Expo, use the [`@expo-google-fonts/roboto`](https://github.com/expo/google-fonts/tree/master/font-packages/roboto) package. For other setups, follow the instructions on the [Roboto specimen page](https://fonts.google.com/specimen/Roboto).
