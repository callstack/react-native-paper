import * as React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Theme } from '../../types';
import { withTheme } from '../../core/theming';
import { RadioButtonContext, RadioButtonContextType } from './RadioButtonGroup';
import { handlePress } from './utils';
import TouchableRipple from '../TouchableRipple';
import RadioButton from './RadioButton';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Value of the radio button.
   */
  value: string;
  /**
   * Label to be displayed on the item.
   */
  label: string;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Status of radio button.
   */
  status?: 'checked' | 'unchecked';
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
 * RadioButton.Item allows you to press the whole row (item) instead of only the RadioButton.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton, Text } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     value: 'first',
 *   };
 *
 *   render() {
 *     return(
 *       <RadioButton.Group
 *         onValueChange={value => this.setState({ value })}
 *         value={this.state.value}
 *       >
 *           <RadioButton.Item label="First item" value="first" />
 *           <RadioButton.Item label="Second item" value="second" />
 *       </RadioButton.Group>
 *     )
 *   }
 * }
 *```
 */
class RadioButtonItem extends React.Component<Props> {
  static displayName = 'RadioButton.Item';

  render() {
    const {
      value,
      label,
      style,
      labelStyle,
      onPress,
      status,
      theme: { colors },
    } = this.props;

    return (
      <RadioButtonContext.Consumer>
        {(context?: RadioButtonContextType) => {
          return (
            <TouchableRipple
              onPress={() =>
                handlePress({
                  onPress: onPress,
                  onValueChange: context?.onValueChange,
                  value,
                })
              }
            >
              <View style={[styles.container, style]} pointerEvents="none">
                <Text
                  style={[styles.label, labelStyle, { color: colors.primary }]}
                >
                  {label}
                </Text>
                <RadioButton value={value} status={status}></RadioButton>
              </View>
            </TouchableRipple>
          );
        }}
      </RadioButtonContext.Consumer>
    );
  }
}

export default withTheme(RadioButtonItem);

// @component-docs ignore-next-line
export { RadioButtonItem };

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
