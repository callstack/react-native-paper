import type { StyleProp, ViewStyle } from 'react-native';

import type { ThemeProp } from '../../types';

export type AutocompleteItem = {
  /** Stable key for the item. */
  key: string;
  /** Label shown in the dropdown and used for default filtering. */
  label: string;
  [key: string]: unknown;
};

export type AutocompleteProps<T extends AutocompleteItem = AutocompleteItem> = {
  /** The full list of items to filter from. */
  data: T[];
  /** Current input value. */
  value: string;
  /** Called when the input text changes. */
  onChangeText: (text: string) => void;
  /** Called when the user selects an item from the dropdown. */
  onSelect: (item: T) => void;
  /**
   * Custom filter predicate. Defaults to a case-insensitive substring match on
   * the item's `label`.
   */
  filter?: (item: T, query: string) => boolean;
  /** TextInput label. */
  label?: string;
  /** TextInput placeholder. */
  placeholder?: string;
  /** Maximum number of results to show. Defaults to 8. */
  maxResults?: number;
  /** Whether to show the dropdown list. Defaults to true when value is non-empty. */
  showResults?: boolean;
  /** Style applied to the dropdown list container. */
  listStyle?: StyleProp<ViewStyle>;
  /** Style applied to the outer container. */
  style?: StyleProp<ViewStyle>;
  /** @optional */
  theme?: ThemeProp;
  /** TestID for testing. */
  testID?: string;
  /** Error text to display below the input. */
  error?: string;
  /** Whether the input is disabled. */
  disabled?: boolean;
};
