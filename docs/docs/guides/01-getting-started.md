---
title: Getting Started
---

# Getting Started

## Installation

* Open a Terminal in your project's folder and run:

```bash npm2yarn
npm install react-native-paper
```

* From `v5` there is a need to install [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) for handling safe area.

```bash npm2yarn
npm install react-native-safe-area-context
```

Additionaly for `iOS` platform there is a requirement to link the native parts of the library:

```bash
npx pod-install
```

* If you're on a vanilla React Native project, you also need to install and link [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons).

Specifically `MaterialCommunityIcons` icon pack needs to be included in the project, because some components use those internally (e.g. `AppBar.BackAction` on Android). 

```bash npm2yarn
npm install react-native-vector-icons
```

The library has specified dedicated steps for each platform. Please follow their [installation guide](https://github.com/oblador/react-native-vector-icons#installation) in order to properly use icon fonts.

If you don't want to install vector icons, you can use [babel-plugin-optional-require](https://github.com/satya164/babel-plugin-optional-require) to opt-out.

If you use Expo, you don't need to install vector icons. But if you have a `babel.config.js` or `.babelrc` file, make sure that it includes `babel-preset-expo`.

To get smaller bundle size by excluding modules you don't use, you can use our optional babel plugin. The plugin automatically rewrites the import statements so that only the modules you use are imported instead of the whole library. Add `react-native-paper/babel` to the `plugins` section in your `babel.config.js` for production environment. It should look like this:

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
```

If you created your project using Expo, it'll look something like this:

```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
```

The plugin only works if you are importing the library using ES2015 import statements and not with `require`.

:::note
The above examples are for the latest `react-native` using Babel 7. If you have `react-native <= 0.55`, you'll have a `.babelrc` file instead of a `babel.config.js` file and the content of the file will be different.
:::

If you're using Flow for typechecking your code, you need to add the following under the `[options]` section in your `.flowconfig`:

```ini
module.file_ext=.js
module.file_ext=.native.js
module.file_ext=.android.js
module.file_ext=.ios.js
```

## Usage

Wrap your root component in `PaperProvider` from `react-native-paper`(if you are using versions prior to 5.8.0 you need to use `Provider`). If you have a vanilla React Native project, it's a good idea to add it in the component which is passed to `AppRegistry.registerComponent`. This will usually be in the `index.js` file. If you have an Expo project, you can do this inside the exported component in the `App.js` file.

Example:

```js
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './src/App';

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
```

The `PaperProvider` component provides the theme to all the components in the framework. It also acts as a portal to components which need to be rendered at the top level.

If you have another provider (such as `Redux`), wrap it outside `PaperProvider` so that the context is available to components rendered inside a `Modal` from the library:

```js
import * as React from 'react';
import { PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import App from './src/App';
import store from './store';

export default function Main() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </StoreProvider>
  );
}
```

## Customization

You can provide a custom theme to customize the colors, typescales etc. with the `Provider` component. Check the [Material Design 3 default theme](https://github.com/callstack/react-native-paper/blob/main/src/styles/themes/v3/LightTheme.tsx) to see what customization options are supported.

Example:

```js
import * as React from 'react';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import App from './src/App';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}
```

:::note
For MD2 check the following [Material Design 2 default theme](https://github.com/callstack/react-native-paper/blob/main/src/styles/themes/v2/LightTheme.tsx).
:::
