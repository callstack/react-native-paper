---
title: Migration from Paper 5.x to 6.x
---

## General changes

### Animations

React Native Paper 6 uses [Reanimated](https://docs.swmansion.com/react-native-reanimated/) for most animations instead of the built-in React Native `Animated` API. So make sure to install `react-native-reanimated` 4.3.0 or later and `react-native-worklets` 0.8.1 or later, then complete the Reanimated setup. See the [getting started guide](./getting-started) for Expo and Community CLI instructions.

The following props now accept animated styles returned from `useAnimatedStyle`. They no longer accept `Animated.Value` or `Animated.AnimatedInterpolation` where these were previously supported:

- `Appbar.Action` and `Appbar.BackAction`: `style`
- `Badge`: `style`
- `Banner`: `style`
- `Button`: `style`
- `Card`: `style`
- `Chip`: `style`
- `Dialog`: `style`
- `Drawer.CollapsedItem`: `style`
- `FAB` and `FAB.Extended`: `style`
- `IconButton`: `style`
- `Menu`: `contentStyle`
- `Modal`: `contentContainerStyle`
- `Searchbar`: `style`
- `Snackbar`: `style`
- `Surface`: `style`
- `ToggleButton`: `style`

So you can use Reanimated's `useSharedValue` and `useAnimatedStyle` to animate these components instead of the React Native `Animated` API.

```tsx
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const MyComponent = () => {
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Card style={animatedStyle}>Button</Card>;
};
```

### Elevation

The `elevation` prop no longer accepts a React Native `Animated.Value` in the following components:

- `Banner`
- `Card`
- `Searchbar`
- `Snackbar`
- `Surface`

You can use an elevation level from `0` to `5` instead. Changes to the elevation level are animated automatically.

### Styles

The following component style props no longer support overriding their background color or border radius:

- `Banner`
- `Button`
- `Card`
- `Chip`
- `Dialog`
- `Menu`: `contentStyle`
- `Searchbar`
- `Snackbar`

You can use the component's color prop where available, or override the corresponding theme colors.

### Test IDs

Some hardcoded and generated test IDs have been removed for the following components:

- `Appbar.Header`: `${testID}-root-layer`
- `Surface`: `surface` and `${testID}-outer-layer`

You can specify a `testID` explicitly and use that value to query the component.

## Components

### Divider

| v5 | v6 |
| --- | --- |
| `leftInset` | `startInset` |
| `bold` | removed, dividers are 1dp thick by default |
| - | `orientation="vertical"` |

#### Thickness

Dividers are 1dp thick now, which is what the Material Design 3 spec asks for. In v5 the default was `StyleSheet.hairlineWidth`, thinner than 1dp on most screens, and `bold` was the only way to get a full 1dp line. The `bold` prop is gone.

```diff
- <Divider bold />
+ <Divider />
```

If you want the hairline back, set it in `style`:

```diff
- <Divider />
+ <Divider style={{ height: StyleSheet.hairlineWidth }} />
```

#### Inset

`leftInset` set `marginLeft`, so in RTL the inset stayed on the left instead of moving to the leading edge. Use `startInset` instead. It insets the leading edge and follows the writing direction.

```diff
- <Divider leftInset />
+ <Divider startInset />
```

`horizontalInset` works the same as before.

#### Orientation

Dividers can be vertical now. A vertical divider is 1dp wide and stretches to the height of its parent, so the parent has to lay its children out in a row.

```tsx
<View style={{ flexDirection: 'row' }}>
  <Text>Lemon</Text>
  <Divider orientation="vertical" />
  <Text>Mango</Text>
</View>
```

Insets follow the orientation. On a vertical divider, `startInset` insets the top edge, and `horizontalInset` insets the top and bottom edges.

#### Accessibility

Dividers are decorative, so screen readers skip them and they stay out of the focus order. If a divider means something on its own, opt back in:

```diff
- <Divider />
+ <Divider accessible aria-hidden={false} role="separator" />
```

### Appbar

The `style` props for `Appbar` and `Appbar.Header` no longer accept `Animated.Value` or `Animated.AnimatedInterpolation`. They only accept static styles.

The `style.elevation` property is no longer supported. Use the `elevated` prop to control Appbar elevation.

### Surface

- The `elevation` prop no longer accepts a React Native `Animated.Value`. Any `elevation` changes are animated automatically.
- The `style` prop no longer configures elevation, background color, or border radius. Use these props instead:
  - `elevation`
  - `backgroundColor`
  - `borderRadius`
  - `borderBottomEndRadius`
  - `borderBottomLeftRadius`
  - `borderBottomRightRadius`
  - `borderBottomStartRadius`
  - `borderEndEndRadius`
  - `borderEndStartRadius`
  - `borderStartEndRadius`
  - `borderStartStartRadius`
  - `borderTopEndRadius`
  - `borderTopLeftRadius`
  - `borderTopRightRadius`
  - `borderTopStartRadius`
  - `borderCurve`
- The `pointerEvents` prop is no longer supported as it's deprecated in React Native Web. You can specify `pointerEvents` in the `style` prop instead.
- The `overflow: 'hidden'` style is no longer supported in `style` as it can clip shadows. You can nest a `View` inside the `Surface` and apply `overflow: 'hidden'` to that instead.
- The default `testID` for `Surface` was removed. You can specify a `testID` explicitly if you need it.

e.g.:

```diff
<Surface
- style={{
-   backgroundColor: 'red',
-   borderRadius: 8,
-   overflow: 'hidden',
- }}
+ backgroundColor="red"
+ borderRadius={8}
>
+ <View style={{ overflow: 'hidden' }}>
    <Text>Content</Text>
+ </View>
</Surface>
```

### Modal

- The `contentContainerStyle` prop no longer configures the background color or any border radius property. We have added new props for these:
  - `contentBackgroundColor`
  - `contentBorderRadius`
- We have added the `contentElevation` prop to configure the elevation of the modal content.

e.g.:

```diff
<Modal
  visible={visible}
- contentContainerStyle={{
-   backgroundColor: 'white',
-   borderRadius: 8,
-   padding: 20,
- }}
+ contentBackgroundColor="white"
+ contentBorderRadius={8}
+ contentElevation={2}
+ contentContainerStyle={{ padding: 20 }}
>
  <Text>Content</Text>
</Modal>
```

### Dialog

- The default elevation changed from level `1` to level `3`.
- The `style` prop no longer configures the background color or border radius. You can override `theme.colors.surfaceContainerHigh` and `theme.shapes.corner.extraLarge` using the `theme` prop instead.

### TextInput

The Paper 6.x `TextInput` is a complete rewrite with a new API. Import the component the same way, but note that the props and behavior have changed significantly.

#### Types

```tsx
import { TextInput, type TextInputProps } from 'react-native-paper';
```

#### Variant

- **`mode="flat"`** → **`variant="filled"`**
- **`mode="outlined"`** → **`variant="outlined"`**

```tsx
// Before (v5)
<TextInput mode="flat" label="Filled" />
<TextInput mode="outlined" label="Outlined" />

// After (v6)
<TextInput variant="filled" label="Filled" />
<TextInput variant="outlined" label="Outlined" />
```

#### Adornments

- **`left` / `right`** → **`startAccessory` / `endAccessory`**
- **`TextInput.Affix`** → **`prefix` / `suffix`**, or **`TextInput.Icon`**, or **`startAccessory` / `endAccessory`**

```tsx
// Before (v5)
<TextInput
  left={<TextInput.Icon icon="email" />}
  right={<TextInput.Affix text={`${value.length}/80`} />}
/>

// After (v6)
<TextInput
  startAccessory={(p) => <TextInput.Icon {...p} icon="email" />}
  endAccessory={(p) => <CustomComponent {...p} />}
  maxLength={100}
  prefix="$"
  suffix="/100"
  counter
/>
```

#### Label and supporting text

- **`label: React.Element | string`** → **`string`**
- **`HelperText`** was removed; use **`supportingText`**.

```tsx
// Before (v5)
<>
  <TextInput
    label="Email"
    error={hasError}
    disabled={isDisabled}
  />
  <HelperText type="error" visible={hasError}>
    Enter a valid email
  </HelperText>
</>

// After (v6)
<TextInput
  label="Email"
  error={hasError}
  disabled={isDisabled}
  supportingText="Enter a valid email"
/>
```

#### Removed props

No direct `TextInput` equivalents for:

- **`dense`**, **`contentStyle`**, **`underlineStyle`**
- **`underlineColor`**, **`activeUnderlineColor`**, **`outlineColor`**, **`activeOutlineColor`**, **`textColor`**

Use **`style`** on the inner input and the **`theme`** for colors.

```tsx
import { MD3LightTheme, TextInput } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    outline: '#79747E',
    primary: '#6750A4',
  },
};

// Before (v5)
<TextInput
  dense
  contentStyle={{
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  }}
  outlineStyle={{
    borderRadius: 12,
    borderWidth: 2,
  }}
  outlineColor="#79747E"
  activeOutlineColor="#6750A4"
  textColor="#1C1B1F"
  style={{ fontSize: 16 }}
/>

// After (v6)
<TextInput
  theme={theme}
  style={{ fontSize: 16, color: '#1C1B1F' }}
/>
```
