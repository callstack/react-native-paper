import * as React from 'react';
import {
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import Checkbox from './Checkbox';
import { useInternalTheme } from '../../core/theming';
import { getStateLayer } from '../../theme/utils/state';
import type { ThemeProp, TypescaleKey } from '../../types';
import TouchableRipple, {
  Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

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
   * Label to be displayed on the item.
   */
  label: string;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Accessibility label for the touchable. This is read by the screen reader when the user taps the touchable.
   */
  accessibilityLabel?: string;
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
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
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
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
  /**
   * Checkbox control position.
   */
  position?: 'leading' | 'trailing';
  /**
   * Sets additional distance outside of element in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
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
  onLongPress,
  labelStyle,
  theme: themeOverrides,
  testID,
  position = 'trailing',
  accessibilityLabel = label,
  disabled,
  labelVariant = 'bodyLarge',
  labelMaxFontSizeMultiplier = 1.5,
  background,
  hitSlop,
  ...props
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const checkboxProps = { ...props, status, theme, disabled };
  const isLeading = position === 'leading';
  // The outer TouchableRipple below is the interactable element + a11y
  // checkbox; the inner Checkbox is purely visual, so we exclude it from
  // the accessibility tree to avoid duplicate `checked` states.
  const checkbox = <Checkbox {...checkboxProps} accessible={false} />;

  const textAlign = isLeading ? 'right' : 'left';

  const computedStyle = {
    ...getStateLayer(theme, 'onSurface', disabled ? 'disabled' : 'enabled'),
    textAlign,
  } as TextStyle;

  return (
    <TouchableRipple
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: status === 'indeterminate' ? 'mixed' : status === 'checked',
        disabled,
      }}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
      disabled={disabled}
      theme={theme}
      background={background}
      hitSlop={hitSlop}
    >
      <View
        style={[styles.container, style]}
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
      >
        {isLeading && checkbox}
        <Text
          variant={labelVariant}
          testID={`${testID}-text`}
          maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
          style={[styles.label, computedStyle, labelStyle]}
        >
          {label}
        </Text>
        {!isLeading && checkbox}
      </View>
    </TouchableRipple>
  );
};

CheckboxItem.displayName = 'Checkbox.Item';

export default CheckboxItem;

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
    flexShrink: 1,
    flexGrow: 1,
  },
});
