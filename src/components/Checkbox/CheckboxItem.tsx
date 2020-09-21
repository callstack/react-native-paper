import * as React from 'react';

import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import CheckBox from './Checkbox';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { withTheme } from '../../core/theming';

type Props = {
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate';
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean;
  /**
   * Label to be displayed on the item.
   */
  label: string;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Custom color for unchecked checkbox.
   */
  uncheckedColor?: string;
  /**
   * Custom color for checkbox.
   */
  color?: string;
  /**
   * Additional styles for container View.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style that is passed to Label element.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * Checkbox.Item allows you to press the whole row (item) instead of only the Checkbox.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Checkbox } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <View>
 *     <Checkbox.Item label="Item" status="checked" />
 *   </View>
 * );
 *
 * export default MyComponent;
 *```
 */

const CheckboxItem = ({
  style,
  status,
  label,
  onPress,
  labelStyle,
  theme: { colors },
  testID,
  ...props
}: Props) => (
  <TouchableRipple onPress={onPress} testID={testID}>
    <View style={[styles.container, style]} pointerEvents="none">
      <Text style={[styles.label, { color: colors.primary }, labelStyle]}>
        {label}
      </Text>
      <CheckBox status={status} {...props}></CheckBox>
    </View>
  </TouchableRipple>
);

CheckboxItem.displayName = 'Checkbox.Item';

export default withTheme(CheckboxItem);

// @component-docs ignore-next-line
export { CheckboxItem };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
  },
});
