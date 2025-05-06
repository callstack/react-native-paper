import * as React from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import RadioButton from './RadioButton';
import RadioButtonAndroid from './RadioButtonAndroid';
import { RadioButtonContext, RadioButtonContextType } from './RadioButtonGroup';
import RadioButtonIOS from './RadioButtonIOS';
import { handlePress, isChecked } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp, MD3TypescaleKey } from '../../types';
import TouchableRipple, {
  Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
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
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
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
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
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
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * @optional
   */
  theme?: ThemeProp;
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
  /**
   * Sets additional distance outside of element in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
};

/**
 * RadioButton.Item allows you to press the whole row (item) instead of only the RadioButton.
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
  onLongPress,
  disabled,
  color,
  uncheckedColor,
  rippleColor,
  status,
  theme: themeOverrides,
  background,
  accessibilityLabel = label,
  testID,
  mode,
  position = 'trailing',
  labelVariant = 'bodyLarge',
  labelMaxFontSizeMultiplier,
  hitSlop,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const radioButtonProps = {
    value,
    disabled,
    status,
    color,
    theme,
    uncheckedColor,
  };
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
            onLongPress={onLongPress}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="radio"
            accessibilityState={{
              checked,
              disabled,
            }}
            testID={testID}
            disabled={disabled}
            background={background}
            theme={theme}
            rippleColor={rippleColor}
            hitSlop={hitSlop}
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
                maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
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

export default RadioButtonItem;

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
    flexShrink: 1,
    flexGrow: 1,
  },
  font: {
    fontSize: 16,
  },
});
