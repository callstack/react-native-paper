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

### Reduce motion

The `animation` theme key and its `scale` were removed. The new `reduceMotion` prop of `PaperProvider` turns Paper's animations on or off instead:

- `'auto'` (default): follows the reduce motion setting of the device.
- `'on'`: turns Paper's animations off.
- `'off'`: keeps Paper's animations on, even when the device setting is on.

In 5.x, `PaperProvider` set the `scale` itself and replaced any `scale` in the theme passed to it, so a `scale` of `0` only turned animations off in a nested `ThemeProvider` or a component's `theme` prop. To turn animations off, for example in tests, remove that `scale` and pass `reduceMotion="on"` to `PaperProvider`:

```diff
-<PaperProvider>
-  <ThemeProvider theme={{ ...LightTheme, animation: { scale: 0 } }}>
-    <App />
-  </ThemeProvider>
+<PaperProvider reduceMotion="on">
+  <App />
 </PaperProvider>
```

If your app was written for a 6.0 alpha build, which also read a `scale` set on `PaperProvider`, remove it from that theme too.

Other `scale` values, which made animations slower or faster, have no replacement in 6.0. A `scale` in a component's `theme` prop, such as `theme={{ animation: { scale: 2 } }}`, does nothing now, and it can no longer turn animations back on while reduce motion is on. Paper ignores an `animation` left in your theme. TypeScript reports it in a theme object written inline in the `theme` prop of `PaperProvider`, `ThemeProvider` or a component, or typed as `Theme`, but not in an untyped variable that also holds other theme keys.

In 5.x, `PaperProvider` also followed the device setting only when you passed no `theme`. In 6.x, `'auto'` follows the device setting with every theme, so if your app passes a custom theme, Paper's animations now stop when the user turns on reduce motion. 6.x also reads the setting when the app starts, while 5.x only reacted when it changed.

To follow the same preference in your own components, use the `useReduceMotion()` hook, which returns `true` when reduce motion is on. See [Reduce motion](./theming#reduce-motion) in the theming guide.

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
- `IconButton`
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

The `roundness` theme property was removed. Corner radii are now set in `theme.shapes.corner`, a scale of roles from `extraSmall` (4) to `extraExtraLarge` (48), and each component uses one fixed role. Paper ignores a `roundness` left in your theme. TypeScript reports it in a theme object written inline in the `theme` prop of `PaperProvider`, `ThemeProvider` or a component, or typed as `Theme`, but not in an untyped variable that also holds other theme keys.

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

`PaperProvider` merges its `theme` deeply too, so a custom theme only needs the roles it changes:

```diff
-import { MD3LightTheme, PaperProvider } from 'react-native-paper';
+import { LightTheme, PaperProvider } from 'react-native-paper';

 const theme = {
-  ...MD3LightTheme,
-  roundness: 2,
+  ...LightTheme,
+  shapes: {
+    corner: {
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

The 6.x theme has no `version`, `isV3`, `mode` or `animation` keys. Paper 6 only supports Material Design 3, so `version` and `isV3` have nothing to select. `mode` and `animation.defaultAnimationDuration` have no replacement, and `animation.scale` is replaced by the `reduceMotion` prop of `PaperProvider`, see [Reduce motion](#reduce-motion). Remove `version: 3` and `isV3` from your custom theme objects:

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

As with `roundness`, Paper ignores these keys, and TypeScript reports them in the same cases. Code that reads `theme.isV3` gets `undefined` once the key is gone, so a check like `theme.isV3 ? a : b` takes the Material Design 2 branch. Keep only the Material Design 3 branch.

#### `configureFonts`

`configureFonts` only takes `config` now. The `isV3` option is gone, and so are the Material Design 2 fonts that `configureFonts({ isV3: false })` returned. In JavaScript the option is ignored, so that call returns the Material Design 3 typescale.

```diff
-const fonts = configureFonts({ config: fontConfig, isV3: true });
+const fonts = configureFonts({ config: fontConfig });
```

#### `ThemeProvider`

`ThemeProvider` now merges its `theme` deeply onto the theme above it, as `PaperProvider` and a component's `theme` prop do, so a nested theme only needs the keys it changes. In 5.x it replaced the theme above it, so a partial theme made Paper's components throw when they rendered.

```diff
 <PaperProvider>
   <ThemeProvider
-    theme={{
-      ...LightTheme,
-      colors: { ...LightTheme.colors, primary: 'tomato' },
-    }}
+    theme={{ colors: { primary: 'tomato' } }}
   >
     <App />
   </ThemeProvider>
 </PaperProvider>
```

A full theme, such as `DarkTheme` or the theme `useTheme()` returns, gives the same result as before, except that custom keys of the theme above it are kept. The `theme` prop is now typed as a partial `Theme`, as on `PaperProvider`, so TypeScript reports a value that isn't a theme, such as a number, and keys the theme doesn't have, such as `roundness`. The `theme` prop of a component returned by `withTheme` gets the same type, and the component you wrap must take a `Theme` in its `theme` prop. A `ThemeProvider` without a `theme` now passes the theme above it on. In 5.x it gave its children the default light theme. To keep that, pass `theme={LightTheme}`.

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

### TouchableRipple without a press handler

A `TouchableRipple`, and anything built on it, is no longer a disabled control when it has no touch handler. Without `onPress`, `onLongPress`, `onPressIn` or `onPressOut`, and without `disabled`, it renders a plain view: assistive tech doesn't announce it as disabled, it isn't a keyboard stop, and it never takes the press, so a `Pressable` around it gets it. On Android and iOS a wrapping `Pressable` already got the press, except around a read-only radio (see below). On web it's new for components with the `button` role, such as `Button`, `Chip`, `IconButton` and `FAB`, which used to stop the press. `DataTable.Title` works the same way.

Without a handler or `disabled`, an activatable role becomes `none`: a `role` or `accessibilityRole` of `button`, `link`, `menuitem` or `tab`, and an `accessibilityRole` of `imagebutton` or `togglebutton`. The role stays when the touchable reports a toggle state with `aria-checked`, `aria-pressed` or `accessibilityState.checked`, also when the value is `false`. A selection doesn't keep the role: Android and iOS still report it, and on web `aria-selected` is dropped with the role. Every other role, such as `checkbox`, `radio` or `switch`, stays too, so a read-only `Checkbox` is still a checkbox and keeps its state.

```tsx
// Still a toggle (pressed on web, checked on Android and iOS),
// but does nothing when activated
<Button mode="outlined" selected>Bold</Button>
// No longer a button; still reports selected on Android and iOS
<Chip selected>Info</Chip>
```

On web, an `IconButton` or icon-only `FAB` labelled with `aria-label`, with no handler, no `disabled` and no toggle state, is an image named by its label, since the plain view there can't carry a name. An image can't carry a selection either, so its `aria-selected` is dropped too.

`hitSlop` applies only to a touchable that can be pressed. Without a handler, or with `disabled`, a touchable takes no touches outside its bounds, so it doesn't take them from its neighbors.

`RadioButton`, `RadioButton.Android`, `RadioButton.IOS` and `RadioButton.Item` with no press handler and no `RadioButton.Group` no longer take the press. They stay read-only radios, a row around them gets the press, and on web they're no longer a tab stop.

To have something look and announce disabled, pass `disabled`, which keeps the control and its role. Pass it to switch interactivity off at runtime too, instead of removing `onPress`. A touchable renders another element whenever it goes between having a handler or `disabled` and having neither, so its children remount and lose their state and focus. That includes toggling `disabled` on a touchable with no handler. `FAB.Menu` does this for its trigger: a trigger without `onPress` is a disabled button while the menu is closed, so it keeps its element when the menu opens.

```diff
-<Button onPress={isSaving ? undefined : save}>Save</Button>
+<Button onPress={save} disabled={isSaving}>Save</Button>
```

App tests change with it: a display-only element is no longer found by a role it lost, such as `button`, and is no longer disabled. Find it by its text or label instead.

In a disabled `TextInput`, every `TextInput.Icon` takes the disabled color, also over `iconColor` and the error color. One with a handler is a disabled `IconButton`, and an `opacity` in its `style` doesn't apply.

### Focus indicator

Interactive components now draw the Material Design 3 keyboard focus indicator: a 3dp ring in `theme.colors.secondary`, 2dp outside the component. On web it shows when an element gets focus from the keyboard (`:focus-visible`), and on Android when it gets focus from a hardware keyboard or D-pad. Clicking or touching an element shows no ring. iOS shows no ring.

`Snackbar` rings its action and close button in `theme.colors.inversePrimary`, the color of its action label, because `secondary` barely shows on its `inverseSurface` background. If a component's background is the ring color, such as an `Appbar` with a `secondary` background, the rings of the controls on it don't show: give those controls a `theme` with a contrasting `secondary`. `Appbar.Action`, `Appbar.BackAction` and `Appbar.Content` read the `theme` of the `Appbar` they are rendered in from context, and the actions get it inside a `Tooltip` or a `View` too, so you can give that `theme` to the `Appbar` instead of to each control. See [Parts read from the `Appbar`](#parts-read-from-the-appbar).

Components that fill a clipping container or touch their neighbours draw the ring 3dp inside their edge instead: `List.Item`, `List.Accordion`, `Checkbox.Item`, `RadioButton.Item`, `Menu.Item`, the `FAB.Menu` items, `Drawer.Item`, the `BottomNavigation` tabs, `DataTable.Row`, `DataTable.Cell`, `DataTable.Title` and `SegmentedButtons`. `Drawer.CollapsedItem` draws it around its icon and label, 2dp clear of the active indicator. `FAB` and `Switch` draw this ring instead of their own, and `Checkbox` keeps its circular ring around the state layer.

A `TouchableRipple`, and every component built on it, rings only while it can be pressed. A disabled one shows no ring. One with no touch handler and no `disabled` is the plain view described in [TouchableRipple without a press handler](#touchableripple-without-a-press-handler): it isn't a keyboard stop, so it never rings. This applies to `TouchableRipple` only: a `Switch` or `Drawer.CollapsedItem` without a handler is still a keyboard stop and rings.

An outward ring sits outside the component, so a scroll view or a container with `overflow: 'hidden'` clips it, and a neighbour that touches the component can cover it. Chips in a horizontal `ScrollView`, or a `TouchableRipple` that fills the width of a scroll view, show only part of the ring. Give the container 5dp of padding, or pass `focusRing="inward"` where the component takes it:

```tsx
<ScrollView horizontal contentContainerStyle={{ padding: 5 }}>
  <Chip onPress={showMusic}>Music</Chip>
</ScrollView>

<TouchableRipple focusRing="inward" onPress={openSettings}>
  <Text>Settings</Text>
</TouchableRipple>
```

`TouchableRipple` takes a new `focusRing` prop, and so do the components whose props include it, such as `IconButton`, `List.Item`, `DataTable.Row` and `DataTable.Cell`. It is `'outward'`, `'inward'` or `'none'`. `'none'` draws no ring, but on web it leaves the browser's own focus outline, so a component that draws its own indicator also needs `outline: 'none'` on web.

On web the ring comes from a stylesheet that Paper adds to the page, and on these elements it takes precedence over your own `:focus-visible` outline styles. There is no app-wide switch to turn the ring off. Its color follows `theme.colors.secondary`, from the theme or a component's `theme` prop.

On web, `Button`, `Card`, the `Chip` body, `FAB`, `FAB.Extended` and the `FAB.Menu` trigger and items draw the ring with the CSS `:has()` selector. A browser without it (Chrome before 105, Safari before 15.4, Firefox before 121) shows its own focus outline just inside their edge instead.

### Libraries built on Paper

Libraries built on Paper may not support 6.x yet. For example, `react-native-paper-dates` 0.24.1 still uses `HelperText`, the 5.x theme exports and `theme.roundness`, so its `DatePickerInput` crashes when it shows a validation error.

A library that reads `theme.animation.scale` to turn its own animations off should read `useReduceMotion()` instead. The 6.x theme has no `animation` key, so `theme.animation.scale` throws.

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

#### Parts read from the `Appbar`

`Appbar` no longer inspects its children and clones them to pass `color`, `theme`, `mode` and `style`. `Appbar.BackAction`, `Appbar.Content` and `Appbar.Action` now read the `dark` and `theme` props and the `mode` of the `Appbar` they are rendered in from context. This means `Appbar.Action` and `Appbar.BackAction` can be wrapped in other components, for example in a `Tooltip` or a `View`, and still get the colors and the theme of the `Appbar`. `Appbar.Content` positions the title in the `Appbar`, so render it directly in the `Appbar`, not in a wrapper.

Only these three parts read the colors and the theme of the `Appbar`. Other children, such as a custom icon or an inline SVG, never got them, and they still need an explicit `color` or `theme`. A `Tooltip` was the exception: the `Appbar` passed it its `theme`, and now it doesn't, so pass `theme` to a `Tooltip` that needs the theme of the `Appbar`.

The parts are rendered in the order they are given, so render the leading actions first, then `Appbar.Content`, then the trailing actions. Previously, `Appbar.BackAction` and the actions with `isLeading` were moved before the rest. The `isLeading` prop now only selects the icon color of the action (`onSurface` instead of `onSurfaceVariant`).

- `Appbar.Content` always has a `12dp` margin before its title. Previously, the margin was only added when the title was the first item after `Appbar.BackAction`.
- The `mode` prop of `Appbar.Content`, which was for internal use, is removed.

#### Layout of the modes

- In the `medium` and `large` modes, `Appbar` now lays out the actions in a single row and `Appbar.Content` places the title below them, instead of the `Appbar` rendering a row for the actions and a row for the title. The actions of all modes are centered vertically in a `64dp` row, so those of `medium` moved down by `4dp` and those of `large` moved up by `6dp`.
- In the `center-aligned` mode, the title is centered by measuring the width of the items on each side of it, so any actions, in any order, and custom children are taken into account. Previously, the actions before the title only counted as leading when they were `Appbar.BackAction` or had `isLeading`, and custom children were not counted. The title is centered when each side is at most two actions wide, as before.

#### Theme

`Appbar` now passes its `theme` to its parts in every mode. In 5.x, the `medium` and `large` modes didn't, so a bar with its own `theme` drew the icons, the title and the focus rings of these parts with the theme of the app. For example, a dark-themed bar in a light app drew dark icons and a dark title on its dark background.

A `theme` set on a part is merged over the `theme` of the `Appbar`, so it takes precedence for the values it sets and the rest comes from the `Appbar`. In 5.x, the `theme` of the `Appbar` overrode it.

#### Material 3 Expressive

- The `mode` prop of `Appbar` and `Appbar.Header` accepts two new values: `medium-flexible` and `large-flexible`. Their height is the minimum height (`112` and `120`), and they grow when the title wraps onto a second line.
- `Appbar.Action` has new `variant` and `width` props. `variant="filled"` and `variant="tonal"` render the action in a container, and `width="wide"` makes the container wider. Without `selected` the action shows the primary or the secondary container color. Pass `selected` to make it a toggle, with the selected and unselected colors of the icon button.
- `Appbar` and `Appbar.Header` have a new `isScrolled` prop. Set it when the content below has scrolled, to switch the container to the `surfaceContainer` color. Unlike `elevated`, it doesn't add elevation.

```tsx
<Appbar.Header mode="large-flexible" isScrolled={isScrolled}>
  <Appbar.BackAction onPress={() => {}} />
  <Appbar.Content title="Photos" />
  <Appbar.Action
    icon="share"
    variant="filled"
    width="wide"
    onPress={() => {}}
  />
</Appbar.Header>
```

#### Bottom bar

Using `Appbar` as a bottom bar is deprecated. Material Design 3 moves the bottom bar to toolbars. It continues to work in 6.x, and will be replaced by the `Toolbar` component once it is available.

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
+<Dialog visible={visible} onDismiss={hideDialog} title="Alert" />
```

`Dialog.Title` and the other parts move to props, as [Prop-based API](#prop-based-api) shows.

The dialog now has the `dialog` role. Its accessible name is set automatically from the `title` prop. A string title is used as the `aria-label` on all platforms. Any other title is linked through `aria-labelledby`, which applies on web only, so on iOS and Android the dialog has no name unless you set `aria-label`. You can specify a different name with the new `aria-label` prop, e.g. when the dialog has no title:

```jsx
<Dialog
  visible={visible}
  onDismiss={hideDialog}
  content="Are you sure?"
  aria-label="Delete file"
/>
```

`Dialog` follows the same back button, Escape key and focus behavior as `Modal`, including the `initialFocusRef` and `restoreFocusRef` props. As with `Modal`, focus returns on iOS and Android only when you pass `restoreFocusRef`.

When the dialog is `dismissable`, screen reader users can dismiss it with a visually hidden button inside the dialog. You can change the button's accessibility label with the new `dismissAccessibilityLabel` prop.

- The default elevation changed from level `1` to level `3`.
- The `style` prop no longer configures the background color or border radius. You can override `theme.colors.surfaceContainerHigh` and `theme.shapes.corner.extraLarge` using the `theme` prop instead.

#### Prop-based API

`Dialog` no longer takes `children`. The `icon`, `title`, `content` and `actions` props are the only way to build a dialog, so move each `Dialog.Icon`, `Dialog.Title`, `Dialog.Content` and `Dialog.Actions` to its prop.

**Removed**

- **`children`** was removed from `Dialog`. A dialog with children renders none of them.
- **`Dialog.Icon`**, **`Dialog.Title`**, **`Dialog.Content`**, **`Dialog.Actions`** and **`Dialog.ScrollArea`** were removed, with the `DialogActionsProps` and `DialogIconProps` types. `DialogTitleProps`, `DialogContentProps` and `DialogScrollAreaProps` stay, for typing `titleProps`, `contentProps` and `scrollAreaProps`.

Use the dedicated props instead:

- **`Dialog.Icon`** → **`icon`**
- **`Dialog.Title`** → **`title`**
- **`Dialog.Content`** → **`content`**
- **`Dialog.Actions`** → **`actions`**
- **`Dialog.ScrollArea`** → **`scrollable`**

The new **`actions`** prop is more customizable because it accepts **`React.ReactNode[]`**. Unlike the previous `Dialog.Actions` children behavior, the dialog no longer injects **`compact`** and **`uppercase`** into action components automatically. The passed components are laid out in the dialog's actions row, 8dp apart.

**New props**

- **`scrollable`** renders the dialog content inside a scrollable area.
- **`contentProps`** passes props to the `View` that holds the content when `scrollable` is not enabled.
- **`scrollAreaProps`** passes props to the `View` that holds the `ScrollView` and its dividers when `scrollable` is enabled.
- **`scrollViewProps`** passes props to the internal `ScrollView` when `scrollable` is enabled.
- **`aria-label`** overrides the title as the dialog's accessible name. Set it when the `title` isn't a string, since iOS and Android can't use `aria-labelledby`.
- **`aria-labelledby`** is the `nativeID` of an element that provides the dialog's accessible name. It takes precedence over the title and is applied on web only.

```tsx
// Before (v5)
<Portal>
  <Dialog visible={visible} onDismiss={hideDialog}>
    <Dialog.Title>Alert</Dialog.Title>
    <Dialog.Content>
      <Text variant="bodyMedium">This is a simple dialog</Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={hideDialog}>Done</Button>
    </Dialog.Actions>
  </Dialog>
</Portal>

// After (v6)
<Dialog
  visible={visible}
  onDismiss={hideDialog}
  title="Alert"
  content="This is a simple dialog"
  actions={[
    <Button key="done" mode="text" onPress={hideDialog}>
      Done
    </Button>,
  ]}
/>
```

#### Dialog actions

The dialog no longer injects `compact` on its action buttons, and the default [`Button`](#button) mode is now `filled`. Add `mode="text"` to each button. At the default `small` size, the buttons are **40dp** tall, the Material Design 3 size for dialog actions. The `compact` text buttons in 5.x were **38dp** tall. For a more compact look, also add `size="extra-small"`, which is **32dp** tall:

```tsx
// Before (v5)
<Dialog.Actions>
  <Button onPress={hide}>Done</Button>
</Dialog.Actions>

// After (v6)
<Dialog
  actions={[
    <Button key="done" mode="text" onPress={hide}>
      Done
    </Button>,
  ]}
/>
```

The actions row takes no `style`, so a `style` passed to `Dialog.Actions` has no replacement. The row places the actions at its end, 8dp apart, with 24dp of padding at the sides and the bottom.

#### Scrollable content

`Dialog.ScrollArea` becomes the `scrollable` prop. The dialog renders its own `ScrollView`, so the children of your `ScrollView` move to `content`, its props to `scrollViewProps`, and the scroll area's `style` to `scrollAreaProps`:

```tsx
// Before (v5)
<Dialog visible={visible} onDismiss={hideDialog}>
  <Dialog.Title>Terms</Dialog.Title>
  <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
    <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
      <Text variant="bodyMedium">{terms}</Text>
    </ScrollView>
  </Dialog.ScrollArea>
</Dialog>

// After (v6)
<Dialog
  visible={visible}
  onDismiss={hideDialog}
  title="Terms"
  content={terms}
  scrollable
  scrollAreaProps={{ style: { paddingHorizontal: 0 } }}
  scrollViewProps={{ contentContainerStyle: { paddingHorizontal: 24 } }}
/>
```

A scroll area that held a `FlatList` or another list component has no replacement, since `scrollable` always renders a `ScrollView`.

#### Icon color and size

The icon is 24dp, in `theme.colors.secondary`. `Dialog.Icon`'s `color` and `size` have no matching props: to change them, pass a function to `icon` that renders an `Icon`:

```tsx
// Before (v5)
<Dialog.Icon icon="alert" color={colors.error} size={32} />

// After (v6)
<Dialog
  icon={() => <Icon source="alert" color={colors.error} size={32} />}
/>
```

#### Layout

- The dialog is now 280dp to 560dp wide and centered. In 5.x it took the full width of the screen less the side inset, so on tablets and the web it is now narrower.
- With an `icon`, the title is centered under it. Set `textAlign` in `titleProps.style` to align it differently.
- The dividers of the scroll area use `outlineVariant` instead of `surfaceVariant`.
- The side inset of at least 26dp is now padding on the wrapper around the dialog, not a horizontal margin on the dialog, so a `marginHorizontal` in `style` adds to it instead of replacing it.
- If your app was written for a 6.0 alpha build: the 24dp space at the top now belongs to the first part (the icon, title or content) instead of being padding on the dialog, so a `paddingTop` in `style` adds to it instead of replacing it, as in 5.x.

#### Parts outside a `Dialog`

`Dialog.Content` and `Dialog.Actions` also worked outside a `Dialog`, for example in a `Modal`. There, use a `View` with their 5.x styles instead, and add `mode="text"` to the buttons as [Dialog actions](#dialog-actions) explains:

```tsx
// Before (v5)
<Dialog.Content>
  <Text variant="bodyMedium">Delete this file?</Text>
</Dialog.Content>
<Dialog.Actions>
  <Button onPress={hide}>Cancel</Button>
  <Button onPress={remove}>Delete</Button>
</Dialog.Actions>

// After (v6)
<View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
  <Text variant="bodyMedium">Delete this file?</Text>
</View>
<View
  style={{
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    columnGap: 8,
    paddingHorizontal: 24,
    paddingBottom: 24,
  }}
>
  <Button mode="text" onPress={hide}>Cancel</Button>
  <Button mode="text" onPress={remove}>Delete</Button>
</View>
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

### TouchableRipple

`borderless` has no effect on web. The web ripple is always clipped to the touchable's shape, including when `centered` is set, and the touchable no longer clips its own content. A child that needs a clipped or rounded shape should carry that shape itself.

`hitSlop` now works on web: the touchable renders an invisible target that extends past its bounds. An ancestor with `overflow: 'hidden'` or a scroll view clips it, as on Android.

`TouchableRipple` draws the keyboard focus ring and takes a new `focusRing` prop. See [Focus indicator](#focus-indicator).

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

`startAccessory` and `endAccessory` follow the writing direction. In RTL, `startAccessory` sits on the right on every platform, while v5's `left` stayed on the left on web.

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

`TextInput.Icon` without a press handler is decorative: it is hidden from
assistive technology and is not a keyboard focus stop. An icon with `onPress`,
`onLongPress`, `onPressIn` or `onPressOut` requires an `aria-label` or
`accessibilityLabel` that names its action, and warns in development without
one:

```tsx
const [value, setValue] = React.useState('');

// Before (v5)
<TextInput
  label="Search"
  value={value}
  onChangeText={setValue}
  left={<TextInput.Icon icon="magnify" />}
  right={<TextInput.Icon icon="close" onPress={() => setValue('')} />}
/>

// After (v6)
<TextInput
  label="Search"
  value={value}
  onChangeText={setValue}
  startAccessory={(props) => <TextInput.Icon {...props} icon="magnify" />}
  endAccessory={(props) => (
    <TextInput.Icon
      {...props}
      icon="close"
      aria-label="Clear search"
      onPress={() => setValue('')}
    />
  )}
/>
```

#### Icon size

`TextInput.Icon`'s `size` is renamed `iconSize`, as on `IconButton`, where `size` is now a named container scale.

```tsx
// Before (v5)
<TextInput.Icon icon="magnify" size={20} />

// After (v6)
<TextInput.Icon icon="magnify" iconSize={20} />
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

Supporting text, the character counter, `prefix` and `suffix` describe the field
instead of becoming part of its accessible name, and the prefix and suffix are
no longer read as separate text. On web, the input references them with
`aria-describedby` (the prefix and suffix while they are shown), and IDs you
pass in `aria-describedby` are kept. On Android and iOS, they are only exposed
through `accessibilityHint`, alongside any hint you pass, and the visible text
is hidden from assistive technology, so tests that find these texts with
`getByText` need `{ includeHiddenElements: true }`. Users who turn hints off,
for example with the VoiceOver Speak Hints setting, do not hear them. The
placeholder of an empty field with a label stays blank until the label floats,
so it describes the field as well: on web until the input shows it, and on
Android and iOS in the hint. The input no longer sets `aria-valuenow` and
`aria-valuemax` when the counter reaches `maxLength`.

When no label or explicit accessible name is supplied, the placeholder names the
field, including after text is entered. A disabled field always exposes its
disabled state, even when `aria-disabled={false}` is supplied. It is also always
read-only, even with `readOnly={false}`, which in 5.x left a disabled field
editable.

On web, error supporting text uses `role="alert"`. On Android and iOS, a new or
changed error message is announced through `AccessibilityInfo` once it has
stayed the same for a second, so a message that changes on every keystroke is
announced once it stops changing. An error that is already shown when the field
mounts is not announced there. On web, explicit `aria-invalid` values are kept;
when omitted, validity is derived from `error` and the character counter. Custom
input renderers should forward the accessibility props they receive.

The filled indicator uses `onSurfaceVariant` and the outlined border uses
`outline` at rest. On web, both change to `onSurface` on hover, and an invalid
field changes from `error` to `onErrorContainer`. Focus takes precedence over
hover and uses `primary`, or `error` for an invalid field. A disabled field uses
the disabled colors even when `error` is set. On web it keeps `aria-invalid`; on
Android and iOS the error text stays in its hint.

If your app was written for a 6.0 alpha build: the input text, prefix and suffix
of a disabled field were dimmed twice there. They are now dimmed once, to 38%
opacity as in 5.x, so they are more visible than in the alpha builds.

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

### DataTable

The Paper 6.x `DataTable` adds table semantics. The structure it produces and the accessible names it exposes have both changed. Existing tables should still be working.

#### Touch handling

Rows, cells and titles with no touch handler render a plain `View` instead of a disabled touchable

```tsx
// Before (v5): announced as a disabled control
<DataTable.Row>
  <DataTable.Cell>{item.name}</DataTable.Cell>
</DataTable.Row>

// After (v6): pass a handler if the row is meant to be pressable
<DataTable.Row onPress={() => select(item)}>
  <DataTable.Cell>{item.name}</DataTable.Cell>
</DataTable.Row>
```

On the web, a pressable row is clickable but is no longer a Tab stop, because a table row cannot also be a button. Put a control in a cell so keyboard and screen reader users can reach the action:

```tsx
<DataTable.Row onPress={() => toggle(item)}>
  <DataTable.Cell column="selected">
    <Checkbox
      status={selected ? 'checked' : 'unchecked'}
      onPress={() => toggle(item)}
      aria-label={`Select ${item.name}`}
    />
  </DataTable.Cell>
  <DataTable.Cell column="name">{item.name}</DataTable.Cell>
</DataTable.Row>
```

Pass `tabIndex={0}` on the row to keep it a Tab stop anyway.

#### Screen reader announcements

- new `rowCount` on the table and `index` on each row give the row positions. On a page of a larger set, `index` counts from the start of the whole set
- new `hasHeader` defaults to `true`. Pass `hasHeader={false}` for a table without a `DataTable.Header`, or every row position on the web is one too high
- on iOS and Android, a cell is announced with the title of its column, matched by `column`
- `nativeFocusMode="cell"` gives one stop per cell instead of one per row
- `accessible={false}` on a row opts that row out
- `formatRowPosition` replaces the wording, or removes it with `null`
- the table does not count its children, so rows in a `View`, a fragment or a component of your own get the same position as inline rows

```tsx
// Before (v5)
<DataTable>
  {items.slice(from, to).map((item) => (
    <DataTable.Row key={item.key}>{/* ... */}</DataTable.Row>
  ))}
</DataTable>

// After (v6)
<DataTable aria-label="Nutrition" rowCount={items.length}>
  {items.slice(from, to).map((item, i) => (
    <DataTable.Row key={item.key} index={from + i}>
      {/* ... */}
    </DataTable.Row>
  ))}
</DataTable>
```

#### Pagination labels

- `labels` is new, and localizes every control
- `aria-label="pagination-container"` and `aria-label="Options Select"` were removed: reach the controls by role or text, e.g. `getByRole('button', { name: 'Rows per page, 2' })`

```tsx
// After (v6)
<DataTable.Pagination
  labels={{
    container: 'Paginacja',
    previousPage: 'Poprzednia strona',
    nextPage: 'Następna strona',
    pageStatus: ({ page, numberOfPages }) =>
      `Strona ${page} z ${numberOfPages}`,
  }}
  /* ... */
/>
```

#### Alignment

- `numeric` is unchanged, and now also applies tabular figures
- `align` is new, accepts `'start'`, `'center'`, `'end'`

```tsx
// Before (v5): right-aligned
<DataTable.Cell numeric>{item.calories}</DataTable.Cell>

// After (v6): right-aligned, plus lined-up digits
<DataTable.Cell numeric>{item.calories}</DataTable.Cell>

// Centred, still with lined-up digits
<DataTable.Cell numeric align="center">{item.calories}</DataTable.Cell>

// Right-aligned text that is not numeric
<DataTable.Cell align="end">{item.status}</DataTable.Cell>
```

`align` defaults to `'end'` for numeric columns and `'start'` otherwise.

#### Text wrapping

- **single line, always** → single line at the default font scale, unclamped above it
- `numberOfLines` is honoured exactly at every font scale; pass `0` to never clamp

#### Column definitions

- `columns` on `DataTable` is new and optional
- `column` on a title or cell selects a column by key, and is required when the table has `columns`

```tsx
// Before (v5)
const styles = StyleSheet.create({ first: { flex: 2 } });

<DataTable.Title style={styles.first}>Dessert</DataTable.Title>
<DataTable.Cell style={styles.first}>{item.name}</DataTable.Cell>

// After (v6)
const columns = [
  { key: 'name', flex: 2 },
  { key: 'calories', numeric: true },
];

<DataTable columns={columns}>
  <DataTable.Header>
    <DataTable.Title column="name">Dessert</DataTable.Title>
    <DataTable.Title column="calories">Calories</DataTable.Title>
  </DataTable.Header>
  <DataTable.Row>
    <DataTable.Cell column="name">{item.name}</DataTable.Cell>
    <DataTable.Cell column="calories">{item.calories}</DataTable.Cell>
  </DataTable.Row>
</DataTable>
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

### IconButton

`IconButton` now follows the Material 3 Expressive spec. The color modes, size API, and toggle `selected` behavior have changed. Passing the old numeric `size` (for example `size={24}`) crashes at runtime, because `size` is now a named token and `IconButtonTokens.sizes[24]` is `undefined`.

#### Mode names

- **`contained`** → **`filled`**
- **`contained-tonal`** → **`tonal`**
- Unspecified mode is now **`standard`** (no container fill), which matches the previous default.

```tsx
// Before (v5)
<IconButton icon="camera" mode="contained" onPress={onPress} />
<IconButton icon="camera" mode="contained-tonal" onPress={onPress} />

// After (v6)
<IconButton icon="camera" mode="filled" onPress={onPress} />
<IconButton icon="camera" mode="tonal" onPress={onPress} />
```

#### Size

`size` is a named scale: `'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'`, the same names as `Button`. It defaults to `'small'`, which still uses a 24dp icon.

To set the glyph size in dp without changing the container scale, use `iconSize`. The container keeps the size of its `size` (a square 40dp for the default), so a glyph larger than it is clipped. Pick a larger `size` instead.

```tsx
// Before (v5)
<IconButton icon="camera" size={24} onPress={onPress} />
<IconButton icon="camera" size={32} onPress={onPress} />

// After (v6)
<IconButton icon="camera" onPress={onPress} />
<IconButton icon="camera" iconSize={32} onPress={onPress} />
```

The container no longer follows the icon. In v5 it was the icon plus 8dp on each side, so `size={20}` drew a 36dp button and `size={32}` a 48dp one. Moving the number to `iconSize` keeps the glyph but puts it in the container of the named `size`, 40dp for the default, so a button you migrate this way can grow or shrink. Check rows and headers that depend on its width. For a smaller button, use `size="extra-small"` (32dp with a 20dp icon). To take the same space as before, lower the 6dp margin around the button.

```tsx
// Before (v5): a 36dp button, 48dp with its margin
<IconButton icon="star" size={20} onPress={onPress} />

// After (v6): a 32dp button, 44dp with its margin
<IconButton icon="star" size="extra-small" onPress={onPress} />

// After (v6): a 40dp button, 48dp with a 4dp margin
<IconButton icon="star" iconSize={20} style={{ margin: 4 }} onPress={onPress} />
```

```tsx
// After (v6): named container sizes
<IconButton icon="plus" size="extra-small" onPress={onPress} />
<IconButton icon="plus" size="small" onPress={onPress} />
<IconButton icon="plus" size="medium" onPress={onPress} />
<IconButton icon="plus" size="large" onPress={onPress} />
<IconButton icon="plus" size="extra-large" onPress={onPress} />
```

#### Shape

`style.borderRadius` no longer overrides the container corner or shapes the press, hover and disabled feedback. Use `shape`: `'round'` (default) or `'square'`. Toggle-ON inverts the resting shape; press uses a shared corner for both. Arbitrary radii from `style` are not supported.

```tsx
// Before (v5)
<IconButton icon="camera" style={{ borderRadius: 0 }} onPress={onPress} />

// After (v6)
<IconButton icon="camera" shape="square" onPress={onPress} />
```

#### Touch target

An `IconButton` with a touch handler reaches the 48dp minimum target through hit slop, without changing what is drawn. This applies to `extra-small` and `small`, whose containers are smaller than 48dp. Pass `hitSlop` to override it, or `hitSlop={0}` to opt out. A disabled button, or one with no touch handler, gets no extra target.

#### `Appbar.Action` and `Appbar.BackAction`

`size` is no longer a numeric prop on `Appbar.Action` or `Appbar.BackAction`. They inherit `IconButton`'s named `size` (default `'small'`). Drop `size={24}`. For a custom glyph size, pass `iconSize`.

```tsx
// Before (v5)
<Appbar.Action icon="magnify" size={24} onPress={onPress} />
<Appbar.BackAction size={24} onPress={onPress} />

// After (v6)
<Appbar.Action icon="magnify" onPress={onPress} />
<Appbar.BackAction onPress={onPress} />
```

#### `containerColor` while disabled

A disabled `filled` or `tonal` button, or a disabled selected `outlined` one, takes the disabled container color, `onSurface` at 0.10 opacity, and ignores `containerColor`. As in 5.x, a disabled button doesn't keep the color passed for its container, just as `iconColor` doesn't apply either.

#### `selected={false}` uses toggle-off colors

`selected` is tri-state. Omit it for the default (non-toggle) colors. Pass `true` / `false` only for a toggle.

For `filled`, the default and toggle-on containers use `primary`. Toggle-off (`selected={false}`) uses `surfaceContainer` instead of `primary`.

```tsx
// Before (v5): selected={false} still used the default (non-toggle) colors
<IconButton icon="star-outline" mode="contained" selected={false} onPress={onPress} />

// After (v6): omit selected unless the button is a toggle
<IconButton icon="star-outline" mode="filled" onPress={onPress} />

// After (v6): explicit toggle off / on
<IconButton
  icon={isStarred ? 'star' : 'star-outline'}
  mode="filled"
  selected={isStarred}
  onPress={toggleStarred}
/>
```

#### `Card.Title` `right` props

`Card.Title` still calls `right({ size: 24 })`. Do not spread those props onto `IconButton`: `size` is no longer a number. Ignore the callback argument, or pass it as `iconSize`.

```tsx
// Before (v5)
<Card.Title
  title="Card title"
  right={(props) => (
    <IconButton {...props} icon="dots-vertical" onPress={onPress} />
  )}
/>

// After (v6)
<Card.Title
  title="Card title"
  right={() => <IconButton icon="dots-vertical" onPress={onPress} />}
/>
```

```tsx
// After (v6): keep the 24dp glyph from Card.Title
<Card.Title
  title="Card title"
  right={(props) => (
    <IconButton
      icon="dots-vertical"
      iconSize={props.size}
      onPress={onPress}
    />
  )}
/>
```

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

On the web, a `Text` under `direction="rtl"` (on `PaperProvider` or `LocaleProvider`) now aligns right by default. In 5.x it stayed left. A `textAlign` in `style` still wins.

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

The variants changed meaning. In 5.x, `primary`, `secondary` and `tertiary` painted the container role, e.g. `primaryContainer`. In 6.x they paint the role itself, e.g. `primary`, and the new `primaryContainer`, `secondaryContainer` and `tertiaryContainer` variants paint the container role. So a FAB with an explicit `variant` looks different. To keep the 5.x colors:

- **`primary`** (the 5.x default) → **`primaryContainer`** (the 6.x default)
- **`secondary`** → **`secondaryContainer`**
- **`tertiary`** → **`tertiaryContainer`**
- **`surface`** has no variant. Set `containerColor` and `contentColor` instead, e.g. to `theme.colors.surfaceContainerHigh` and `theme.colors.primary`.

A FAB without a `variant` keeps its 5.x colors.

```diff
-<FAB icon="plus" variant="secondary" onPress={onPress} />
+<FAB icon="plus" variant="secondaryContainer" onPress={onPress} />
```

If your app was written for a 6.0 alpha build, rename the `tonalPrimary`, `tonalSecondary` and `tonalTertiary` variants to `primaryContainer`, `secondaryContainer` and `tertiaryContainer`. The colors are the same. The old names have no aliases, so in JavaScript a `FAB`, a `FAB.Extended` or the `FAB.Menu` trigger with one of them throws at render. One that also sets `containerColor` renders, but a `FAB.Menu` then gives its close button and items the tertiary colors.

```diff
-<FAB icon="plus" variant="tonalSecondary" onPress={onPress} />
+<FAB icon="plus" variant="secondaryContainer" onPress={onPress} />
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
- **`loading`** and **`animated`**: no replacement.
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

#### `visible`

A FAB with `visible={false}` is now hidden from assistive technology (`aria-hidden`), can't be focused and takes no press. In 5.x it only stopped taking touches, so screen readers and the keyboard could still reach it. This applies to `FAB.Extended` and the `FAB.Menu` trigger too. On web, hiding a FAB that has keyboard focus moves focus back to the element that had it before, if that element is still on the page.

Tests that find a hidden FAB by its role, label or test ID stop finding it, because React Native Testing Library skips hidden elements. Pass `includeHiddenElements` to find it:

```tsx
screen.getByTestId('compose', { includeHiddenElements: true });
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

#### Size

`Switch` draws a 52×32 track inside a 48dp tall touch target, so rows containing a switch may change height.

#### Switches without `onValueChange`

A `Switch` with no `onValueChange` used to render as an enabled, focusable control that did nothing when activated, and screen readers announced it as operable. It now renders as read-only and logs a warning. Pass `onValueChange` to make it interactive, or set `readOnly` or `disabled` to render it as a state indicator:

```tsx
// Before (v5)
<Switch value={isDarkTheme} />

// After (v6)
<Switch value={isDarkTheme} onValueChange={setIsDarkTheme} />
<Switch value={isDarkTheme} readOnly />
<Switch value={isDarkTheme} disabled />
```

A read-only switch keeps its enabled appearance and exposes its on/off state to screen readers, but it cannot be focused with a keyboard or pressed. On web it exposes `aria-readonly`. On iOS and Android it exposes a disabled accessibility state, because React Native has no read-only state for switches. Use `disabled` when you also want the disabled appearance.

This most often shows up where the switch sits inside a row that owns the press. Give the row the switch role and state, and set `aria-hidden` on the inner switch, so screen readers announce the row as one switch with its on/off state. A hidden read-only switch renders with no role and cannot take focus, so the row does not nest a second interactive control:

```diff
-<TouchableRipple onPress={toggleTheme}>
+<TouchableRipple
+  onPress={toggleTheme}
+  role="switch"
+  aria-checked={isDarkTheme}
+>
   <View style={styles.row}>
     <Text>Dark Theme</Text>
     <View pointerEvents="none">
-      <Switch value={isDarkTheme} />
+      <Switch value={isDarkTheme} readOnly aria-hidden />
     </View>
   </View>
 </TouchableRipple>
```

On web, such a row toggles with Enter but not with Space, because React Native Web only handles Space for elements with the `button` role.

#### Icon color

When selected, an icon set with `checkedIcon` uses `onPrimaryContainer`. If you set `checkedIcon` and pass a `theme` with a partial `theme.colors` override, include `onPrimaryContainer`, because omitted roles fall back to the app theme:

```tsx
import { Switch, useTheme } from 'react-native-paper';

const TertiarySwitch = ({ value, onValueChange }) => {
  const theme = useTheme();
  const switchTheme = {
    colors: {
      primary: theme.colors.tertiary,
      onPrimary: theme.colors.onTertiary,
      primaryContainer: theme.colors.tertiaryContainer,
      onPrimaryContainer: theme.colors.onTertiaryContainer,
    },
  };

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      checkedIcon="check"
      theme={switchTheme}
    />
  );
};
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
