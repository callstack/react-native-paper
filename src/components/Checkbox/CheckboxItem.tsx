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
import Checkbox from './Checkbox';
import CheckboxAndroid from './CheckboxAndroid';
import CheckboxIOS from './CheckboxIOS';

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
   * Checkbox control position.
   */
  position?: 'leading' | 'trailing';
  /**
   * Whether `<Checkbox.Android />` or `<Checkbox.IOS />` should be used.
   * Left undefined `<Checkbox />` will be used.
   */
  mode?: 'android' | 'ios';
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
  theme,
  testID,
  mode,
  position = 'trailing',
  accessibilityLabel = label,
  disabled,
  labelVariant = 'bodyLarge',
  ...props
}: Props) => {
  const checkboxProps = { ...props, status, theme, disabled };
  const isLeading = position === 'leading';
  let checkbox;

  if (mode === 'android') {
    checkbox = <CheckboxAndroid {...checkboxProps} />;
  } else if (mode === 'ios') {
    checkbox = <CheckboxIOS {...checkboxProps} />;
  } else {
    checkbox = <Checkbox {...checkboxProps} />;
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
    <TouchableRipple
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: status === 'checked',
        disabled,
      }}
      onPress={onPress}
      testID={testID}
      disabled={disabled}
    >
      <View
        style={[styles.container, style]}
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
      >
        {isLeading && checkbox}
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
        {!isLeading && checkbox}
      </View>
    </TouchableRipple>
  );
};

CheckboxItem.displayName = 'Checkbox.Item';

export default withInternalTheme(CheckboxItem);

// @component-docs ignore-next-line
const CheckboxItemWithTheme = withInternalTheme(CheckboxItem);
// @component-docs ignore-next-line
export { CheckboxItemWithTheme as CheckboxItem };

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
