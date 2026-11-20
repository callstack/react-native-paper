---
title: RTL Support
---

# RTL Support

React Native Paper supports right-to-left (RTL) layouts for languages such as Arabic and Hebrew.

## How it works

By default, React Native Paper reads the writing direction from `I18nManager.getConstants().isRTL` on native platforms. So it will use your existing RTL setup on initial render.

See [I18nManager](http://reactnative.dev/docs/i18nmanager) docs and [Enabling RTL support in Expo](https://docs.expo.dev/guides/localization/#enabling-rtl-support) to configure your app properly.

On the Web, the RTL value is not set globally, unlike native platforms. `I18nManager.getConstants().isRTL` is a no-op on [React Native Web](https://necolas.github.io/react-native-web/). To enable RTL globally, you can specify `dir` attribute on the `html` element:

```html
<html dir="rtl">
  <!-- App content -->
</html>
```

Then, let `react-native-paper` know about it by using the `direction` prop on `PaperProvider` or the `LocaleProvider` component to match the writing direction in your app.

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
import App from './App';

export default function Main() {
  return (
    <PaperProvider direction="rtl">
      <App />
    </PaperProvider>
  );
}
```

## Overriding direction for a subtree

Use `LocaleProvider` to override the writing direction for a specific part of the tree without affecting the rest of the app. This updates Paper's components (such as text alignment and directional icons) to the specified direction.

Note that `LocaleProvider` does not alter the layout engine's direction by itself. To mirror the layout of a subtree as well:

- On **Web**, wrap the subtree in a `View` with `dir="rtl"` (or `dir="ltr"`).
- On **iOS**, set `direction: 'rtl'` (or `'ltr'`) in the `style` of a wrapping `View`.
- On **Android**, React Native does not support mixed-direction subtrees; layout direction is controlled globally via `I18nManager`.

```js
import * as React from 'react';
import { Platform, View } from 'react-native';
import { LocaleProvider } from 'react-native-paper';

export default function ArabicSection({ children }) {
  return (
    <LocaleProvider direction="rtl">
      <View
        style={Platform.OS === 'ios' ? { direction: 'rtl' } : undefined}
        {...(Platform.OS === 'web' ? { dir: 'rtl' } : {})}
      >
        {children}
      </View>
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
