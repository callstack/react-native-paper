import type {
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
} from 'react-native';

import type { ThemeProp } from '../../types';

/**
 * Props shared by the web and native `TouchableRipple` implementations.
 * `children` and `style` are intentionally excluded: web allows render-prop
 * children and function styles, while native requires a single element.
 */
export type TouchableRippleCommonProps = {
  /**
   * Whether to render the ripple outside the view bounds.
   */
  borderless?: boolean;
  /**
   * Ripple configuration passed straight to the underlying Pressable (Android).
   * When set, it overrides the computed ripple; the MD3 pressed opacity fills in
   * its `alpha` only if the config doesn't set one.
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Whether to start the ripple at the center (Web).
   */
  centered?: boolean;
  /**
   * Whether to prevent interaction with the touchable.
   */
  disabled?: boolean;
  /**
   * Function to execute on press. If not set, will cause the touchable to be disabled.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute immediately when a touch is engaged, before `onPressOut` and `onPress`.
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute when a touch is released.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * Base color of the ripple effect (Android >= 5.0 and Web). Treated as an
   * opaque color; the MD3 pressed state-layer opacity is applied automatically,
   * multiplied into the color's own alpha (so a transparent color stays hidden).
   */
  rippleColor?: ColorValue;
  /**
   * Color of the underlay for the highlight effect (Android < 5.0 and iOS).
   */
  underlayColor?: ColorValue;
  /**
   * @optional
   */
  theme?: ThemeProp;
};
