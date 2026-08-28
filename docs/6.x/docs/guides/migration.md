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

### Card

#### `Card.Actions`

`Card.Actions` no longer assigns `mode` to its buttons, previously `outlined` for the first one and `contained` for the rest, and no longer injects `compact`. Set both on the buttons.

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

#### `Card.Content`

`Card.Content` uses the same vertical padding everywhere. Before it changed depending on the sections next to it.

### Dialog

#### `Dialog.Actions`

`Dialog.Actions` no longer injects `compact` and `uppercase` into the action buttons. Set them yourself if you want the old look.

```tsx
// Before (v5)
<Dialog.Actions>
  <Button onPress={hide}>Done</Button>
</Dialog.Actions>

// After (v6)
<Dialog.Actions>
  <Button compact uppercase onPress={hide}>
    Done
  </Button>
</Dialog.Actions>
```

### List

#### `List.Accordion`

When `List.Accordion` has a `left` element, it used to indent every child that rendered no `left` or `right` of its own, whatever the child was. The indent now comes from context and only `List.Item` reads it, so a custom child keeps its own padding. Indent it yourself if you need the old alignment.

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

### ToggleButton

#### `ToggleButton.Row`

`ToggleButton.Row` no longer clones its children to give them a position in the row. The segmented look comes from context, so a `ToggleButton` wrapped in a component of your own now picks it up, while a child that is not a `ToggleButton` gets no treatment at all.

The dividers moved to the row with it. Buttons used to draw their own borders, the row now paints an `outline` background and the hairline gaps between buttons show through. A border set on a single `ToggleButton` no longer builds the segmented outline.

The row also sits on `alignSelf: 'flex-start'`, so it wraps its buttons instead of stretching to the parent. Set it back if you relied on the full width.

```tsx
// Before (v5)
<ToggleButton.Row value={value} onValueChange={setValue}>
  <ToggleButton icon="format-align-left" value="left" />
  <ToggleButton icon="format-align-right" value="right" />
</ToggleButton.Row>

// After (v6)
<ToggleButton.Row
  value={value}
  onValueChange={setValue}
  style={{ alignSelf: 'stretch' }}
>
  <ToggleButton icon="format-align-left" value="left" />
  <ToggleButton icon="format-align-right" value="right" />
</ToggleButton.Row>
```
