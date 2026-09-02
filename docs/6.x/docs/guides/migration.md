---
title: Migration from Paper 5.x to 6.x
---

TBC

## Components

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

New `size` and `shape` props. `size` defaults to `small`, which matches the
only size 5.x had, so existing buttons keep their metrics.

```tsx
<Button size="extra-small">XS</Button>
<Button size="large" shape="square">Large, square</Button>
```

The container now also morphs its corner while pressed. Pass
`animateShape={false}` to opt out.

#### Toggle

`selected` turns a button into a toggle. Leave it **undefined** to make it
a plain button

```tsx
<Button mode="filled" selected={isOn} onPress={toggle}>
  Bold
</Button>
```

#### Removed props

- **`uppercase`** → `labelStyle={{ textTransform: 'uppercase' }}`.
- **`compact`** → `size="extra-small"`.
- **`contentStyle={{ flexDirection: 'row-reverse' }}`** → `iconPosition="trailing"`.

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

#### Appearance changes

These need no code change, but the rendering differs:

- The `outlined` label and icon use **`onSurfaceVariant`** instead of
  `primary`.
- The default icon size is **20dp**, up from **18dp**.
- `labelStyle={{ fontSize }}` no longer changes the icon size. The icon follows
  `size`; set both if you need them to match.
- The resting corner is the full pill radius instead of a fixed **20dp**.

#### Card.Actions

`Card.Actions` defaults its buttons to `outlined` for the first child and
**`filled`** for the rest, where it used to default to `contained`. It also no
longer forwards `compact` or `uppercase` to them.
