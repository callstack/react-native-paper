import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import RadioButton from './RadioButton';
import { RadioButtonContext } from './RadioButtonGroup';
import { handlePress, isChecked } from './utils';
import { useInternalTheme } from '../../core/theming';
import { getStateLayer } from '../../theme/utils/state';
import type { ThemeProp, TypescaleKey } from '../../types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
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
  'aria-label'?: string;
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
   * Whether the radio button is in an error state. When true, the control
   * uses `theme.colors.error`.
   */
  error?: boolean;
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
  labelVariant?: TypescaleKey;
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
  status,
  error,
  theme: themeOverrides,
  background,
  'aria-label': ariaLabel = label,
  testID,
  position = 'trailing',
  labelVariant = 'bodyLarge',
  labelMaxFontSizeMultiplier = 1.5,
  hitSlop,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const context = React.useContext(RadioButtonContext);
  const radioButtonProps = {
    value,
    disabled,
    status,
    color,
    theme,
    uncheckedColor,
    error,
  };
  const isLeading = position === 'leading';
  // The outer TouchableRipple is the interactable element + a11y radio; the
  // inner control is purely visual, so exclude it from the a11y tree to
  // avoid duplicate `checked` states.
  const radioButton = <RadioButton {...radioButtonProps} accessible={false} />;

  const textAlign = isLeading ? 'right' : 'left';

  const computedStyle = {
    ...getStateLayer(theme, 'onSurface', disabled ? 'disabled' : 'enabled'),
    textAlign,
  } as TextStyle;

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
      hitSlop={hitSlop}
    >
      <View
        style={[styles.container, style]}
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
      >
        {isLeading && radioButton}
        <Text
          variant={labelVariant}
          testID={`${testID}-text`}
          style={[styles.label, computedStyle, labelStyle]}
          maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        >
          {label}
        </Text>
        {!isLeading && radioButton}
      </View>
    </TouchableRipple>
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
});
