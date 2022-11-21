import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { withInternalTheme } from '../../core/theming';
import type { InternalTheme, MD3TypescaleKey } from '../../types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';
import RadioButton from './RadioButton';
import RadioButtonAndroid from './RadioButtonAndroid';
import { RadioButtonContext, RadioButtonContextType } from './RadioButtonGroup';
import RadioButtonIOS from './RadioButtonIOS';
import { handlePress, isChecked } from './utils';

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
  onPress?: (e: GestureResponderEvent) => void;
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
   * @supported Available in v5.x with theme version 3
   *
   * Label text variant defines appropriate text styles for type role and its size.
   * Available variants:
   *
   *  Display: `displayLarge`, `displayMedium`, `displaySmall`
   *
   *  Headline: `headlineLarge`, `headlineMedium`, `headlineSmall`
   *
   *  Title: `titleLarge`, `titleMedium`, `titleSmall`
   *
   *  Label:  `labelLarge`, `labelMedium`, `labelSmall`
   *
   *  Body: `bodyLarge`, `bodyMedium`, `bodySmall`
   */
  labelVariant?: keyof typeof MD3TypescaleKey;
  /**
   * @optional
   */
  theme: InternalTheme;
  /**
   * testID to be used on tests.
   */
  testID?: string;
  /**
   * Whether `<RadioButton.Android />` or `<RadioButton.IOS />` should be used.
   * Left undefined `<RadioButton />` will be used.
   */
  mode?: 'android' | 'ios';
  /**
   * Radio button control position.
   */
  position?: 'leading' | 'trailing';
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
  theme,
  accessibilityLabel = label,
  testID,
  mode,
  position = 'trailing',
  labelVariant = 'bodyLarge',
}: Props) => {
  const radioButtonProps = { value, disabled, status, color, uncheckedColor };
  const isLeading = position === 'leading';
  let radioButton: any;

  if (mode === 'android') {
    radioButton = <RadioButtonAndroid {...radioButtonProps} />;
  } else if (mode === 'ios') {
    radioButton = <RadioButtonIOS {...radioButtonProps} />;
  } else {
    radioButton = <RadioButton {...radioButtonProps} />;
  }

  const textColor = theme.isV3 ? theme.colors.onSurface : theme.colors.text;
  const disabledTextColor = theme.isV3
    ? theme.colors.onSurfaceDisabled
    : theme.colors.disabled;
  const textAlign = isLeading ? 'right' : 'left';

  const computedStyle = {
    color: disabled ? disabledTextColor : textColor,
    textAlign,
  } as TextStyle;

  return (
    <RadioButtonContext.Consumer>
      {(context?: RadioButtonContextType) => {
        const checked =
          isChecked({
            contextValue: context?.value,
            status,
            value,
          }) === 'checked';
        return (
          <TouchableRipple
            onPress={(event) =>
              handlePress({
                onPress: onPress,
                onValueChange: context?.onValueChange,
                value,
                event,
              })
            }
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="radio"
            accessibilityState={{
              checked,
              disabled,
            }}
            testID={testID}
            disabled={disabled}
          >
            <View style={[styles.container, style]} pointerEvents="none">
              {isLeading && radioButton}
              <Text
                variant={labelVariant}
                style={[
                  styles.label,
                  !theme.isV3 && styles.font,
                  computedStyle,
                  labelStyle,
                ]}
              >
                {label}
              </Text>
              {!isLeading && radioButton}
            </View>
          </TouchableRipple>
        );
      }}
    </RadioButtonContext.Consumer>
  );
};

RadioButtonItem.displayName = 'RadioButton.Item';

export default withInternalTheme(RadioButtonItem);

// @component-docs ignore-next-line
const RadioButtonItemWithTheme = withInternalTheme(RadioButtonItem);
// @component-docs ignore-next-line
export { RadioButtonItemWithTheme as RadioButtonItem };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    flexShrink: 1,
    flexGrow: 1,
  },
  font: {
    fontSize: 16,
  },
});
