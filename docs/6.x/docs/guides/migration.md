---
title: Migration from Paper 5.x to 6.x
---

## General changes

### Animations

React Native Paper 6 uses [Reanimated](https://docs.swmansion.com/react-native-reanimated/) for most animations instead of the built-in React Native `Animated` API. So make sure to install `react-native-reanimated` 4.3.0 or later and `react-native-worklets` 0.8.1 or later, then complete the Reanimated setup. See the [getting started guide](./getting-started) for Expo and Community CLI instructions.

The following props now accept animated styles returned from `useAnimatedStyle`. They no longer accept `Animated.Value` or `Animated.AnimatedInterpolation` where these were previously supported:

- `Appbar` and `Appbar.Header`: `style`
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

- `Appbar` and `Appbar.Header`
- `Avatar.Icon`, `Avatar.Image` and `Avatar.Text`: background color
- `Banner`
- `Button`
- `Card`
- `Chip`
- `Dialog`
- `Menu`: `contentStyle`
- `Searchbar`
- `Snackbar`

You can use the component's color prop where available, or override the corresponding theme colors. See the component sections below for details.

Components no longer read values from the `style` prop to derive other styles, since this is not possible with animated styles. The affected props have been replaced with dedicated props:

- `Appbar` and `Appbar.Header`: `backgroundColor` and the border radius props (`borderRadius`, `borderTopLeftRadius` etc.) replace `style.backgroundColor` and the border radius in `style`
- `Avatar.Icon`, `Avatar.Image` and `Avatar.Text`: `backgroundColor` replaces `style.backgroundColor`
- `Button`: `iconSize` replaces `labelStyle.fontSize` for the size of the icon and the loading indicator
- `Button`: `textColor` replaces `labelStyle.color` for the color of the icon and the loading indicator
- `Card`: `borderColor` replaces `style.borderColor` for the outline color

`Tooltip` no longer reads positioning styles from the wrapped element. Apply them to a parent `View` wrapping the `Tooltip`, see [Tooltip](#tooltip).

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

Components built on `TouchableRipple` that extend its props still take `rippleColor`, such as `IconButton` (and so `Appbar.Action` and `TextInput.Icon`), `List.Item` and `DataTable.Row`.

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

`IconSource`, the type of icon props such as `IconButton`'s `icon`, isn't exported from the package root. You can get it from the root through `IconButtonProps`:

```tsx
import type { IconButtonProps } from 'react-native-paper';

type IconSource = IconButtonProps['icon'];
```

If you import it from Paper's type declarations instead, the path changed:

```diff
-import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
+import type { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon';
```

`Icon`'s `source` prop now uses this type too, see [Icon](#icon).

#### `MD3Colors`

`MD3Colors` was renamed to `Palette`. It has every key `MD3Colors` had, such as `Palette.tertiary70`, plus new tones such as `primary98` and `neutral94`. The `neutral` tones from `neutral10` to `neutral99` are slightly different colors.

```diff
-import { MD3Colors } from 'react-native-paper';
+import { Palette } from 'react-native-paper';

-const color = MD3Colors.tertiary70;
+const color = Palette.tertiary70;
```

#### `roundness`

The `roundness` theme property was removed. Corner radii are now set in `theme.shapes.corner`, a scale of roles from `extraSmall` (4) to `extraExtraLarge` (48), and each component uses one fixed role. Paper ignores a `roundness` left in your theme, and TypeScript only reports it in a theme object written inline in a `theme` prop or typed as `Theme`.

In 5.x, each of these components multiplied `roundness` by a fixed number, and the 6.x defaults match the 5.x corners with the default `roundness` of 4. To port a custom `roundness`, set each role to your `roundness` times its multiplier:

| Role             | Default | 5.x multiplier | Components                                          |
| ---------------- | ------- | -------------- | --------------------------------------------------- |
| `extraSmall`     | 4       | 1              | `Menu`, `Snackbar`, `Tooltip`                       |
| `small`          | 8       | 2              | `Chip`                                              |
| `medium`         | 12      | 3              | `Card`                                              |
| `largeIncreased` | 20      | 5              | `SegmentedButtons`                                  |
| `extraLarge`     | 28      | 7              | `Dialog`, `Drawer.Item`, `Searchbar` (`mode="bar"`) |

`Button` (5.x multiplier 5) is a full pill by default and doesn't read a corner role. With `shape="square"` it reads the corner of its `size`, as listed in the Button section's [Style](#style) notes: `medium` at the default `small` size.

`FAB` and `FAB.Extended` use the role of their `size`: `large` (16) by default, `largeIncreased` for `size="medium"` and `extraLarge` for `size="large"`. `TextInput` no longer follows the theme: its corners are always 4.

A component's `theme` prop is merged deeply, so you can set only the role you need:

```diff
-<Button theme={{ roundness: 2 }}>Press me</Button>
+<Button shape="square" theme={{ shapes: { corner: { medium: 10 } } }}>
+  Press me
+</Button>
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

#### Removed keys

The 6.x theme has no `version`, `isV3`, `mode` or `animation.defaultAnimationDuration` keys. Paper 6 only supports Material Design 3, so `version` and `isV3` have nothing to select, and `mode` and `defaultAnimationDuration` have no replacement. Remove `version: 3` and `isV3` from your custom theme objects:

```diff
 const theme = {
   ...LightTheme,
-  version: 3,
-  isV3: true,
   colors: {
     ...LightTheme.colors,
     primary: 'tomato',
   },
 };
```

As with `roundness`, Paper ignores these keys, and TypeScript only reports them in a theme object written inline in a `theme` prop or typed as `Theme`. Code that reads `theme.isV3` gets `undefined` once the key is gone, so a check like `theme.isV3 ? a : b` takes the Material Design 2 branch. Keep only the Material Design 3 branch.

#### `configureFonts`

`configureFonts` only takes `config` now. The `isV3` option is gone, and so are the Material Design 2 fonts that `configureFonts({ isV3: false })` returned. In JavaScript the option is ignored, so that call returns the Material Design 3 typescale.

```diff
-const fonts = configureFonts({ config: fontConfig, isV3: true });
+const fonts = configureFonts({ config: fontConfig });
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

- The `style` props for `Appbar` and `Appbar.Header` no longer configure the background color or border radius. Use the `backgroundColor` prop and the border radius props (`borderRadius`, `borderTopLeftRadius`, `borderCurve` etc.) instead.
- The `style.elevation` property is no longer supported. Use the `elevated` prop to control Appbar elevation.
- The default height of `Appbar` now includes the `safeAreaInsets`, so the content area keeps the height of the selected `mode`.
- The `height` specified in `style` for `Appbar.Header` now includes the status bar height. Previously, the status bar height was added to it automatically.

e.g.:

```diff
<Appbar.Header
- style={{ backgroundColor: 'red', borderBottomLeftRadius: 16 }}
+ backgroundColor="red"
+ borderBottomLeftRadius={16}
>
  <Appbar.Content title="Title" />
</Appbar.Header>
```

To keep the height of the content row when setting `height` in `style`, add the top inset from `useSafeAreaInsets()` of `react-native-safe-area-context`:

```diff
+const { top } = useSafeAreaInsets();
+
<Appbar.Header
- style={{ height: 80 }}
+ style={{ height: 80 + top }}
>
  <Appbar.Content title="Title" />
</Appbar.Header>
```

### Avatar

The `style` prop for `Avatar.Icon`, `Avatar.Image` and `Avatar.Text` no longer configures the background color. Use the `backgroundColor` prop instead. The text or icon color is still derived from the background color unless `color` is specified.

e.g.:

```diff
<Avatar.Text
  label="XD"
- style={{ backgroundColor: 'red' }}
+ backgroundColor="red"
/>
```

### Tooltip

`Tooltip` no longer reads positioning styles such as `position: 'absolute'` from the `style` of the wrapped element. Apply them to a parent `View` wrapping the `Tooltip` instead.

e.g.:

```diff
- <Tooltip title="Add">
-   <FAB icon="plus" style={{ position: 'absolute', right: 16, bottom: 16 }} />
- </Tooltip>
+ <View style={{ position: 'absolute', right: 16, bottom: 16 }}>
+   <Tooltip title="Add">
+     <FAB icon="plus" />
+   </Tooltip>
+ </View>
```

### Drawer

`NavigationRail` is the Material Design 3 replacement for `Drawer.CollapsedItem` and the drawer-based side navigation. It supports a collapsed (96dp) and expanded (220–360dp) layout, a header slot for a menu button and `FAB`, and a modal variant.

```diff
- <View>
-   <Drawer.CollapsedItem focusedIcon="inbox" unfocusedIcon="inbox-outline" label="Inbox" active />
-   <Drawer.CollapsedItem focusedIcon="send" unfocusedIcon="send-outline" label="Sent" />
- </View>
+ <NavigationRail expanded={expanded}>
+   <NavigationRail.Item icon="inbox-outline" activeIcon="inbox" label="Inbox" active />
+   <NavigationRail.Item icon="send-outline" activeIcon="send" label="Sent" />
+ </NavigationRail>
```

- **`focusedIcon` / `unfocusedIcon`** → **`activeIcon` / `icon`**
- Expanded rows replace `Drawer.Item`; toggle them with the `expanded` prop instead of rendering a different component.
- Use `NavigationRail.Modal` inside a `Portal` where a temporary drawer was used before.

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

The Escape key on web now dismisses the modal too, and `dismissableBackButton` controls it together with the back button. When several modals are open, back and Escape dismiss only the topmost one. When `dismissableBackButton` is `false`, back is absorbed and nothing is dismissed, rather than passed on to the content behind the modal. Escape dismisses nothing either, but it still reaches your own key handlers. A handler that calls `preventDefault()` on the key keeps the modal open. Escape also works while a text field has focus, and is ignored while an input method editor (IME) composition is active.

Opening a modal now moves focus into it, and closing it hands focus back:

- **Web:** focus returns to the element that had it before the modal opened. With `restoreFocusRef`, it goes there instead, unless that element is gone by then, such as a list row the modal deleted. Then focus returns to the element that had it before.
- **iOS and Android:** focus comes back only with `restoreFocusRef`. Without it, nothing is restored.

You can choose the elements with the new `initialFocusRef` and `restoreFocusRef` props. They accept the ref of any element or component with a `focus()` method, such as a `TextInput`. A component handle has `focus()` called. On iOS, a host element such as a `View` or `Pressable` gets screen reader focus, not keyboard focus. TalkBack on Android doesn't follow these props: when the modal opens, it moves its focus to the first element inside the modal by itself:

```tsx
const inputRef = React.useRef<TextInputHandles>(null);
const buttonRef = React.useRef<React.ComponentRef<typeof View>>(null);

<Modal
  visible={visible}
  onDismiss={hideModal}
  aria-label="Rename file"
  initialFocusRef={inputRef}
  restoreFocusRef={buttonRef}
>
  <TextInput ref={inputRef} label="Name" />
</Modal>;
```

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

`Dialog` follows the same back button, Escape key and focus behavior as `Modal`, including the `initialFocusRef` and `restoreFocusRef` props. As with `Modal`, focus returns on iOS and Android only when you pass `restoreFocusRef`.

When the dialog is `dismissable`, screen reader users can dismiss it with a visually hidden button inside the dialog. You can change the button's accessibility label with the new `dismissAccessibilityLabel` prop.

- The default elevation changed from level `1` to level `3`.
- The `style` prop no longer configures the background color or border radius. You can override `theme.colors.surfaceContainerHigh` and `theme.shapes.corner.extraLarge` using the `theme` prop instead.

#### `Dialog.Actions`

`Dialog.Actions` no longer injects `compact` on its buttons, and the default [`Button`](#button) mode is now `filled`. Add `mode="text"` to each button. At the default `small` size, the buttons are **40dp** tall, the Material Design 3 size for dialog actions. The `compact` text buttons in 5.x were **38dp** tall. For a more compact look, also add `size="extra-small"`, which is **32dp** tall:

```tsx
// Before (v5)
<Dialog.Actions>
  <Button onPress={hide}>Done</Button>
</Dialog.Actions>

// After (v6)
<Dialog.Actions>
  <Button mode="text" onPress={hide}>
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

On web, a menu now closes on the Escape key when it is pressed down, instead of when it is released. Back and Escape dismiss only the topmost overlay, so a menu opened from a `Modal` or `Dialog` closes first and leaves the modal open.

On Android, an open menu now also keeps the back press: it calls `onDismiss`, and the screen behind no longer goes back. Previously the press reached that screen as well. Without an `onDismiss`, the menu leaves the press to whatever is underneath, so pass one to close the menu on back.

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

### Chip

The close button (`onClose`) now fills the trailing 34dp column reserved for it, instead of only the 26x18 area around its icon, and its touch target extends to 48dp in height. Taps in that column that used to activate the chip's `onPress` now activate `onClose`.

### IconButton

Corner radii set through `style` no longer shape the press, hover and disabled feedback.

### TouchableRipple

`borderless` has no effect on web. The web ripple is always clipped to the touchable's shape, including when `centered` is set, and the touchable no longer clips its own content. A child that needs a clipped or rounded shape should carry that shape itself.

`hitSlop` now works on web: the touchable renders an invisible target that extends past its bounds. An ancestor with `overflow: 'hidden'` or a scroll view clips it, as on Android.

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

A `HelperText` that isn't tied to one input, such as an error under a group of inputs, has no `supportingText` to move to. Render a `Text` in the theme's error color instead:

```tsx
import { Text, useTheme } from 'react-native-paper';

const GroupError = ({ visible }: { visible: boolean }) => {
  const { colors } = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <Text variant="bodySmall" style={{ color: colors.error }}>
      Enter at least one phone number
    </Text>
  );
};
```

#### Removed props

No direct `TextInput` equivalents for:

- **`dense`**, **`contentStyle`**, **`underlineStyle`**, **`outlineStyle`**
- **`underlineColor`**, **`activeUnderlineColor`**, **`outlineColor`**, **`activeOutlineColor`**, **`textColor`**

Use **`style`** on the inner input and the **`theme`** for colors.

```tsx
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
```

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

// After (v6)
<TextInput theme={theme} style={{ fontSize: 16, color: '#1C1B1F' }} />;
```

### Button

`Button` is modernized to Material Design 3 Expressive. The button modes were
renamed, the default mode changed, and a size and shape scale were added.

#### Mode

- **`mode="contained"`** → **`mode="filled"`**
- **`mode="contained-tonal"`** → **`mode="tonal"`**

```tsx
// Before (v5)
<Button mode="contained">Save</Button>
<Button mode="contained-tonal">Save</Button>

// After (v6)
<Button mode="filled">Save</Button>
<Button mode="tonal">Save</Button>
```

#### Default mode

The default is now **`filled`**, not `text`, matching the MD3 emphasis
hierarchy. Pass `mode="text"` to keep the old look.

```tsx
// Before (v5) - rendered as a text button
<Button>Cancel</Button>

// After (v6) - same appearance
<Button mode="text">Cancel</Button>
```

#### Size and shape

New `size` and `shape` props. `size` defaults to `small`, which keeps the
**40dp** height of the only size 5.x had. Its horizontal padding is different,
see the appearance changes below.

```tsx
<Button size="extra-small">XS</Button>
<Button size="large" shape="square">Large, square</Button>
```

The container now also morphs its corner while pressed. Pass
`animateShape={false}` to opt out.

#### Toggle

`selected` turns a button into a toggle. Leave it **undefined** to make it
a plain button. It is ignored on `mode="text"`, which MD3 gives no toggle.

```tsx
<Button mode="filled" selected={isOn} onPress={toggle}>
  Bold
</Button>
```

#### Removed props

- **`uppercase`** → `labelStyle={{ textTransform: 'uppercase' }}`.
- **`compact`** → `size="extra-small"`. This also changes the height:
  `extra-small` is **32dp** tall, while `compact` only reduced the horizontal
  margins and the min width, and kept the height: **40dp**, or **38dp** for
  `text` buttons.
- **`contentStyle={{ flexDirection: 'row-reverse' }}`** → `iconPosition="trailing"`.
- **`rippleColor`** is removed, with no replacement. The ripple uses the label
  color at the pressed-state opacity.

```tsx
// Before (v5)
<Button uppercase compact contentStyle={{ flexDirection: 'row-reverse' }} icon="chevron-right">
  Next
</Button>

// After (v6)
<Button
  size="extra-small"
  iconPosition="trailing"
  icon="chevron-right"
  labelStyle={{ textTransform: 'uppercase' }}
>
  Next
</Button>
```

#### Style

`Button` renders on `Surface`, so its `style` follows the same rules:

- **Border radius** is no longer set through `style`. Use `shape`, or override
  the corner token that the size maps to. `round` is the full pill; `square`
  reads `corner.medium` at `extra-small` and `small`; `corner.large` at
  `medium`; and `corner.extraLarge` at `large` and `extra-large`.
- **Background color** is no longer set through `style`. Use `buttonColor`.
- **Border color and width** are no longer set through `style`. An inner view
  draws the outline, so `borderColor` in `style` does not recolor it, and
  `borderWidth` adds a second border around it. To recolor the outline,
  override `theme.colors.outlineVariant`.
- **Animated styles** must come from Reanimated. A React Native
  `Animated.Value` in `style` is not applied.

```tsx
// Before (v5)
<Button style={{ borderRadius: 8, backgroundColor: 'red' }}>
  Press me
</Button>

// After (v6)
<Button
  shape="square"
  theme={{ shapes: { corner: { medium: 8 } } }}
  buttonColor="red"
>
  Press me
</Button>
```

#### Content style

The content takes `minHeight`, `paddingStart` and `paddingEnd` from `size`.
To change them in `contentStyle`, set these same properties. On Android and
iOS, `padding` and `paddingHorizontal` do not override them, and a `height`
below `minHeight` has no effect.

```tsx
// Before (v5)
<Button contentStyle={{ height: 36, paddingHorizontal: 8 }}>Press me</Button>

// After (v6)
<Button contentStyle={{ minHeight: 36, paddingStart: 8, paddingEnd: 8 }}>
  Press me
</Button>
```

#### Label style

- `labelStyle={{ fontSize }}` no longer changes the icon size. The icon follows
  `size`; use the `iconSize` prop to change the size of the icon and the
  loading indicator.
- `labelStyle={{ color }}` no longer changes the color of the icon and the
  loading indicator. Use the `textColor` prop instead.

#### Appearance changes

These need no code change, but the rendering differs:

- The `outlined` label and icon use **`onSurfaceVariant`** instead of
  `primary`.
- The `outlined` outline uses **`outlineVariant`** instead of `outline`, and
  keeps it when disabled instead of switching to `surfaceDisabled`. A theme
  that set `colors.outline` to restyle outlined buttons sets `outlineVariant`
  now.
- `Banner` actions are `text` buttons instead of `compact` ones, so they are
  wider: **16dp** of horizontal padding at the default `small` size instead of
  **8dp**, and a **64dp** minimum width.
- The default icon size is **20dp**, up from **18dp**.
- The resting corner is the full pill radius instead of a fixed **20dp**.
- At the default `small` size, the horizontal padding is **16dp** for every
  mode. In 5.x, the label margins were **24dp** for `filled`, `tonal`,
  `elevated` and `outlined`, and **12dp** for `text` (**16dp** with an icon).
  Existing buttons change width.

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
    <Button mode="filled">Action</Button>
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
    <Button mode="filled">Action</Button>
    <Button mode="outlined">Another Action</Button>
  </Card.Actions>
</Card>
```

#### Outline color

The `borderColor` in `style` no longer changes the outline color in `outlined` mode. Use the `borderColor` prop instead:

```diff
<Card
  mode="outlined"
- style={{ borderColor: 'red' }}
+ borderColor="red"
>
  <Card.Content>...</Card.Content>
</Card>
```

#### `Card.Cover`

The `style` prop of `Card.Cover` is now typed as a `View` style. Image style properties such as `resizeMode` or `tintColor` were never applied, so pass them as `Image` props instead:

```diff
- <Card.Cover source={cover} style={{ resizeMode: 'contain' }} />
+ <Card.Cover source={cover} resizeMode="contain" />
```

`Card.Cover` no longer applies the border radius from `style` to the image directly. The image is clipped by the container, so any border radius passed in `style` still applies.

#### `Card.Actions`

`Card.Actions` no longer injects `mode` on the buttons. To keep the previous behavior, you need to set `mode="outlined"` on the first button and `mode="filled"` (formerly `contained`) on the rest:

```tsx
// Before (v5)
<Card.Actions>
  <Button>Cancel</Button>
  <Button>Ok</Button>
</Card.Actions>

// After (v6)
<Card.Actions>
  <Button mode="outlined">Cancel</Button>
  <Button mode="filled">Ok</Button>
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

### Icon

`Icon`'s `source` prop is typed as `IconSource` instead of `any`, so a value that isn't an icon name, an image source or a render function, such as a boolean or `undefined`, is now a type error. `Icon` still renders nothing for those values.

If you pass a field that can be `undefined`, such as an optional `focusedIcon` on a route in `BottomNavigation`'s `renderIcon`, check it first:

```diff
-renderIcon={({ route, color }) => (
-  <Icon source={route.focusedIcon} color={color} size={24} />
-)}
+renderIcon={({ route, color }) =>
+  route.focusedIcon ? (
+    <Icon source={route.focusedIcon} color={color} size={24} />
+  ) : null
+}
```

A render function's props are now typed as what `Icon` passes: `size`, `color`, `direction` and `testID`. For an icon that isn't directional, `direction` is now `'ltr'`, where 5.x passed `null`, and the `icon` function in `PaperProvider`'s `settings` gets `'ltr'` too. Paper's own icons look the same, since they only flip for `'rtl'`.

`testID` is optional (`testID?: string`) in those props, so if you typed your render function's props with a required `testID: string`, you now get a type error. Make it optional:

```diff
-const renderIcon = ({ size, testID }: { size: number; testID: string }) => (
+const renderIcon = ({ size, testID }: { size: number; testID?: string }) => (
```
