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
import { IDLE_STATE, getTouchableRippleColors, resolveChildren } from './utils';
import { SettingsContext } from '../../core/settings';
import type { Settings } from '../../core/settings';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import hasTouchHandler, {
  getNonControlA11yProps,
} from '../../utils/hasTouchHandler';
import type { FocusRingPlacement } from '../../utils/useFocusRing';
import { useFocusRing } from '../../utils/useFocusRing';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

export type Props = PressableProps & {
  borderless?: boolean;
  background?: PressableAndroidRippleConfig;
  centered?: boolean;
  disabled?: boolean;
  focusRing?: FocusRingPlacement;
  onPress?: (e: GestureResponderEvent) => void | null;
  onLongPress?: (e: GestureResponderEvent) => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
  rippleColor?: ColorValue;
  underlayColor?: string;
  hoverColor?: ColorValue;
  ref?: React.Ref<React.ComponentRef<typeof View>>;
  theme?: ThemeProp;
};

const TouchableRipple = ({
  style,
  background,
  borderless = false,
  disabled: disabledProp,
  rippleColor,
  underlayColor,
  hoverColor: _hoverColor,
  children,
  theme: themeOverrides,
  focusRing = 'outward',
  onFocus,
  onBlur,
  hitSlop,
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

  const isControl = hasPassedTouchHandler || Boolean(disabledProp);
  const isInteractive = hasPassedTouchHandler && !disabledProp;

  const effectiveHitSlop = isInteractive ? hitSlop : undefined;

  const { target, ring } = useFocusRing(
    !isInteractive,
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

  const useForeground =
    Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_PIE;

  const resolveStyle = (
    baseStyle: StyleProp<ViewStyle>
  ): PressableProps['style'] =>
    typeof style === 'function'
      ? (state) => [baseStyle, style(state), ...ring.style]
      : [baseStyle, style, ...ring.style];

  if (!isControl) {
    const baseStyle = TouchableRipple.supported
      ? useForeground && styles.overflowHidden
      : borderless && styles.overflowHidden;

    return (
      <View
        {...rest}
        ref={ref}
        // taken out of `rest` for the ring, so passed on here unchanged
        onFocus={onFocus}
        onBlur={onBlur}
        {...getNonControlA11yProps(rest)}
        style={[
          baseStyle,
          typeof style === 'function' ? style(IDLE_STATE) : style,
        ]}
      >
        {resolveChildren(children, IDLE_STATE)}
      </View>
    );
  }

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
        disabled={Boolean(disabledProp)}
        hitSlop={effectiveHitSlop}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={resolveStyle(useForeground && styles.overflowHidden)}
        android_ripple={androidRipple}
      >
        {typeof children === 'function'
          ? (state) => resolveChildren(children, state)
          : children}
      </Pressable>
    );
  }

  return (
    <Pressable
      {...rest}
      ref={ref}
      disabled={Boolean(disabledProp)}
      hitSlop={effectiveHitSlop}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={resolveStyle(borderless && styles.overflowHidden)}
    >
      {(state) => (
        <>
          {state.pressed && rippleEffectEnabled && isInteractive && (
            <View
              style={[
                styles.underlay,
                { backgroundColor: calculatedUnderlayColor },
              ]}
            />
          )}
          {resolveChildren(children, state)}
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
