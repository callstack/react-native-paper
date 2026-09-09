import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  PressableAndroidRippleConfig,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  ColorValue,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';

import type { PressableProps } from './Pressable';
import { Pressable } from './Pressable';
import { getTouchableRippleColors } from './utils';
import { SettingsContext } from '../../core/settings';
import type { Settings } from '../../core/settings';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import type { FocusRingPlacement } from '../../utils/useFocusRing';
import { useFocusRing } from '../../utils/useFocusRing';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

/**
 * The underlay fills the touchable absolutely and has no radius of its own, so
 * it paints square corners over a rounded one. A clipping ancestor used to hide
 * that, and those ancestors have to stop clipping to reach into the `hitSlop`.
 */
const getUnderlayShape = (style: StyleProp<ViewStyle>): ViewStyle => {
  const flat = StyleSheet.flatten(style);

  if (!flat) {
    return {};
  }

  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopStartRadius,
    borderTopEndRadius,
    borderBottomStartRadius,
    borderBottomEndRadius,
  } = flat;

  return {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopStartRadius,
    borderTopEndRadius,
    borderBottomStartRadius,
    borderBottomEndRadius,
  };
};

export type Props = PressableProps & {
  borderless?: boolean;
  background?: PressableAndroidRippleConfig;
  centered?: boolean;
  disabled?: boolean;
  /**
   * Where to draw the MD3 keyboard focus indicator.
   *
   * - `outward` - just outside the bounds. The MD3 default.
   * - `inward` - just inside, for controls a clipping ancestor would trim or
   *   that sit flush against a neighbour.
   * - `none` - no indicator. Only for a control that draws its own.
   *
   * Has no effect on iOS today - see `useFocusRing`'s doc comment for why
   * (`enableImperativeFocus`, off by default).
   */
  focusRing?: FocusRingPlacement;
  onPress?: (e: GestureResponderEvent) => void | null;
  onLongPress?: (e: GestureResponderEvent) => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
  rippleColor?: ColorValue;
  underlayColor?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  ref?: React.Ref<View>;
  theme?: ThemeProp;
};

const TouchableRipple = ({
  style,
  background,
  borderless = false,
  disabled: disabledProp,
  rippleColor,
  underlayColor,
  children,
  theme: themeOverrides,
  hitSlop,
  focusRing = 'outward',
  onFocus,
  onBlur,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { rippleEffectEnabled } = React.useContext<Settings>(SettingsContext);

  const { onPress, onLongPress, onPressIn, onPressOut } = rest;

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const disabled = disabledProp || !hasPassedTouchHandler;

  // Keyed off `disabledProp`, not `disabled`: the latter also folds in
  // "no press handler passed", which is a non-interactivity signal, not a
  // disabled one - the ring should only react to real disablement.
  const { target, ring } = useFocusRing(
    disabledProp,
    theme.colors.secondary,
    focusRing
  );
  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    onFocus?.(e);
    target.onFocus?.(e);
  };
  const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    onBlur?.(e);
    target.onBlur?.();
  };

  const { calculatedRippleColor, calculatedUnderlayColor } =
    getTouchableRippleColors({
      theme,
      rippleColor,
      underlayColor,
    });

  // Use foreground ripple on Android P+ to ensure visibility.
  // Background ripple requires the view to have a background drawable,
  // which isn't always present. Foreground ripple needs overflow: 'hidden'
  // to stay within bounds.
  // https://github.com/facebook/react-native/issues/6480
  const useForeground =
    Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_PIE;

  if (TouchableRipple.supported) {
    const androidRipple = rippleEffectEnabled
      ? (background ?? {
          color: calculatedRippleColor,
          borderless,
          foreground: useForeground,
        })
      : undefined;

    return (
      <Pressable
        {...rest}
        ref={ref}
        disabled={disabled}
        hitSlop={hitSlop}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[useForeground && styles.overflowHidden, style, ...ring.style]}
        android_ripple={androidRipple}
      >
        {React.Children.only(children)}
      </Pressable>
    );
  }

  return (
    <Pressable
      {...rest}
      ref={ref}
      disabled={disabled}
      hitSlop={hitSlop}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={[borderless && styles.overflowHidden, style, ...ring.style]}
    >
      {({ pressed }) => (
        <>
          {pressed && rippleEffectEnabled && (
            <View
              testID="touchable-ripple-underlay"
              style={[
                styles.underlay,
                getUnderlayShape(style),
                { backgroundColor: calculatedUnderlayColor },
              ]}
            />
          )}
          {React.Children.only(children)}
        </>
      )}
    </Pressable>
  );
};

TouchableRipple.supported =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

const styles = StyleSheet.create({
  overflowHidden: {
    overflow: 'hidden',
  },
  underlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
  },
});

export default TouchableRipple;
