import * as React from 'react';
import { GestureResponderEvent, Platform } from 'react-native';

import CheckboxAndroid from './CheckboxAndroid';
import CheckboxIOS from './CheckboxIOS';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';

export type Props = {
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate';
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Custom color for unchecked checkbox.
   */
  uncheckedColor?: string;
  /**
   * Custom color for checkbox.
   */
  color?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * Checkboxes allow the selection of multiple options from a set.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Checkbox } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [checked, setChecked] = React.useState(false);
 *
 *   return (
 *     <Checkbox
 *       status={checked ? 'checked' : 'unchecked'}
 *       onPress={() => {
 *         setChecked(!checked);
 *       }}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Checkbox = ({ theme: themeOverrides, ...props }: Props) => {
  const theme = useInternalTheme(themeOverrides);
  return Platform.OS === 'ios' ? (
    <CheckboxIOS {...props} theme={theme} />
  ) : (
    <CheckboxAndroid {...props} theme={theme} />
  );
};

export default Checkbox;

// @component-docs ignore-next-line
const CheckboxWithTheme = Checkbox;
// @component-docs ignore-next-line
export { CheckboxWithTheme as Checkbox };
