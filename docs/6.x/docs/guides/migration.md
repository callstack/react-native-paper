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
- `aria-label="pagination-container"` and `aria-label="Options Select"` were removed; query `testID="options-select"` instead

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
