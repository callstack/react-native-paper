import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import type { AutocompleteItem, AutocompleteProps } from './types';
import { useInternalTheme } from '../../core/theming';
import TextInput from '../TextInput/TextInput';

const defaultFilter = <T extends AutocompleteItem>(
  item: T,
  query: string
): boolean => {
  if (!query) return true;
  return item.label.toLowerCase().includes(query.toLowerCase());
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  } as ViewStyle,
  list: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    zIndex: 1,
    elevation: 4,
    maxHeight: 240,
    overflow: 'hidden',
  } as ViewStyle,
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  itemLabel: {
    fontSize: 16,
  } as ViewStyle,
  empty: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  emptyLabel: {
    fontSize: 14,
  } as ViewStyle,
});

/**
 * Autocomplete text input.
 *
 * A text input with a dropdown of matching items that filters as the user
 * types. Selecting an item calls `onSelect` with the chosen item.
 *
 * @param props
 */
function Autocomplete<T extends AutocompleteItem = AutocompleteItem>({
  data,
  value,
  onChangeText,
  onSelect,
  filter = defaultFilter,
  label,
  placeholder,
  maxResults = 8,
  showResults,
  listStyle,
  style,
  theme: themeOverrides,
  testID = 'autocomplete',
  error,
  disabled = false,
}: AutocompleteProps<T>) {
  const theme = useInternalTheme(themeOverrides);
  const [focused, setFocused] = React.useState(false);

  const results = React.useMemo(() => {
    const filtered = data.filter((item) => filter(item, value));
    return filtered.slice(0, maxResults);
  }, [data, filter, value, maxResults]);

  const shouldShow = showResults ?? (focused && value.length > 0 && !disabled);

  const handleSelect = (item: T) => {
    onChangeText(item.label);
    onSelect(item);
  };

  const roundness = theme.isV3 ? theme.roundness : 4;
  const surfaceColor = theme.isV3 ? theme.colors.surface : '#fff';
  const textColor = theme.isV3 ? theme.colors.onSurface : '#000';
  const borderColor = theme.isV3
    ? error
      ? theme.colors.error
      : theme.colors.outline
    : error
    ? '#B00020'
    : '#ccc';

  return (
    <View testID={testID} style={[styles.container, style]}>
      <TextInput
        testID={`${testID}-input`}
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        error={!!error}
        disabled={disabled}
        theme={themeOverrides}
        right={error ? <TextInput.Affix text={error} /> : undefined}
      />
      {shouldShow && (
        <View
          testID={`${testID}-list`}
          style={[
            styles.list,
            {
              backgroundColor: surfaceColor,
              borderRadius: roundness,
              borderWidth: 1,
              borderColor: borderColor,
            } as ViewStyle,
            listStyle,
          ]}
          accessibilityRole="list"
        >
          {results.length === 0 ? (
            <View style={styles.empty} testID={`${testID}-empty`}>
              <Text style={[styles.emptyLabel, { color: textColor }]}>
                No results
              </Text>
            </View>
          ) : (
            <ScrollView testID={`${testID}-scroll`} nestedScrollEnabled>
              {results.map((item, index) => (
                <Pressable
                  key={item.key}
                  testID={`${testID}-item-${index}`}
                  onPress={() => handleSelect(item)}
                  style={styles.item}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Text style={[styles.itemLabel, { color: textColor }]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

export default Autocomplete;
export type { AutocompleteItem, AutocompleteProps };
