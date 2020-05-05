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
import { Theme } from '../../types';
import TouchableRipple from '../TouchableRipple';
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
  theme: Theme;
};

/**
 * Checkbox.Item allows you to press the whole row (item) instead of only the Checkbox.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Checkbox, Text } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *
 *   render() {
 *     return(
 *       <View>
 *           <Checkbox.Item label="Item" status="checked" />
 *       </View>
 *     )
 *   }
 * }
 *```
 */

class CheckboxItem extends React.Component<Props> {
  static displayName = 'Checkbox.Item';

  render() {
    const {
      style,
      status,
      label,
      onPress,
      labelStyle,
      theme: { colors },
      ...props
    } = this.props;

    return (
      <TouchableRipple onPress={onPress}>
        <View style={[styles.container, style]} pointerEvents="none">
          <Text style={[styles.label, labelStyle, { color: colors.primary }]}>
            {label}
          </Text>
          <CheckBox status={status} {...props}></CheckBox>
        </View>
      </TouchableRipple>
    );
  }
}

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
