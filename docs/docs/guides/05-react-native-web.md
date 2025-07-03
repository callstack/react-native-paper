---
title: Using on the Web
---

# Using on the Web

## Pre-requisites

Make sure that you have followed the getting started guide and have `react-native-paper` installed and configured before following this guide.

We're going to use [react-native-web](https://github.com/necolas/react-native-web) and [webpack](https://webpack.js.org/) to use React Native Paper on the web, so let's install them as well.

To install `react-native-web`, run:

```bash npm2yarn
npm install react-native-web react-dom react-art
```

### Using CRA ([Create React App](https://github.com/facebook/create-react-app))

Install [`react-app-rewired`](https://github.com/timarney/react-app-rewired) to override `webpack` configuration:

```bash npm2yarn
npm install --save-dev react-app-rewired
```

[Configure `babel-loader`](#2-configure-babel-loader) using a new file called `config-overrides.js`:

```js
module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules[/\\](?!react-native-vector-icons)/,
    use: {
      loader: 'babel-loader',
      options: {
        // Disable reading babel configuration
        babelrc: false,
        configFile: false,

        // The configuration for compilation
        presets: [
          ['@babel/preset-env', { useBuiltIns: 'usage' }],
          '@babel/preset-react',
          '@babel/preset-flow',
          '@babel/preset-typescript',
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-object-rest-spread',
        ],
      },
    },
  });

  return config;
};
```

Change your script in `package.json`:

```diff
/* package.json */

  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test --env=jsdom",
+   "test": "react-app-rewired test --env=jsdom"
}
```

### Custom webpack setup

To install `webpack`, run:

```bash npm2yarn
npm install --save-dev webpack webpack-cli webpack-dev-server
```

If you don't have a webpack config in your project, copy the following to `webpack.config.js` get started:

```js
const path = require('path');

module.exports = {
  mode: 'development',

  // Path to the entry file, change it according to the path you have
  entry: path.join(__dirname, 'App.js'),

  // Path for the output files
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },

  // Enable source map support
  devtool: 'source-map',

  // Loaders and resolver config
  module: {
    rules: [],
  },
  resolve: {},

  // Development server config
  devServer: {
    contentBase: [path.join(__dirname, 'public')],
    historyApiFallback: true,
  },
};
```

Also create a folder named `public` and add the following file named `index.html`:

```html
<!DOCTYPE html>
<head>
  <meta charset="utf-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

  <meta
    name="viewport"
    content="width=device-width,minimum-scale=1,initial-scale=1"
  />

  <title>App</title>

  <style>
    html,
    body,
    #root {
      height: 100%;
    }

    #root {
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="app.bundle.js"></script>
</body>
```

Now we're ready to start configuring the project.

## Configure webpack

### 1. Alias `react-native` to `react-native-web`

First, we have to tell webpack to use `react-native-web` instead of `react-native`. Add the following alias in your webpack config under `resolve`:

```js
alias: {
  'react-native$': require.resolve('react-native-web'),
}
```

### 2. Configure `babel-loader`

Next, we want to tell `babel-loader` to compile `react-native-paper` and `react-native-vector-icons`. We would also want to disable reading the babel configuration files to prevent any conflicts.

First install the required dependencies:

```bash npm2yarn
npm install --save-dev babel-loader @babel/preset-env @babel/preset-react @babel/preset-flow @babel/preset-typescript @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread
```

Now, add the following in the `module.rules` array in your webpack config:

```js
{
  test: /\.js$/,
  exclude: /node_modules[/\\](?!react-native-vector-icons)/,
  use: {
    loader: 'babel-loader',
    options: {
      // Disable reading babel configuration
      babelrc: false,
      configFile: false,

      // The configuration for compilation
      presets: [
        ['@babel/preset-env', { useBuiltIns: 'usage' }],
        '@babel/preset-react',
        '@babel/preset-flow',
        "@babel/preset-typescript"
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread'
      ],
    },
  },
},
```

### 3. Configure `file-loader`

#### webpack < 5.0

To be able to import images and other assets using `require`, we need to configure `file-loader`. Let's install it:

```bash npm2yarn
npm install --save-dev file-loader
```

To configure it, add the following in the `module.rules` array in your webpack config:

```js
{
  test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
  loader: 'file-loader',
}
```

##### webpack >= 5.0

Use `asset/resource`, since `file-loader` was deprecated in webpack v5.

```js
{
  test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
  type: 'asset/resource'
}
```

## Load the Material Design Icons

If you followed the getting started guide, you should have the following code in your root component:

```js
<PaperProvider>
  <App />
</PaperProvider>
```

Now we need tweak this section to load the Material Design Icons from the [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons) library:

```js
<PaperProvider>
  <React.Fragment>
    {Platform.OS === 'web' ? (
      <style type="text/css">{`
        @font-face {
          font-family: 'MaterialDesignIcons';
          src: url(${require('@react-native-vector-icons/material-design-icons/fonts/MaterialDesignIcons.ttf')}) format('truetype');
        }
      `}</style>
    ) : null}
    <App />
  </React.Fragment>
</PaperProvider>
```

Remember to import `Platform` from `react-native` at the top:

```js
import { Platform } from 'react-native';
```

You can also load these fonts using [`css-loader`](https://github.com/webpack-contrib/css-loader) if you prefer.

## Load the Roboto fonts (optional)

The default theme in React Native Paper uses the Roboto font. You can add them to your project following [the instructions on its Google Fonts page](https://fonts.google.com/specimen/Roboto?selection.family=Roboto:100,300,400,500).

## We're done!

You can run `webpack-dev-server` to run the webpack server and open your project in the browser. You can add the following script in your `package.json` under the `"scripts"` section to make it easier:

```json
"web": "webpack-dev-server --open"
```

Now you can run `yarn web` to run the project on web.
