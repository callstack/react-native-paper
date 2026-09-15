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

## Components

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

#### Screen reader announcements

- new `rowCount`, `firstRowIndex` needed for correct row positions when paginating
- `nativeFocusMode="cell"` gives one stop per cell instead of one per row
- `accessible={false}` on a row opts that row out
- `formatRowPosition` replaces the wording, or removes it with `null`
- rows are numbered by their position among the table's rows, wherever they sit: a fragment, a `View` or any wrapper the table can see rows inside is looked through, and anything beside them - an empty state, a caption - is not counted. A component of your own counts as the one row it renders; pass `index` on a row the table never renders itself, as a virtualized list does

```tsx
// Before (v5)
<DataTable>
  {items.slice(from, to).map((item) => (
    <DataTable.Row key={item.key}>{/* ... */}</DataTable.Row>
  ))}
</DataTable>

// After (v6)
<DataTable aria-label="Nutrition" rowCount={items.length} firstRowIndex={from}>
  {items.slice(from, to).map((item) => (
    <DataTable.Row key={item.key}>{/* ... */}</DataTable.Row>
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
- `column` on a title or cell selects one by key, and is only needed where position is unreliable

```tsx
// Before (v5)
const styles = StyleSheet.create({ first: { flex: 2 } });

<DataTable.Title style={styles.first}>Dessert</DataTable.Title>
<DataTable.Cell style={styles.first}>{item.name}</DataTable.Cell>

// After (v6)
const columns = [{ key: 'name', flex: 2 }, { key: 'calories', numeric: true }];

<DataTable columns={columns}>
  <DataTable.Title>Dessert</DataTable.Title>
  <DataTable.Cell>{item.name}</DataTable.Cell>
</DataTable>
```
