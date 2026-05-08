---
title: RTL Support
---

# RTL Support

React Native Paper supports right-to-left (RTL) layouts for languages such as Arabic and Hebrew.

## How it works

On React Native, the writing direction is normally controlled by `I18nManager.forceRTL`. React Native Paper reads this automatically i.e. no configuration is needed for native apps that already set up RTL via `I18nManager`.

However, `I18nManager` is a no-op on **React Native Web**, which means RTL layouts break silently in web apps. The `direction` prop on `PaperProvider` (and the `LocaleProvider` component) lets you explicitly control the writing direction so Paper behaves correctly on all platforms.

:::note
The `direction` prop informs React Native Paper about the text direction in the app i.e. it doesn't change the text direction by itself. If you intend to support RTL languages, it's important to set this prop to the correct value that's configured in the app. If it doesn't match the actual text direction, the layout might be incorrect.
:::

## Setting direction for the whole app

Pass the `direction` prop to `PaperProvider`. Defaults to `'rtl'` when `I18nManager.getConstants().isRTL` returns `true`, otherwise `'ltr'`.

Supported values:

- `'ltr'`: Left-to-right text direction for languages like English, French etc.
- `'rtl'`: Right-to-left text direction for languages like Arabic, Hebrew etc.

```js
import * as React from 'react';
import { PaperProvider } from 'react-native-paper';
import App from './src/App';

export default function Main() {
  return (
    <PaperProvider direction="rtl">
      <App />
    </PaperProvider>
  );
}
```

## Overriding direction for a subtree

Use `LocaleProvider` to override the direction for a specific part of the tree without affecting the rest of the app:

```js
import * as React from 'react';
import { LocaleProvider } from 'react-native-paper';

export default function ArabicSection() {
  return (
    <LocaleProvider direction="rtl">
      {/* Components here will use RTL layout */}
    </LocaleProvider>
  );
}
```

## Reading the current direction

The direction is available in your own components via the `useLocale` hook:

```js
import * as React from 'react';
import { useLocale } from 'react-native-paper';

function MyComponent() {
  const { direction } = useLocale();

  // Use the direction
}
```
