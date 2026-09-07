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

  return <Card content="Animated Card" style={animatedStyle} />;
};
```

### Elevation

The `elevation` prop no longer accepts a React Native `Animated.Value` in the following components:

- `Banner`
- `Card` (`variant="elevated"` only)
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

### Card

Paper 6 replaces the Card's `mode` and arbitrary-children interfaces with Material 3 variants and explicit slots. These interfaces were removed; they are not deprecated APIs. Migrate each Card directly to the new contract.

#### Variants and default

Replace `mode` with `variant`:

| Paper 5 | Paper 6 |
| --- | --- |
| `mode="contained"` | `variant="filled"` |
| `mode="elevated"` | `variant="elevated"` |
| `mode="outlined"` | `variant="outlined"` |

The default also changed. A Paper 5 Card without `mode` was elevated; a Paper 6 Card without `variant` is filled and has no resting shadow. Add `variant="elevated"` if you need to preserve the old default emphasis. The `elevation` prop is accepted only with `variant="elevated"`.

#### Replace nested composition with slots

Arbitrary Card children were removed. Paper 6 renders the explicit regions in the deterministic order `media`, header, `content`, and `actions`, regardless of the order in which props are written. Arrays, fragments, conditional values, and custom wrappers can be passed inside a slot without changing region placement.

For the common header form, move `Card.Title` values to `title`, `subtitle`, `leading`, and `trailing`. Move the remaining regions to their corresponding slots:

```tsx
// Before (v5)
<Card mode="contained" onPress={openDetails}>
  <Card.Cover source={{ uri: coverUri }} />
  <Card.Title title="Weekend trip" subtitle="2 days" />
  <Card.Content>
    <Text variant="bodyMedium">View the itinerary.</Text>
  </Card.Content>
</Card>

// After (v6)
<Card
  accessibilityLabel="Open weekend trip details"
  onPress={openDetails}
  media={<Card.Cover source={{ uri: coverUri }} />}
  title="Weekend trip"
  subtitle="2 days"
  content={
    <Card.Content>
      <Text variant="bodyMedium">View the itinerary.</Text>
    </Card.Content>
  }
/>
```

Use `header` when the complete header is custom. It is mutually exclusive with `title`, `subtitle`, `leading`, and `trailing`:

```tsx
<Card
  variant="outlined"
  header={<TripHeader trip={trip} />}
  content={<Card.Content>{trip.summary}</Card.Content>}
/>
```

`Card.Content`, `Card.Cover`, `Card.Title`, and `Card.Actions` remain available as layout helpers inside the new slots. They are not arbitrary Card children.

#### Choose one interaction model

Give the Card an interaction handler when the whole Card represents one action. It becomes one accessibility target with button semantics by default, so do not place independent controls in its `actions` slot.

When buttons or other controls perform independent actions, keep the Card itself neutral and put those controls in `actions`:

```tsx
<Card
  variant="elevated"
  title="Draft itinerary"
  content={<Card.Content>Review before saving.</Card.Content>}
  actions={
    <Card.Actions>
      <Button onPress={discard}>Discard</Button>
      <Button mode="contained" onPress={save}>Save</Button>
    </Card.Actions>
  }
/>
```

Paper 6 warns in development if whole-Card interaction handlers and a populated `actions` slot are combined. A neutral Card remains a grouping container unless you provide accessibility semantics explicitly. The `dragged` prop controls the Material dragged presentation only; drag gestures and lifecycle remain application responsibilities.

Card refs and test IDs now target documented nodes: `ref` targets the outer shell, `touchableRef` targets the actionable interaction node, and `testID` targets the interaction node for actionable Cards or the slot-content node for neutral Cards. `${testID}-container` and `${testID}-visual` identify the outer shell and clipped visual region.

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
