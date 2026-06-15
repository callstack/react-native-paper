import * as React from 'react';
import { View } from 'react-native';
import type {
  AccessibilityState,
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  ViewStyle,
} from 'react-native';

import Shell from './Shell';
import type { Size, Variant } from './tokens';
import type { ThemeProp } from '../../types';
import type { IconSource } from '../Icon';

export type Props = {
  /**
   * Icon to display inside the FAB.
   */
  icon: IconSource;
  /**
   * Role-color preset. Defaults to `tonalPrimary`.
   */
  variant?: Variant;
  /**
   * Override the container (background) color.
   */
  containerColor?: ColorValue;
  /**
   * Override the content (icon) color.
   */
  contentColor?: ColorValue;
  /**
   * Spec size. Defaults to `default`.
   */
  size?: Size;
  /**
   * Whether the FAB is currently visible. Toggling animates the spec'd enter
   * and exit (scale + alpha) on the FAB itself.
   */
  visible?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label. Falls back to nothing if unset.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility state forwarded to the underlying button.
   */
  accessibilityState?: AccessibilityState;
  /**
   * Type of background drawable to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Style for positioning the FAB. The visual treatment (size, shape, color)
   * is driven by `variant` and `size`.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * TestID used for testing purposes.
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  ref?: React.Ref<View>;
};

/**
 * A floating action button represents the primary action on a screen.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { FAB } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <FAB
 *     icon="plus"
 *     style={styles.fab}
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * const styles = StyleSheet.create({
 *   fab: {
 *     position: 'absolute',
 *     margin: 16,
 *     right: 0,
 *     bottom: 0,
 *   },
 * });
 *
 * export default MyComponent;
 * ```
 */
const FAB = ({
  icon,
  variant = 'tonalPrimary',
  size = 'default',
  visible = true,
  onPress,
  containerColor,
  contentColor,
  accessibilityLabel,
  accessibilityState,
  background,
  style,
  testID = 'floating-action-button',
  theme,
  ref,
}: Props) => (
  <Shell
    ref={ref}
    icon={icon}
    variant={variant}
    size={size}
    visible={visible}
    onPress={onPress}
    containerColor={containerColor}
    contentColor={contentColor}
    accessibilityLabel={accessibilityLabel}
    accessibilityState={accessibilityState}
    background={background}
    style={style}
    testID={testID}
    theme={theme}
  />
);

export default FAB;

// @component-docs ignore-next-line
export { FAB };
