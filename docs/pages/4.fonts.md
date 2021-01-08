---
title: Fonts
---

# Fonts

## Installing custom fonts

The easiest way to install custom fonts to your RN project is do as follows:

  1. Define path to assets directory with fonts in project:

  Example:

  ```js
    // React Native < 0.60 package.json
    ...
      "rnpm": {
        "assets": [
          "fonts"
        ]
      },
    ...

    // React Native >= 0.60 react-native.config.js
    module.exports = {
    ...
    "assets": [
      "fonts"
    ],
    ...
  ```

  Note: fonts is a folder with .ttf files

  2. Place your font files in your assets folder.
  3. Link font files using '`react-native link`' command.
  4. Restart your project to refresh changes.

Now, you are able to use `fontFamily` from font files.

## Configuring fonts in ThemeProvider

To create a custom font, prepare a `fontConfig` object where fonts are divided by platforms. After that, you have to pass the `fontConfig` into `configureFonts` method in a custom theme. 

The `fontConfig` object accepts `ios`, `android`, `macos`, `windows`, `web`, and `native`. Use these to override fonts on particular platforms.

Note: At a minimum, you need to explicitly pass fonts for `android`, `ios`, and `web`.

Check the [default theme](https://github.com/callstack/react-native-paper/blob/main/src/styles/DefaultTheme.tsx) to see what customization options are supported.

```js
import * as React from 'react';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './src/App';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
  ios: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  }
};

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}
```
