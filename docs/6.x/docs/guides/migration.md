---
title: Migration from Paper 5.x to 6.x
---

TBC

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
