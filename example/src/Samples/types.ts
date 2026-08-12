/**
 * Every component exported by `react-native-paper`, so a sample can only be
 * tagged with a name that actually exists.
 */
export type PaperComponentName =
  | 'ActivityIndicator'
  | 'Appbar'
  | 'Avatar'
  | 'Badge'
  | 'Banner'
  | 'BottomNavigation'
  | 'Button'
  | 'Card'
  | 'Checkbox'
  | 'Chip'
  | 'DataTable'
  | 'Dialog'
  | 'Divider'
  | 'Drawer'
  | 'FAB'
  | 'Icon'
  | 'IconButton'
  | 'List'
  | 'Menu'
  | 'Modal'
  | 'Portal'
  | 'ProgressBar'
  | 'RadioButton'
  | 'Searchbar'
  | 'SegmentedButtons'
  | 'Snackbar'
  | 'Surface'
  | 'Switch'
  | 'Text'
  | 'TextInput'
  | 'ToggleButton'
  | 'Tooltip'
  | 'TouchableRipple';

export type SampleConfig = {
  title: string;
  icon: string;
  /**
   * Components the sample is built from, in alphabetical order.
   */
  components: PaperComponentName[];
};
