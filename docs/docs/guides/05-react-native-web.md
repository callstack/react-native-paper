---
title: Using on the Web
---

# Using on the Web

React Native Paper supports web via [React Native for Web](https://necolas.github.io/react-native-web/), which lets you run React Native components in a browser using React DOM.

Before continuing, make sure you have React Native Paper installed and configured by following the [Getting Started guide](getting-started.md).

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

## Load the Roboto font (optional)

The default Paper theme uses the Roboto typeface. Add it to your web page via Google Fonts — follow the instructions on the [Roboto specimen page](https://fonts.google.com/specimen/Roboto).
