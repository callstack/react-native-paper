import * as React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { withTheme } from '../../core/theming';
import { RadioButtonContext, RadioButtonContextType } from './RadioButtonGroup';
import { handlePress } from './utils';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
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
   * Whether radio is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Accessibility label for the touchable. This is read by the screen reader when the user taps the touchable.
   */
  accessibilityLabel?: string;
  /**
   * Custom color for unchecked radio.
   */
  uncheckedColor?: string;
  /**
   * Custom color for radio.
   */
  color?: string;
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
  theme: ReactNativePaper.Theme;
};

/**
 * RadioButton.Item allows you to press the whole row (item) instead of only the RadioButton.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/radio-item.ios.png" />
 *     <figcaption>Pressed</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { RadioButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('first');
 *
 *   return (
 *     <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
 *       <RadioButton.Item label="First item" value="first" />
 *       <RadioButton.Item label="Second item" value="second" />
 *     </RadioButton.Group>
 *   );
 * };
 *
 * export default MyComponent;
 *```
 */
const RadioButtonItem = ({
  value,
  label,
  style,
  labelStyle,
  onPress,
  disabled,
  color,
  uncheckedColor,
  status,
  theme: { colors },
  accessibilityLabel,
}: Props) => (
  <RadioButtonContext.Consumer>
    {(context?: RadioButtonContextType) => {
      return (
        <TouchableRipple
          onPress={
            disabled
              ? undefined
              : () =>
                  handlePress({
                    onPress: onPress,
                    onValueChange: context?.onValueChange,
                    value,
                  })
          }
          accessibilityLabel={accessibilityLabel}
        >
          <View style={[styles.container, style]} pointerEvents="none">
            <Text style={[styles.label, { color: colors.text }, labelStyle]}>
              {label}
            </Text>
            <RadioButton
              value={value}
              disabled={disabled}
              status={status}
              color={color}
              uncheckedColor={uncheckedColor}
            />
          </View>
        </TouchableRipple>
      );
    }}
  </RadioButtonContext.Consumer>
);

RadioButtonItem.displayName = 'RadioButton.Item';

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
