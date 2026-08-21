---
title: Migration from Paper 5.x to 6.x
---

React Native Paper 6 updates every component to the current Material Design 3 spec and drops Material Design 2 support. The `version: 2` theme switch, the MD2 themes and the MD2-era components are gone. Removed and renamed API has no deprecation aliases, so everything that changed is listed below.

:::tip
Components and props that are not listed on this page kept their public API. The end of this page lists what is [planned for 6.0 stable](#planned-for-60-stable) but not in the alpha yet.
:::

## Installation and packaging

### New peer dependencies

Animations now run on Reanimated. Install it and its worklets runtime next to the existing `react-native-safe-area-context` peer:

```bash npm2yarn
npm install react-native-reanimated react-native-worklets
```

| v5 peer dependencies                                  | v6 peer dependencies                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `react`, `react-native`, `react-native-safe-area-context` | `react`, `react-native`, `react-native-safe-area-context`, **`react-native-reanimated >=4.3.0`**, **`react-native-worklets >=0.8.1`** |

### ESM-only package

The CommonJS build was dropped. `main` now points to `lib/module/index.js` and the `module`, `react-native` and `source` fields are gone. Metro and Re.Pack handle this out of the box. Jest does not, so if your tests import Paper, add it to `transformIgnorePatterns` in your Jest config:

```js
transformIgnorePatterns: [
  'node_modules/(?!(@react-native|react-native|react-native-paper|react-native-reanimated|react-native-worklets|react-native-safe-area-context)/)',
],
```

### `react-native-paper/react-navigation` entry point removed

The `react-native-paper/react-navigation` subpath, `createMaterialBottomTabNavigator` and the related types are gone. Use the bottom tabs navigator from React Navigation and render Paper's bar through its `tabBar` prop. The [BottomNavigation with React Navigation guide](./bottom-navigation) walks through it.

| v5                                                                                                                                   | v6                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation'`                                            | `createBottomTabNavigator` from `@react-navigation/bottom-tabs` + `tabBar={props => <BottomNavigation.Bar … />}` |
| `MaterialBottomTabNavigationEventMap`, `MaterialBottomTabNavigationOptions`, `MaterialBottomTabNavigationProp`, `MaterialBottomTabScreenProps` | removed, no replacement (use the `@react-navigation/bottom-tabs` types)            |

```diff
- import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
+ import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
+ import { BottomNavigation } from 'react-native-paper';

- const Tab = createMaterialBottomTabNavigator();
+ const Tab = createBottomTabNavigator();
```

```tsx
<Tab.Navigator
  tabBar={({ navigation, state, descriptors, insets }) => (
    <BottomNavigation.Bar
      navigationState={state}
      safeAreaInsets={insets}
      onTabPress={({ route }) => navigation.navigate(route.name, route.params)}
      renderIcon={({ route, focused, color }) =>
        descriptors[route.key].options.tabBarIcon?.({ focused, color, size: 24 }) ?? null
      }
      getLabelText={({ route }) => descriptors[route.key].options.title ?? route.name}
    />
  )}
>
  {/* screens */}
</Tab.Navigator>
```

The `react-native-paper/babel` plugin is unchanged.

## Theming

### Material Design 2 is gone

Everything that existed only to support `version: 2` themes was deleted. There is no replacement for any of it. v6 always renders MD3.

| v5                                                                       | v6                                                            |
| ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `MD2LightTheme`, `MD2DarkTheme`                                          | removed, no replacement                                       |
| `MD2Colors`                                                              | removed, no replacement                                       |
| `MD2Theme` (type)                                                        | removed, no replacement                                       |
| `theme.version` (`2 \| 3`)                                               | removed, `PaperProvider` ignores it                           |
| `theme.isV3`                                                             | removed, no replacement                                       |
| `theme.mode` (`'adaptive' \| 'exact'`)                                   | removed, no replacement                                       |
| `theme.colors.accent` and every other MD2-only color role                | removed, use the MD3 roles (`primary`, `secondary`, `tertiary`, …) |
| `configureFonts({ isV3: false })` / MD2 `Fonts` (`regular`, `medium`, `light`, `thin`) | removed, `configureFonts({ config })` only accepts the MD3 typescale (see [Fonts](./fonts)) |
| `theme.roundness`                                                        | `theme.shapes.corner.*` (`extraSmall`, `small`, `medium`, `large`, `largeIncreased`, `extraLarge`, `extraLargeIncreased`, `extraExtraLarge`) |
| `theme.animation.defaultAnimationDuration`                               | `theme.motion.duration.*` (`short1`…`extraLong4`); `theme.animation.scale` is kept |

### Renamed exports

The `MD3` prefix was dropped from all public names. The v5 names don't exist anymore, not even as type aliases.

| v5                                                 | v6                                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `MD3LightTheme`                                    | `LightTheme`                                                                                         |
| `MD3DarkTheme`                                     | `DarkTheme`                                                                                          |
| `DefaultTheme`                                     | `LightTheme`                                                                                         |
| `MD3Colors` (the reference palette object)         | `Palette`                                                                                            |
| `MD3Theme` (type)                                  | `Theme`                                                                                              |
| `ThemeBase` (type)                                 | `Theme`                                                                                              |
| `MD3Elevation` (type)                              | `Elevation`                                                                                          |
| `MD3TypescaleKey` (runtime **enum**)               | `TypescaleKey` (**type-only** union of the same 15 keys). Using it as a value, like `MD3TypescaleKey.bodyLarge`, has no replacement. Write the string `'bodyLarge'` instead |
| `MD3AndroidColors`, `ElevationLevels` (enum), `MD3Palette` (types) | removed, no replacement                                                                  |

```diff
- import { MD3LightTheme, MD3Colors, type MD3Theme } from 'react-native-paper';
+ import { LightTheme, Palette, type Theme } from 'react-native-paper';

- const theme: MD3Theme = {
-   ...MD3LightTheme,
-   roundness: 2,
-   colors: { ...MD3LightTheme.colors, primary: MD3Colors.primary40 },
+ const theme: Theme = {
+   ...LightTheme,
+   shapes: { ...LightTheme.shapes, corner: { ...LightTheme.shapes.corner, small: 8 } },
+   colors: { ...LightTheme.colors, primary: Palette.primary40 },
  };
```

### Removed color roles and helpers

| v5                                                   | v6                                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `theme.colors.backdrop`                              | `theme.colors.scrim` (Paper applies a `0.32` alpha to it)                                        |
| `theme.colors.surfaceDisabled`, `theme.colors.onSurfaceDisabled` | removed, disabled states use `theme.colors.onSurface` at `0.38` opacity              |
| `shadow()` export                                    | removed, no replacement. Use `Surface` with `elevation`, or `theme.colors.elevation.levelN`      |
| `overlay()` export                                   | removed, no replacement (it was the MD2 dark-mode elevation overlay). Use the `surfaceContainer*` roles |

### Type changes

- **`theme.colors.*` is typed `ColorValue`, not `string`.** Code that does string operations on a theme color (`theme.colors.primary.toUpperCase()`, passing it to a `string`-typed prop of another library) needs a cast or `String(...)`. To match, most component color props (`color`, `iconColor`, `buttonColor`, `textColor`, `selectedColor`, `containerColor`, `uncheckedColor`, …) and render prop callbacks (`left({ color })`, `renderIcon({ color })`) changed from `string` to `ColorValue` as well.
- `PaperProvider` now picks light or dark from `theme.dark` (falling back to the system color scheme) and shallow-merges `theme.colors` over the base scheme. A partial `{ colors: { primary } }` override no longer wipes the other roles. `theme.version` is ignored.
- `adaptNavigationTheme` keeps its signature. The generated `colors.card` now maps to `surfaceContainer` instead of `elevation.level2`.

### New in v6

None of this is breaking, but it's useful when replacing removed API. `Theme` has new `shapes`, `motion` and `elevation` sections and 20 new color roles (`surfaceContainer*`, `surfaceDim`/`surfaceBright`, `*Fixed`/`*FixedDim`/`on*Fixed*`, `stateLayerPressed`). `DynamicLightTheme`, `DynamicDarkTheme` and `isDynamicColorSupported` expose Android 12+ dynamic color. `PaperProvider` accepts `direction` (see [RTL](./rtl)) and `reduceMotion` (`'auto' | 'on' | 'off'`), and `useLocale` / `LocaleProvider` are exported. See the [Theming guide](./theming) for the full shape.

## Typography

The Material Design 2 typography components, already deprecated in v5, were removed together with their prop types. Use `Text` with a `variant` instead. The `variant` keys are unchanged. With the MD2 fallback gone, `variant` is now always applied.

| v5                                                                    | v6                                           |
| --------------------------------------------------------------------- | -------------------------------------------- |
| `Caption` (+ `CaptionProps`)                                          | `<Text variant="bodySmall">`                 |
| `Paragraph` (+ `ParagraphProps`)                                      | `<Text variant="bodyMedium">`                |
| `Subheading` (+ `SubheadingProps`)                                    | `<Text variant="titleMedium">`               |
| `Title` (+ `TitleProps`)                                              | `<Text variant="titleLarge">`                |
| `Headline` (+ `HeadlineProps`)                                        | `<Text variant="headlineSmall">`             |
| `Text` `ref: React.ForwardedRef<{ setNativeProps }>`                  | `ref: React.Ref<{ setNativeProps(args: object): void }>` |

```diff
- <Headline>Headline</Headline>
+ <Text variant="headlineSmall">Headline</Text>

- <Title>Title</Title>
+ <Text variant="titleLarge">Title</Text>

- <Subheading>Subheading</Subheading>
+ <Text variant="titleMedium">Subheading</Text>

- <Paragraph>Paragraph</Paragraph>
+ <Text variant="bodyMedium">Paragraph</Text>

- <Caption>Caption</Caption>
+ <Text variant="bodySmall">Caption</Text>
```

## Accessibility props → `aria-*`

All components now take the `aria-*` / `role` props from React Native instead of the older `accessibility*` ones. Where a component declared an accessibility prop in its own `Props`, the prop name changed. Where it only set them internally, the rendered accessibility tree changed but your code doesn't need to.

| v5                                                         | v6                                                               |
| ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `accessibilityLabel`                                       | `aria-label`                                                     |
| `accessibilityRole`                                        | `role` (`'header'` → `'heading'`, `'search'` → `'searchbox'`)    |
| `accessibilityState={{ checked }}`                         | `aria-checked` (`boolean \| 'mixed'`; `'indeterminate'` → `'mixed'`) |
| `accessibilityState={{ selected }}`                        | `aria-selected`                                                  |
| `accessibilityState={{ disabled }}`                        | `aria-disabled` (derived from `disabled`, can't be overridden)   |
| `accessibilityState={{ busy }}`                            | `aria-busy`                                                      |
| `accessibilityState={{ expanded }}`                        | `aria-expanded`                                                  |
| `accessibilityLiveRegion`                                  | `aria-live` (`'none'` → `'off'`)                                 |
| `accessibilityViewIsModal`                                 | `aria-modal`                                                     |
| `accessibilityElementsHidden`                              | `aria-hidden`                                                    |
| `accessibilityValue={{ min, max, now }}`                   | `aria-valuemin`, `aria-valuemax`, `aria-valuenow`                |
| `accessibilityTraits`, `accessibilityComponentType`        | removed, no replacement (legacy RN props)                        |

```diff
- <Button accessibilityLabel="Save draft" accessibilityRole="button" onPress={save}>Save</Button>
+ <Button aria-label="Save draft" role="button" onPress={save}>Save</Button>

- <FAB icon="plus" accessibilityLabel="Compose" accessibilityState={{ expanded: open }} />
+ <FAB icon="plus" aria-label="Compose" aria-expanded={open} />
```

**Where `accessibilityLabel` no longer type-checks** (the component has a closed prop set, so the old name is gone): `Checkbox.Item`, `FAB`, `FAB.Extended`, `FAB.Menu` (inside the `trigger` and `items` objects), `List.Accordion`, `Menu.Item`, `RadioButton.Item`, `SegmentedButtons` (inside `buttons[]`), `Switch`, `ToggleButton`, and `BottomNavigation` / `BottomNavigation.Bar` route objects.

**Where the documented prop changed but the old name still compiles**: `Appbar.Action`, `Appbar.BackAction`, `Button`, `Chip`, `DataTable.Pagination`, `Drawer.Item`, `Drawer.CollapsedItem` and `IconButton` declare `'aria-label'` now, but they also forward native view props, so `accessibilityLabel` still reaches the native view. You should still migrate. `aria-label` is the documented prop and the only one Paper reads.

Also:

- `Button` and `Chip`: `accessibilityRole` → `role`.
- `FAB`, `FAB.Extended`, `Menu.Item`: the `accessibilityState` object prop was split into `aria-checked`, `aria-selected`, `aria-busy` and `aria-expanded`.
- `BottomNavigation` and `BottomNavigation.Bar`: route objects use `'aria-label'` instead of `accessibilityLabel` (`getAccessibilityLabel` defaults to `route['aria-label']`).

**Not renamed** (still the v5 name): `Button.accessibilityHint`, `Chip.closeIconAccessibilityLabel`, `DataTable.Pagination.selectPageDropdownAccessibilityLabel`, `Menu.overlayAccessibilityLabel`, `Searchbar.searchAccessibilityLabel` / `clearAccessibilityLabel` / `traileringIconAccessibilityLabel`, `Snackbar.iconAccessibilityLabel`.

## Changes that affect many components

### `rippleColor` removed

The per-component ripple color override was dropped. Ripples and state layers now come from the MD3 tokens of each component. There is no replacement.

Removed from: `Button`, `Checkbox.Item`, `Chip`, `Drawer.Item`, `FAB` (and the former `AnimatedFAB` / `FAB.Group`), `List.Accordion`, `Menu.Item`, `RadioButton.Item`, `Searchbar` (`rippleColor` and `traileringRippleColor`), `Snackbar`, `ToggleButton`, and `DataTable.Pagination` (`paginationControlRippleColor`, `dropdownItemRippleColor`, `selectPageDropdownRippleColor`).

`TouchableRipple` keeps `rippleColor`. Components that forward their props to it (`IconButton`, `Appbar.Action`, `Appbar.BackAction`, `TextInput.Icon`, `Checkbox`, `List.Item`, `DataTable.Row` / `DataTable.Cell`, `RadioButton.Android` / `RadioButton.IOS`) still accept it through that passthrough. It's no longer a documented prop of theirs though, and the default color is now token-driven.

### `*Variant` props are typed `TypescaleKey`

`Card.Title` `titleVariant` / `subtitleVariant`, `Checkbox.Item` `labelVariant`, `RadioButton.Item` `labelVariant` and `Text` `variant` were typed `keyof typeof MD3TypescaleKey`. They are now `TypescaleKey`. The accepted strings are the same, only code that passed the enum member breaks.

### `ref` is no longer part of many `Props` types

Components whose props extended `React.ComponentPropsWithRef<typeof View>` now extend `ViewProps` (likewise `ImageProps` for `Card.Cover`, `PressableProps` for `DataTable.Title`, `TextProps` for `Badge`). Affected: `ActivityIndicator`, `Avatar.*`, `Badge`, `Card.Actions` / `Content` / `Cover` / `Title`, `DataTable.*`, `Dialog.Actions` / `Content` / `ScrollArea`, `Drawer.*`, `List.Section`, `ProgressBar`, `Surface`. Passing a `ref` still works where the component forwards one. The difference is that `ref` is no longer visible in the `…Props` type. Components that previously used `forwardRef` (`Appbar.Action`, `Appbar.BackAction`, `Button`, `IconButton`, `ToggleButton`, `FAB`, `Surface`) take `ref` as a regular prop typed `React.Ref<View>` instead of `React.RefObject<View>`.

## Components

Only components with a changed public API are listed below, in alphabetical order. Accessibility renames, `rippleColor` removals and `string` → `ColorValue` changes are covered above and not repeated per component.

These are the components and sub-components that no longer exist:

| v5                                                                                 | v6                                                                                          |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `AnimatedFAB` (+ `AnimatedFABProps`, `AnimatedFABIconMode`, `AnimatedFABAnimateFrom`) | [`FAB.Extended`](#fabextended-replaces-animatedfab)                                      |
| `FAB.Group` (+ `FABGroupProps`)                                                    | [`FAB.Menu`](#fabmenu-replaces-fabgroup)                                                    |
| `HelperText` (+ `HelperTextProps`)                                                 | [`TextInput` `supportingText`](#helpertext)                                                 |
| `Caption`, `Headline`, `Paragraph`, `Subheading`, `Title`                          | [`Text` with a `variant`](#typography)                                                      |
| `TextInput.Affix` (+ `TextInputAffixProps`)                                        | [`TextInput` `prefix` / `suffix`](#textinputaffix)                                          |
| `Checkbox.Android`, `Checkbox.IOS` (+ `CheckboxAndroidProps`, `CheckboxIOSProps`)  | [`Checkbox`](#checkbox)                                                                     |
| `createMaterialBottomTabNavigator`                                                 | [React Navigation bottom tabs](#react-native-paperreact-navigation-entry-point-removed)     |

### Appbar <i>(Top app bar)</i>

`Appbar` / `Appbar.Header` `mode` was ignored under MD2 themes. It is now always applied.

#### Appbar.Content

The MD2 subtitle, deprecated in v5, was removed.

| v5               | v6                                    |
| ---------------- | ------------------------------------- |
| `subtitle`       | removed, no replacement               |
| `subtitleStyle`  | removed, no replacement               |

```diff
- <Appbar.Content title="Title" subtitle="Subtitle" />
+ <Appbar.Content title="Title" />
```

### Badge

The badge follows the MD3 sizes: a 6dp dot without `children`, a 16dp pill with them.

| v5                                                   | v6                                                        |
| ---------------------------------------------------- | --------------------------------------------------------- |
| `size`                                               | removed, no replacement. Size is derived from `children`  |
| `ref`                                                | removed from props                                        |
| props typed as `Animated.Text` props (`Animated.Value` accepted in `style` etc.) | plain `TextProps`. Pass static values, `visible` handles the fade |

```diff
- <Badge size={8} />
+ <Badge />
```

### BottomNavigation <i>(Navigation bar)</i>

Applies to both `BottomNavigation` and `BottomNavigation.Bar`. `BottomNavigation.SceneMap` and the rest of the `Bar` API are unchanged, but see [Planned for 6.0 stable](#planned-for-60-stable).

| v5                                                | v6                                                                |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| route `color`                                     | removed, no replacement (MD2 per-tab color)                       |
| `getColor`                                        | removed, no replacement                                           |
| route `accessibilityLabel`                        | route `'aria-label'`                                              |
| `shifting` default `routes.length > 3` under MD2  | default `false`                                                   |
| `compact` default `!theme.isV3`                   | default `false`                                                   |

```diff
routes: [
-  { key: 'album', title: 'Album', focusedIcon: 'image-album', color: '#3F51B5', accessibilityLabel: 'Album' },
+  { key: 'album', title: 'Album', focusedIcon: 'image-album', 'aria-label': 'Album' },
]
```

### Button

`mode` still accepts `'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'`.

| v5                          | v6                                                                  |
| --------------------------- | ------------------------------------------------------------------- |
| `color`                     | `buttonColor` (background) / `textColor` (label and icon)           |
| `accessibilityRole`         | `role`                                                              |

```diff
- <Button mode="contained" color="red" onPress={onPress}>Save</Button>
+ <Button mode="contained" buttonColor="red" onPress={onPress}>Save</Button>
```

### Checkbox

`Checkbox` renders one Material 3 checkbox on every platform. The platform-specific components and their prop types are gone. It now also forwards `TouchableRipple` props (`accessible`, `onFocus`, `onBlur`, `borderless`, `rippleColor`, …).

| v5                                   | v6                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| `Checkbox.Android`, `Checkbox.IOS`   | `Checkbox`                                                                      |
| `CheckboxAndroidProps`, `CheckboxIOSProps` | `CheckboxProps`                                                           |
| n/a                                 | new `error` (uses `theme.colors.error`) and `style` (tap-target style)          |

```diff
- <Checkbox.Android status="checked" onPress={toggle} />
+ <Checkbox status="checked" onPress={toggle} />
```

#### Checkbox.Item

| v5        | v6                        |
| --------- | ------------------------- |
| `mode`    | removed, no replacement   |

```diff
- <Checkbox.Item label="Remember me" status="checked" mode="android" />
+ <Checkbox.Item label="Remember me" status="checked" />
```

### Chip

`accessibilityRole` → `role` (default `'button'`). `mode` (`'flat' | 'outlined'`) is unchanged.

### DataTable

#### DataTable.Pagination

`paginationControlRippleColor`, `dropdownItemRippleColor` and `selectPageDropdownRippleColor` were removed with no replacement. All other props are unchanged.

### Dialog

#### Dialog.Title

Its props were based on the removed MD2 `Title` component. They are now based on `Text`, so `variant` is available. `children`, `style` and `theme` are unchanged.

### FAB <i>(Floating action button)</i>

The floating action button family was rebuilt on the MD3 spec: `FAB` is the plain button, `FAB.Extended` replaces `AnimatedFAB` and `FAB.Menu` replaces `FAB.Group`. `FAB` now has a closed prop set and no longer spreads `Surface` / `View` props.

| v5                                                      | v6                                                                                                          |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `mode: 'flat' \| 'elevated'`                            | removed, no replacement. Elevation is token-driven                                                          |
| `variant: 'primary' \| 'secondary' \| 'tertiary' \| 'surface'` (default `'primary'`) | `variant: 'primary' \| 'secondary' \| 'tertiary' \| 'tonalPrimary' \| 'tonalSecondary' \| 'tonalTertiary'` (default **`'tonalPrimary'`**; `'surface'` removed) |
| `size: 'small' \| 'medium' \| 'large'`                  | `size: 'default' \| 'medium' \| 'large'` (56 / 80 / 96dp; `'small'` removed, `'default'` is the default)    |
| `small`, `customSize`                                   | removed, no replacement                                                                                     |
| `label`                                                 | removed, use `FAB.Extended`                                                                                 |
| `color`                                                 | `contentColor` (new `containerColor` for the background)                                                    |
| `icon` (optional when `label` was set)                  | `icon` is required                                                                                          |
| `uppercase`, `animated`, `loading`, `disabled`, `onLongPress`, `delayLongPress`, `labelMaxFontSizeMultiplier` | removed, no replacement                                               |
| `accessibilityLabel`, `accessibilityState`              | `aria-label`, `aria-checked` / `aria-selected` / `aria-busy` / `aria-expanded`                              |
| `style: Animated.WithAnimatedValue<StyleProp<ViewStyle>>` | `style: StyleProp<ViewStyle>`                                                                             |
| `elevation` and other `Surface` props                   | removed, no replacement                                                                                     |

```diff
- <FAB icon="pencil" size="small" mode="flat" variant="surface" color="#6750A4" onPress={edit} />
+ <FAB icon="pencil" variant="tonalPrimary" contentColor="#6750A4" onPress={edit} />
```

#### FAB.Extended <i>(replaces AnimatedFAB)</i>

| v5 `AnimatedFAB`                                         | v6 `FAB.Extended`                                                            |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `AnimatedFAB`, `AnimatedFABProps`                        | `FAB.Extended`, `FABExtendedProps`                                           |
| `extended`                                               | `expanded`                                                                   |
| `icon`, `label`                                          | unchanged (both required)                                                    |
| `color`                                                  | `contentColor` (new `containerColor` for the background)                     |
| `variant: 'primary' \| 'secondary' \| 'tertiary' \| 'surface'` | `variant: 'primary' \| 'secondary' \| 'tertiary' \| 'tonalPrimary' \| 'tonalSecondary' \| 'tonalTertiary'` (`'surface'` removed) |
| `iconMode`, `animateFrom` (+ `AnimatedFABIconMode`, `AnimatedFABAnimateFrom`) | removed, no replacement. The label always animates in layout direction |
| `uppercase`, `disabled`, `onLongPress`, `delayLongPress`, `hitSlop`, `rippleColor` | removed, no replacement                                  |
| `accessibilityLabel`, `accessibilityState`               | `aria-label`, `aria-checked` / `aria-selected` / `aria-busy` / `aria-expanded` |
| `style: Animated.WithAnimatedValue<StyleProp<ViewStyle>>` | `style: StyleProp<ViewStyle>`                                               |
| n/a                                                     | new `size: 'default' \| 'medium' \| 'large'`                                 |

```diff
- <AnimatedFAB icon="plus" label="Compose" extended={isAtTop} animateFrom="right" onPress={compose} />
+ <FAB.Extended icon="plus" label="Compose" expanded={isAtTop} onPress={compose} />
```

#### FAB.Menu <i>(replaces FAB.Group)</i>

`FAB.Menu` is declarative: the trigger button is described by a `trigger` object and the menu holds between **two and six** `items` (enforced by the type). Per-item styling props were dropped, items are rendered from the theme tokens.

| v5 `FAB.Group`                                                        | v6 `FAB.Menu`                                                                                          |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `FAB.Group`, `FABGroupProps`                                          | `FAB.Menu`, `FABMenuProps` (+ `FABMenuItemProps`, `FABMenuTriggerProps`)                              |
| `open`                                                                | `expanded`                                                                                             |
| `onStateChange({ open })`                                             | `onDismiss()` for closing; open it from `trigger.onPress`                                              |
| `icon`, `color`, `label`, `variant`, `visible`, `onPress`, `accessibilityLabel` on the group | `trigger: { icon, variant?, size?, containerColor?, contentColor?, visible?, onPress?, 'aria-label'?, testID? }` |
| `actions: Array<{ icon, label?, color?, labelTextColor?, style?, containerStyle?, wrapperStyle?, labelStyle?, size?, rippleColor?, accessibilityLabel?, accessibilityHint?, … }>` | `items: [{ icon?, label, onPress, 'aria-label'?, testID? }, …]` (2–6 entries; `label` required, styling props removed) |
| `backdropColor`, `fabStyle`, `style`                                  | removed, no replacement                                                                                |
| `toggleStackOnLongPress`, `enableLongPressWhenStackOpened`, `onLongPress`, `delayLongPress` | removed, no replacement                                                          |
| n/a                                                                  | new `alignment: 'start' \| 'center' \| 'end'` (default `'end'`), `closeIcon` (default `'close'`)       |

```tsx
// Before (v5)
const [state, setState] = React.useState({ open: false });

<FAB.Group
  open={state.open}
  icon={state.open ? 'close' : 'plus'}
  onStateChange={setState}
  actions={[
    { icon: 'email', label: 'Email', onPress: sendEmail },
    { icon: 'star', label: 'Star', onPress: star },
  ]}
/>;

// After (v6)
const [expanded, setExpanded] = React.useState(false);

<FAB.Menu
  expanded={expanded}
  onDismiss={() => setExpanded(false)}
  trigger={{ icon: 'plus', 'aria-label': 'Actions', onPress: () => setExpanded(true) }}
  items={[
    { icon: 'email', label: 'Email', onPress: sendEmail },
    { icon: 'star', label: 'Star', onPress: star },
  ]}
/>;
```

### HelperText

`HelperText` and `HelperTextProps` were removed. Supporting text is now rendered by `TextInput` itself through `supportingText`, a plain string. The `type`, `visible`, `padding` and `disabled` props of `HelperText` have no equivalent. The error style follows the input's `error` prop and conditional visibility is up to you (pass `undefined` to hide it).

```diff
- <TextInput label="Email" error={hasError} />
- <HelperText type="error" visible={hasError}>Enter a valid email</HelperText>
+ <TextInput label="Email" error={hasError} supportingText={hasError ? 'Enter a valid email' : undefined} />
```

### IconButton

No hard breaks. `rippleColor` and `accessibilityLabel` are no longer declared props but still pass through to `TouchableRipple` (see above). `mode` (`'outlined' | 'contained' | 'contained-tonal'`) is unchanged.

### MaterialCommunityIcon <i>(the `settings.icon` renderer)</i>

`IconProps.name` is typed `string` instead of the vector-icons name union. Custom icon renderers passed to `PaperProvider` `settings={{ icon }}` that relied on the narrower type need to widen their signature.

### Menu

`elevation` is typed `Elevation` (same `0`–`5` values).

#### Menu.Item

`rippleColor` was removed and the `accessibilityState` object was split into `aria-checked`, `aria-selected`, `aria-busy` and `aria-expanded`.

### Searchbar

`rippleColor` and `traileringRippleColor` were removed with no replacement. The `ref` is typed `React.Ref<TextInputHandles>`.

### SegmentedButtons

Inside the `buttons` array, `accessibilityLabel` → `'aria-label'`. See also [Planned for 6.0 stable](#planned-for-60-stable).

### Switch

`Switch` no longer wraps the `Switch` from React Native and no longer extends its props. Colors come from the theme.

| v5                                                                                  | v6                                                                   |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `color`                                                                             | removed. Override `theme.colors` (`primary`, `onPrimary`, `primaryContainer`, `surfaceContainerHighest`, `outline`, `onSurfaceVariant`) |
| `trackColor`, `thumbColor`, `ios_backgroundColor`, `onChange` and every other native `Switch` prop | removed, no replacement                                 |
| `onValueChange?: Function`                                                          | `onValueChange?: (value: boolean) => void`                           |
| `accessibilityLabel`                                                                | `aria-label`                                                         |
| `ref`                                                                               | removed from props                                                   |
| n/a                                                                                | new `checkedIcon`, `uncheckedIcon`                                   |

```diff
- <Switch value={on} onValueChange={setOn} color="#6750A4" />
+ <Switch value={on} onValueChange={setOn} theme={{ colors: { primary: '#6750A4' } }} />
```

### TextInput

The Paper 6.x `TextInput` is a complete rewrite with a new API. Import the component the same way, but note that the props and behavior have changed significantly.

```tsx
import { TextInput, type TextInputProps } from 'react-native-paper';
```

New exported types: `TextInputRenderProps`, `TextInputVariant`, `TextInputHandles`, `TextInputAccessoryProps`, `TextInputIconProps`. Removed: `TextInputAffixProps`, `TextInputLabelProp`.

#### Variant

| v5                | v6                   |
| ----------------- | -------------------- |
| `mode="flat"`     | `variant="filled"`   |
| `mode="outlined"` | `variant="outlined"` |

```diff
- <TextInput mode="flat" label="Filled" />
+ <TextInput variant="filled" label="Filled" />

- <TextInput mode="outlined" label="Outlined" />
+ <TextInput variant="outlined" label="Outlined" />
```

#### Adornments

| v5                                   | v6                                                                                                  |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `left` / `right` (elements)          | `startAccessory` / `endAccessory`, render props receiving `{ style, multiline, disabled, error }`    |
| `TextInput.Affix`                    | `prefix` / `suffix` (plain, non-pressable strings), or a custom `startAccessory` / `endAccessory`    |
| n/a                                 | new `counter` (with `maxLength`)                                                                     |

When `error` is set and no `endAccessory` is given, an error icon is rendered automatically.

```diff
  <TextInput
-   left={<TextInput.Icon icon="email" />}
-   right={<TextInput.Affix text={`${value.length}/80`} />}
+   startAccessory={(p) => <TextInput.Icon {...p} icon="email" />}
+   endAccessory={(p) => <CustomComponent {...p} />}
+   maxLength={100}
+   prefix="$"
+   suffix="/100"
+   counter
  />
```

#### Label and supporting text

| v5                                   | v6                  |
| ------------------------------------ | ------------------- |
| `label: React.ReactElement \| string` | `label: string`     |
| `HelperText` next to the input       | `supportingText`    |

```diff
- <TextInput label="Email" error={hasError} disabled={isDisabled} />
- <HelperText type="error" visible={hasError}>Enter a valid email</HelperText>
+ <TextInput label="Email" error={hasError} disabled={isDisabled} supportingText="Enter a valid email" />
```

#### Removed props

No direct `TextInput` equivalents for:

- **`dense`**, **`contentStyle`**, **`underlineStyle`**, **`outlineStyle`**
- **`underlineColor`**, **`activeUnderlineColor`**, **`outlineColor`**, **`activeOutlineColor`**, **`textColor`**

Use **`style`** on the inner input and the **`theme`** for colors. `selectionColor`, `cursorColor` and `placeholderTextColor` are still accepted as native passthrough props. Only their defaults changed, they now follow the theme (`primary`, or `error` when `error` is set).

```diff
+ import { LightTheme, TextInput } from 'react-native-paper';
+
+ const theme = {
+   ...LightTheme,
+   colors: { ...LightTheme.colors, outline: '#79747E', primary: '#6750A4' },
+ };

  <TextInput
-   dense
-   contentStyle={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 8 }}
-   outlineStyle={{ borderRadius: 12, borderWidth: 2 }}
-   outlineColor="#79747E"
-   activeOutlineColor="#6750A4"
-   textColor="#1C1B1F"
-   style={{ fontSize: 16 }}
+   theme={theme}
+   style={{ fontSize: 16, color: '#1C1B1F' }}
  />
```

#### Other behavioural changes

- **`render`** now receives `TextInputRenderProps` (the native `TextInput` props plus `ref?: React.RefObject<NativeTextInput | null>`). The v5 `RenderProps` type is gone and `ref` is an object, not a callback. Custom input integrations (masked inputs etc.) need to adapt.
- **`disabled`** is separate from `editable`. Paper sets `editable` itself, so pass `disabled` instead of `editable={false}`.
- **`multiline`** and **`numberOfLines`** are passed straight to the native input. Paper no longer adjusts its own height logic around them.
- **`onChangeText`** is typed `(text: string) => void` (was `Function`).
- Ref handles `focus`, `blur`, `clear`, `isFocused`, `setNativeProps` and `setSelection` are kept. The undocumented `forceFocus` handle was removed, `focus()` does nothing while `disabled`, and `clear()` now also fires `onChangeText('')`.

#### TextInput.Icon

`TextInput.Icon` has to be rendered through the accessory render prop. Its `style`, `multiline`, `disabled` and `error` props are now **required** and are supplied by the input (`{...p}` below).

| v5                                          | v6                                  |
| ------------------------------------------- | ----------------------------------- |
| `forceTextInputFocus`                       | removed, no replacement             |
| `color` (string or `(focused) => string`)   | `iconColor` (`ColorValue` only)     |
| n/a                                        | `style`, `multiline`, `disabled`, `error` are required |

```diff
- <TextInput right={<TextInput.Icon icon="close" color={(focused) => (focused ? 'red' : 'gray')} />} />
+ <TextInput endAccessory={(p) => <TextInput.Icon {...p} icon="close" iconColor="red" />} />
```

#### TextInput.Affix

Removed together with `TextInputAffixProps`. Its `text`, `onPress`, `textStyle`, `onLayout` and `accessibilityLabel` props have no equivalent. `prefix` / `suffix` are non-pressable strings. If you need more than that, render your own `endAccessory`.

```diff
- <TextInput right={<TextInput.Affix text="/100" />} />
+ <TextInput suffix="/100" />
```

### ToggleButton

Only `rippleColor` was removed. See also [Planned for 6.0 stable](#planned-for-60-stable).

## Planned for 6.0 stable

:::warning
The changes below are **not** part of `6.0.0-alpha.0`. They are listed so you can plan ahead. The replacement API will be documented here once each change lands. Follow the linked pull requests for status.
:::

- **`BottomNavigation` → `NavigationBar`** ([#5006](https://github.com/callstack/react-native-paper/pull/5006)). The scene-transition wrapper (`BottomNavigation`) and `BottomNavigation.SceneMap` are removed. `BottomNavigation.Bar` becomes a top-level `NavigationBar` meant to be driven by React Navigation or your own navigator, and the MD2 `shifting` mode goes away. The [BottomNavigation with React Navigation guide](./bottom-navigation) already shows what this migration looks like.
- **`SegmentedButtons` → `ConnectedButtonGroup`** ([#5028](https://github.com/callstack/react-native-paper/pull/5028)). Material 3 replaced segmented buttons with the connected button group. The new component keeps the `buttons` / `value` / `onValueChange` shape to make the migration easier.
- **`ToggleButton`, `ToggleButton.Group`, `ToggleButton.Row`** and the `Button` **`contained` / `contained-tonal`** modes are planned for removal as part of the Button and IconButton modernization. There is no pull request yet. Until there is, they keep working as documented in v5.
