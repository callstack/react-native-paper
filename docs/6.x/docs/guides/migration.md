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

### Ripple color

These components no longer take a `rippleColor` prop. They derive the ripple color from their content color, as Material Design 3 specifies:

- `Button`
- `Checkbox.Item`
- `Chip`
- `Drawer.Item`
- `List.Accordion`
- `Menu.Item`
- `RadioButton.Item`
- `Searchbar`
- `SegmentedButtons`: the `rippleColor` of an item in `buttons`
- `Snackbar`

TypeScript reports an error, and in JavaScript the prop is ignored. `FAB`, `FAB.Group` and `AnimatedFAB` changed too, see [FAB](#fab). To use your own ripple color, build the pressable element with `TouchableRipple`, which keeps its `rippleColor` prop:

```tsx
<TouchableRipple rippleColor="#FF000020" onPress={onPress}>
  <Text>Press me</Text>
</TouchableRipple>
```

### Test IDs

Hardcoded default test IDs have been removed for the components listed below:

- `Appbar.Content`: `appbar-content`
- `Appbar.Header`: `appbar-header`
- `BottomNavigation`: `bottom-navigation`
- `BottomNavigation.Bar`: `bottom-navigation-bar`
- `Button`: `button`
- `Card`: `card`
- `Chip`: `chip`
- `Drawer.CollapsedItem`: `drawer-collapsed-item`
- `FAB`: `floating-action-button`
- `FAB.Extended`: `extended-floating-action-button`
- `FAB.Menu`: `floating-action-button-menu`
- `IconButton`: `icon-button`
- `Menu`: `menu`
- `Menu.Item`: `menu-item`
- `Modal`: `modal`
- `ProgressBar`: `progress-bar`
- `Searchbar`: `search-bar`
- `Surface`: `surface`

You can specify a `testID` explicitly to restore each component's own test ID.

These components used to also derive test IDs for internal, implementation-only elements by appending a suffix to the `testID` prop (e.g. `${testID}-container`, `${testID}-icon`, `${testID}-outline`). They have been removed entirely.

If you were relying on internal test IDs, update your tests not to rely on internal implementation details and only interact with elements or assert content your users can reach, e.g.: query by role, label, text etc., or `testID` props accepted by the component.

Some components now accept explicit `testID` props for their interactable elements:

- `BottomNavigation`: `barTestID` for the internal `BottomNavigation.Bar`, replacing the previous `${testID}-bar` derivation.
- `Chip`: `closeIconTestID` for the close icon button.
- `Dialog` and `Modal`: `overlayTestID` for the overlay displayed behind the content.
- `Menu`: `overlayTestID` for the overlay displayed behind the menu.
- `Searchbar`: `searchTestID`, `clearTestID`, and `trailingTestID` for the search, clear, and trailing icon buttons.
- `Snackbar`: `iconTestID` for the icon button.

### Refs

From React Native 0.87, `View`, `Text`, and `TextInput` are function components in React Native's types, so `React.Ref<View>` no longer refers to an instance. Component refs, such as the ones on `Button`, `Card`, `Chip`, and `Surface`, are now typed with `React.ComponentRef`. This works on older React Native versions too.

Type your refs the same way:

```diff
- const ref = React.useRef<View>(null);
+ const ref = React.useRef<React.ComponentRef<typeof View>>(null);

  <Button ref={ref}>Press me</Button>;
```

For `TextInput` and `Searchbar`, keep using `TextInputHandles`. It now keeps its methods, such as `focus` and `clear`, on React Native 0.87 and later.

### Theme

#### Exports and types

Paper 6 exports four themes: `LightTheme`, `DarkTheme`, `DynamicLightTheme` and `DynamicDarkTheme`. The 5.x theme exports were removed:

- **`MD3LightTheme`** and **`DefaultTheme`** → **`LightTheme`**
- **`MD3DarkTheme`** → **`DarkTheme`**
- **`MD2LightTheme`**, **`MD2DarkTheme`** and **`MD2Colors`** have no replacement, as Material Design 2 is no longer supported.

In JavaScript, the old names import as `undefined` without an error: spreading `...MD3LightTheme` adds nothing, and reading `MD3LightTheme.colors` throws.

```diff
-import { MD3LightTheme } from 'react-native-paper';
+import { LightTheme } from 'react-native-paper';

 const theme = {
-  ...MD3LightTheme,
+  ...LightTheme,
   colors: {
-    ...MD3LightTheme.colors,
+    ...LightTheme.colors,
     primary: 'tomato',
   },
 };
```

Watch for `DarkTheme` in particular. 5.x had no `DarkTheme` export, so in a JavaScript app an import of it was `undefined` and Paper used its default theme instead. In 6.x the same import is the Material Design 3 dark theme, so the app can look different after the upgrade. React Navigation and `adaptNavigationTheme` also use the names `LightTheme`, `DarkTheme` and `DefaultTheme`, so when a file uses both, import Paper's themes under other names, e.g. `LightTheme as PaperLightTheme`.

The theme types were renamed too:

- **`MD3Theme`** → **`Theme`**
- **`MD3Elevation`** → **`Elevation`**
- **`MD3TypescaleKey`** → **`TypescaleKey`**
- **`ThemeBase`** and **`MD2Theme`** were removed. Use `Theme` instead.

#### `MD3Colors`

`MD3Colors` was renamed to `Palette`. It has every key `MD3Colors` had, such as `Palette.tertiary70`, plus new tones such as `primary98` and `neutral94`. The `neutral` tones from `neutral10` to `neutral99` are slightly different colors.

```diff
-import { MD3Colors } from 'react-native-paper';
+import { Palette } from 'react-native-paper';

-const color = MD3Colors.tertiary70;
+const color = Palette.tertiary70;
```

#### `roundness`

The `roundness` theme property was removed. Corner radii are now set in `theme.shapes.corner`, a scale of roles from `extraSmall` (4) to `extraExtraLarge` (48), and each component uses one fixed role. Paper ignores a `roundness` left in your theme, and TypeScript only reports it in a theme object written inline in a `theme` prop.

In 5.x, each of these components multiplied `roundness` by a fixed number, and the 6.x defaults match the 5.x corners with the default `roundness` of 4. To port a custom `roundness`, set each role to your `roundness` times its multiplier:

| Role             | Default | 5.x multiplier | Components                                          |
| ---------------- | ------- | -------------- | --------------------------------------------------- |
| `extraSmall`     | 4       | 1              | `Menu`, `Snackbar`, `Tooltip`                       |
| `small`          | 8       | 2              | `Chip`                                              |
| `medium`         | 12      | 3              | `Card`                                              |
| `largeIncreased` | 20      | 5              | `Button`, `SegmentedButtons`                        |
| `extraLarge`     | 28      | 7              | `Dialog`, `Drawer.Item`, `Searchbar` (`mode="bar"`) |

`FAB` and `FAB.Extended` use the role of their `size`: `large` (16) by default, `largeIncreased` for `size="medium"` and `extraLarge` for `size="large"`. `TextInput` no longer follows the theme: its corners are always 4.

A component's `theme` prop is merged deeply, so you can set only the role you need:

```diff
-<Button theme={{ roundness: 2 }}>Press me</Button>
+<Button theme={{ shapes: { corner: { largeIncreased: 10 } } }}>Press me</Button>
```

`PaperProvider` doesn't merge `shapes` deeply: a `shapes` key in its `theme` replaces the default one. So spread the base `shapes` and `corner`, or the roles you leave out are `undefined` and those components lose their rounded corners:

```diff
-import { MD3LightTheme, PaperProvider } from 'react-native-paper';
+import { LightTheme, PaperProvider } from 'react-native-paper';

 const theme = {
-  ...MD3LightTheme,
-  roundness: 2,
+  ...LightTheme,
+  shapes: {
+    ...LightTheme.shapes,
+    corner: {
+      ...LightTheme.shapes.corner,
+      extraSmall: 2,
+      small: 4,
+      medium: 6,
+      large: 8,
+      largeIncreased: 10,
+      extraLarge: 14,
+    },
+  },
 };

 <PaperProvider theme={theme}>{children}</PaperProvider>;
```

### Accessibility props

Components now use React Native's `aria-*` props and `role` instead of the `accessibility*` props. `accessibilityLabel` is now `aria-label`, the `accessibilityRole` of `Button` is now `role`, and the `accessibilityState` of `FAB` and `Menu.Item` is now `aria-checked` and `aria-selected`.

`Checkbox.Item`, `RadioButton.Item`, `FAB`, `Menu.Item`, `List.Accordion` and `Switch` no longer accept `accessibilityLabel`, so TypeScript reports an error. Components whose props extend React Native's view props, such as `Button`, `Chip` and `DataTable.Pagination`, still compile with the old props, but pass them to their outer container instead of the element they used to label.

Props that label a part of a component keep their names, e.g. `closeIconAccessibilityLabel` on `Chip` and `dismissAccessibilityLabel` on `Modal`.

Keys inside data objects changed the same way: the `routes` of `BottomNavigation` and the `buttons` of `SegmentedButtons` now take `'aria-label'`. The old `accessibilityLabel` key is ignored, and TypeScript doesn't report it in `routes`.

```diff
 <Checkbox.Item
   label="Notify me"
   status="checked"
-  accessibilityLabel="Notifications"
+  aria-label="Notifications"
 />

 const routes = [
-  { key: 'music', title: 'Music', focusedIcon: 'music', accessibilityLabel: 'Music tab' },
+  { key: 'music', title: 'Music', focusedIcon: 'music', 'aria-label': 'Music tab' },
 ];
```

### Libraries built on Paper

Libraries built on Paper may not support 6.x yet. For example, `react-native-paper-dates` 0.24.1 still uses `HelperText`, the 5.x theme exports and `theme.roundness`, so its `DatePickerInput` crashes when it shows a validation error.

## Components

### Appbar

`Appbar.Content` no longer takes `subtitle` or `subtitleStyle`, which were deprecated in 5.x. In 5.x they only rendered with a Material Design 2 theme, so removing them doesn't change how a Material Design 3 app looks.

```diff
-<Appbar.Content title="Inbox" subtitle="3 unread messages" />
+<Appbar.Content title="Inbox" />
```

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

`Modal` now uses a `Portal` internally and doesn't require an explicit `Portal` wrapper. So you need to remove any existing `Portal` wrappers around `Modal`:

```diff
-<Portal>
-  <Modal visible={visible} onDismiss={hideModal}>
-    <Text>Content</Text>
-  </Modal>
-</Portal>
+<Modal visible={visible} onDismiss={hideModal}>
+  <Text>Content</Text>
+</Modal>
```

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

The modal content now has the `dialog` role, so it needs an accessible name. You can provide one with the new `aria-label` prop:

```diff
-<Modal visible={visible} onDismiss={hideModal}>
+<Modal visible={visible} onDismiss={hideModal} aria-label="Example modal">
   <Text>Content</Text>
 </Modal>
```

The overlay behind the content is now hidden from assistive technology. Instead, when the modal is `dismissable`, screen reader users can dismiss it with a visually hidden button inside the dialog.

The `overlayAccessibilityLabel` prop was renamed to `dismissAccessibilityLabel`, which is used for the button's accessibility label:

```diff
<Modal
  visible={visible}
  onDismiss={hideModal}
- overlayAccessibilityLabel="Close"
+ dismissAccessibilityLabel="Close"
>
  <Text>Content</Text>
</Modal>
```

Previously, the Android back button dismissed the modal when `dismissable` was `true`, even if `dismissableBackButton` was `false`. The `dismissableBackButton` prop can now prevent the modal from being dismissed via the back button independently of the `dismissable` prop.

### Dialog

`Dialog` now uses a `Portal` internally and doesn't require an explicit `Portal` wrapper. So you need to remove any existing `Portal` wrappers around `Dialog`:

```diff
-<Portal>
-  <Dialog visible={visible} onDismiss={hideDialog}>
-    <Dialog.Title>Alert</Dialog.Title>
-  </Dialog>
-</Portal>
+<Dialog visible={visible} onDismiss={hideDialog}>
+  <Dialog.Title>Alert</Dialog.Title>
+</Dialog>
```

The dialog now has the `dialog` role. On web, the dialog's accessible name is set automatically by `Dialog.Title`. You can specify a different name with the new `aria-label` prop, e.g. when the dialog has no title:

```jsx
<Dialog visible={visible} onDismiss={hideDialog} aria-label="Delete file">
  <Dialog.Content>
    <Text>Are you sure?</Text>
  </Dialog.Content>
</Dialog>
```

When the dialog is `dismissable`, screen reader users can dismiss it with a visually hidden button inside the dialog. You can change the button's accessibility label with the new `dismissAccessibilityLabel` prop.

- The default elevation changed from level `1` to level `3`.
- The `style` prop no longer configures the background color or border radius. You can override `theme.colors.surfaceContainerHigh` and `theme.shapes.corner.extraLarge` using the `theme` prop instead.

#### `Dialog.Actions`

`Dialog.Actions` no longer injects `compact` on its buttons. To keep the previous behavior, you need to add the `compact` prop to each button:

```tsx
// Before (v5)
<Dialog.Actions>
  <Button onPress={hide}>Done</Button>
</Dialog.Actions>

// After (v6)
<Dialog.Actions>
  <Button compact onPress={hide}>
    Done
  </Button>
</Dialog.Actions>
```

### Menu

The `overlayAccessibilityLabel` prop was renamed to `dismissAccessibilityLabel`:

```diff
<Menu
  visible={visible}
  onDismiss={closeMenu}
  anchor={anchor}
- overlayAccessibilityLabel="Close"
+ dismissAccessibilityLabel="Close"
>
  <Menu.Item title="Item" />
</Menu>
```

### Searchbar

The misspelled `traileringIcon` props have been renamed:

- **`traileringIcon`** → **`trailingIcon`**
- **`traileringIconColor`** → **`trailingIconColor`**
- **`traileringIconAccessibilityLabel`** → **`trailingIconAccessibilityLabel`**
- **`onTraileringIconPress`** → **`onTrailingIconPress`**

```diff
<Searchbar
- traileringIcon="microphone"
- traileringIconColor={colors.onSurfaceVariant}
- traileringIconAccessibilityLabel="microphone button"
- onTraileringIconPress={onMicrophonePress}
+ trailingIcon="microphone"
+ trailingIconColor={colors.onSurfaceVariant}
+ trailingIconAccessibilityLabel="microphone button"
+ onTrailingIconPress={onMicrophonePress}
/>
```

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
import { LightTheme, TextInput } from 'react-native-paper';

const theme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
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

### Card

#### `Card` layout

`Card` and its related components have been reworked. Instead of injecting padding to its children, the `Card` component now adds a padding (`16dp`) around its content as well as a gap (`16dp`) between its children.

For the related components:

- `Card.Cover` and `Card.Actions` now apply negative margins to extend into the Card's edges:
  - `Card.Cover` applies top, left and right margins for vertical cards and left, top, and bottom margins for horizontal cards.
  - `Card.Actions` applies bottom, left, and right margins for vertical cards and left, bottom, and right margins for horizontal cards.
- `Card.Title` and `Card.Content` no longer apply padding around them.

This means, in a typical card layout, the Card will automatically apply the necessary spacing between these sections:

```tsx
<Card>
  <Card.Cover source={cover} />
  <Card.Title title="Card title" />
  <Card.Content>
    <Text>Card content</Text>
  </Card.Content>
  <Card.Actions>
    <Button mode="contained">Action</Button>
    <Button mode="outlined">Another Action</Button>
  </Card.Actions>
</Card>
```

So your existing layouts with the following structure will continue to work as before:

- `Card` without `Card.Cover` or `Card.Actions`.
- `Card` with `Card.Cover` at the top and/or `Card.Actions` at the bottom.

If you have `Card.Cover` or `Card.Actions` in positions other than the top and bottom respectively, you will need to adjust their margins. For example, for a `Card.Cover` in the middle of the Card, you would need to set its top and bottom margins to zero:

```tsx
<Card>
  <Card.Title title="Card title" />
  <Card.Cover source={cover} style={{ marginTop: 0, marginBottom: 0 }} />
  <Card.Content>
    <Text>Card content</Text>
  </Card.Content>
</Card>
```

We have also added a `direction` prop to the `Card` component, which lets you arrange its items horizontally instead of the default vertical layout. So if you have custom `flexDirection` styles on the Card, you should replace them with the `direction` prop.

```tsx
// Before (v5)
<Card style={{ flexDirection: 'row' }}>
  <Card.Cover source={cover} style={{ width: 72, height: 72 }} />
  <Card.Title title="Card title" />
  <Card.Content>
    <Text>Card content</Text>
  </Card.Content>
  <Card.Actions>
    <Button mode="contained">Action</Button>
    <Button mode="outlined">Another Action</Button>
  </Card.Actions>
</Card>

// After (v6)
<Card direction="horizontal">
  <Card.Cover source={cover} style={{ width: 72, height: 72 }} />
  <Card.Title title="Card title" />
  <Card.Content>
    <Text>Card content</Text>
  </Card.Content>
  <Card.Actions>
    <Button mode="contained">Action</Button>
    <Button mode="outlined">Another Action</Button>
  </Card.Actions>
</Card>
```

#### `Card.Cover`

The `style` prop of `Card.Cover` is now typed as a `View` style. Image style properties such as `resizeMode` or `tintColor` were never applied, so pass them as `Image` props instead:

```diff
- <Card.Cover source={cover} style={{ resizeMode: 'contain' }} />
+ <Card.Cover source={cover} resizeMode="contain" />
```

#### `Card.Actions`

`Card.Actions` no longer injects `mode` on the buttons. To keep the previous behavior, you need to set `mode="outlined"` on the first button and `mode="contained"` on the rest:

```tsx
// Before (v5)
<Card.Actions>
  <Button>Cancel</Button>
  <Button>Ok</Button>
</Card.Actions>

// After (v6)
<Card.Actions>
  <Button mode="outlined">Cancel</Button>
  <Button mode="contained">Ok</Button>
</Card.Actions>
```

### List

#### `List.Accordion`

An accordion with a `left` element now indents only its `List.Item` children. Anything else you put inside keeps its own padding, so indent it yourself to line it up with the items.

```tsx
// Before (v5)
<List.Accordion title="Group" left={props => <List.Icon {...props} icon="folder" />}>
  <View>
    <Text>Custom row</Text>
  </View>
</List.Accordion>

// After (v6)
<List.Accordion title="Group" left={props => <List.Icon {...props} icon="folder" />}>
  <View style={{ paddingLeft: 40 }}>
    <Text>Custom row</Text>
  </View>
</List.Accordion>
```

`theme` set on `List.Accordion` no longer reaches its children either. Pass it to the child that needs the override.

### Typography components

The Material Design 2 typography components were removed. Use `Text` with the matching `variant` instead:

- **`Title`** → **`<Text variant="titleLarge">`**
- **`Headline`** → **`<Text variant="headlineSmall">`**
- **`Subheading`** → **`<Text variant="titleMedium">`**
- **`Paragraph`** → **`<Text variant="bodyMedium">`**
- **`Caption`** → **`<Text variant="bodySmall">`**

In JavaScript, the old components import as `undefined`, so the app builds but fails to render with "Element type is invalid".

```diff
-import { Caption, Title } from 'react-native-paper';
+import { Text } from 'react-native-paper';

-<Title>Inbox</Title>
-<Caption>3 new messages</Caption>
+<Text variant="titleLarge">Inbox</Text>
+<Text variant="bodySmall">3 new messages</Text>
```

### Text

A `Text` nested in another `Text` now inherits the parent's font and color, as React Native's own `Text` does. In 5.x it reset them to the theme's default font and `onSurface`, so a `Text` with a variant inside a contained `Button` lost the button's label color, and a plain `Text` inside a `Chip` lost the chip's font. A nested `Text` with a `variant` still takes that variant's font, and its own `style` still wins over the parent's. To give a nested `Text` its own color, set `color` in its `style`, or pass it a `theme`, which makes it render like a top-level `Text`.

On iOS and Android, nesting follows React Native: a `Text` inside React Native's own `Text` inherits from it as well, and a `Text` inside a `View` isn't nested, so it renders like a top-level `Text`.

### ToggleButton

`ToggleButton`, `ToggleButton.Group` and `ToggleButton.Row` were removed. For an
icon-only toggle, use `IconButton` with the `selected` prop. For a set of
mutually exclusive options, use `SegmentedButtons`.

```tsx
// Before (v5)
<ToggleButton.Group value={value} onValueChange={setValue}>
  <ToggleButton icon="format-bold" value="bold" />
  <ToggleButton icon="format-italic" value="italic" />
</ToggleButton.Group>

// After (v6)
<>
  <IconButton
    icon="format-bold"
    selected={value === 'bold'}
    onPress={() => setValue('bold')}
  />
  <IconButton
    icon="format-italic"
    selected={value === 'italic'}
    onPress={() => setValue('italic')}
  />
</>
```

### FAB

`FAB` was rewritten for Material Design 3. `FAB.Group` and `AnimatedFAB` were removed: use `FAB.Menu` and `FAB.Extended` instead.

#### `variant`

The variants changed meaning. In 5.x, `primary`, `secondary` and `tertiary` painted the container role, e.g. `primaryContainer`. In 6.x they paint the role itself, e.g. `primary`, and the new tonal variants paint the container role. So a FAB with an explicit `variant` looks different. To keep the 5.x colors:

- **`primary`** (the 5.x default) → **`tonalPrimary`** (the 6.x default)
- **`secondary`** → **`tonalSecondary`**
- **`tertiary`** → **`tonalTertiary`**
- **`surface`** has no variant. Set `containerColor` and `contentColor` instead, e.g. to `theme.colors.surfaceContainerHigh` and `theme.colors.primary`.

A FAB without a `variant` keeps its 5.x colors.

```diff
-<FAB icon="plus" variant="secondary" onPress={onPress} />
+<FAB icon="plus" variant="tonalSecondary" onPress={onPress} />
```

#### `size`

- **`size="small"`** and **`small`** (40dp) were removed. The smallest FAB is now `size="default"` (56dp).
- **`size="medium"`** (56dp, the 5.x default) → **`size="default"`** (the 6.x default)
- **`size="large"`** (96dp) is unchanged.

`size="medium"` still type-checks, but in 6.x it is 80dp, so a FAB with an explicit `size="medium"` grows by 24dp. `customSize` was removed.

#### Removed props

- **`label`** and **`uppercase`**: use `FAB.Extended` for a FAB with a label.
- **`color`** → **`contentColor`**. Set the background with `containerColor`, as `style` is only for positioning.
- **`mode`**: no replacement. A FAB always has its resting elevation.
- **`disabled`**: no replacement. To take the action away, hide the FAB with `visible={false}`.
- **`loading`**, **`animated`**, **`onLongPress`** and **`delayLongPress`**: no replacement.
- **`rippleColor`**: see [Ripple color](#ripple-color).

TypeScript reports an error for each of them, and in JavaScript they're ignored.

```diff
-<FAB icon="pencil" label="Compose" color="white" onPress={onPress} />
+<FAB.Extended
+  icon="pencil"
+  label="Compose"
+  expanded
+  contentColor="white"
+  onPress={onPress}
+/>
```

#### `FAB.Extended`

`FAB.Extended` replaces `AnimatedFAB`. `extended` is now `expanded`, and changing it animates the width and the label. `iconMode` and `animateFrom` were removed, and so were the props listed above for `FAB`. In JavaScript, `AnimatedFAB` imports as `undefined`, so the app builds but fails to render with "Element type is invalid".

```diff
-<AnimatedFAB
+<FAB.Extended
   icon="plus"
   label="Compose"
-  extended={isExtended}
+  expanded={isExtended}
   onPress={onPress}
 />
```

#### `FAB.Menu`

`FAB.Menu` replaces `FAB.Group`. It takes `expanded` and `onDismiss` instead of `open` and `onStateChange`, the main button's props move into `trigger`, and `actions` are now `items`, 2 to 6 of them. Items take `icon`, `label`, `onPress`, `aria-label` and `testID`: the color, style and size props of an action were removed, and so were `backdropColor`, `fabStyle` and the long-press props.

`FAB.Menu` has no backdrop and doesn't close on a tap outside it. It closes when the user presses its close button or an item, which calls `onDismiss`.

```diff
-<FAB.Group
-  open={open}
-  visible
-  icon={open ? 'close' : 'plus'}
-  actions={[
-    { icon: 'email', label: 'Send', onPress: send },
-    { icon: 'bell', label: 'Remind', onPress: remind },
-  ]}
-  onStateChange={({ open }) => setOpen(open)}
-/>
+<FAB.Menu
+  expanded={open}
+  onDismiss={() => setOpen(false)}
+  trigger={{ icon: 'plus', onPress: () => setOpen(true) }}
+  items={[
+    { icon: 'email', label: 'Send', onPress: send },
+    { icon: 'bell', label: 'Remind', onPress: remind },
+  ]}
+/>
```

### Checkbox

#### Interaction states

Hover, focus and press now paint a Material Design 3 state layer, a 40dp circle around the box, on every platform. Hover and focus use `primary` when the checkbox is selected and `onSurface` when it is not, a press ripples in the opposite color, and an error checkbox uses `error` throughout. `color` and `uncheckedColor` also set the matching state layer color. Keyboard focus draws a 50dp ring with a 2dp gap around the state layer.

`Checkbox` always paints its own press and ignores `rippleColor`, `background` and `underlayColor`. Setting `rippleEffectEnabled: false` on the `settings` prop of `PaperProvider` turns off the press ripple.

On web, Space now toggles a focused checkbox or `Checkbox.Item` row, as Enter already did. If your app toggles a checkbox on Space itself, remove that handling, or the checkbox toggles twice.

#### Touch target size

`Checkbox` now takes up 48dp instead of 36dp to meet the minimum touch target, so rows with a standalone checkbox can grow up to 12dp taller. In `Checkbox.Item` the whole row is the touch target, so its checkbox takes up 40dp and a one-line row is 56dp tall, 4dp taller than in 5.x.

#### Style

`Checkbox` now accepts `style` and applies it to its outer container, so layout styles such as `margin`, `position` and `transform` move the whole checkbox, focus ring included. `width` and `height` do not resize the 48dp touch target.

To keep the 36dp footprint of 5.x, use a negative margin. The touch target stays 48dp and reaches 6dp into the space around the checkbox:

```tsx
// Before (v5)
<Checkbox status="checked" onPress={onPress} aria-label="Notify me" />

// After (v6)
<Checkbox
  status="checked"
  onPress={onPress}
  aria-label="Notify me"
  style={{ margin: -6 }}
/>
```

#### Accessible name

A standalone `Checkbox` has no visible label, so it now warns in development when it has no accessible name. Pass `aria-label` or `accessibilityLabel`, or use `Checkbox.Item`, which names the whole row. On Android and web, `aria-labelledby` names it too. A checkbox hidden from assistive technology, for example with `aria-hidden`, does not warn. Hide only a checkbox without `onPress` and let another element name and toggle it: with `onPress`, a hidden checkbox can still take focus.

```diff
-<Checkbox status="checked" onPress={onPress} />
+<Checkbox status="checked" onPress={onPress} aria-label="Notify me" />
```

### Switch

`Switch` is now drawn by Paper instead of wrapping React Native's `Switch`, so iOS shows the Material Design 3 switch instead of the iOS one.

#### Removed props

`Switch` no longer takes React Native's `Switch` props, such as `trackColor`, `thumbColor`, `ios_backgroundColor` and `onChange`, or a `ref`. The `color` prop was removed too: set colors with the `theme` prop instead. The selected track uses `primary` and the selected handle uses `onPrimary`.

```diff
-<Switch value={value} onValueChange={setValue} color="tomato" />
+<Switch
+  value={value}
+  onValueChange={setValue}
+  theme={{ colors: { primary: 'tomato' } }}
+/>
```
