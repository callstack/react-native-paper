import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  PressableAndroidRippleConfig,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  ColorValue,
} from 'react-native';

import type { PressableProps, PressableStateCallbackType } from './Pressable';
import { Pressable } from './Pressable';
import { getTouchableRippleColors, resolveChildren } from './utils';
import { SettingsContext } from '../../core/settings';
import type { Settings } from '../../core/settings';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import hasTouchHandler, {
  ACTIVATABLE_ROLES,
} from '../../utils/hasTouchHandler';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

// The plain View branch has nothing to press, so the render prop and the style
// function always see this idle state. Matches the state shape Pressable passes.
const IDLE_STATE: PressableStateCallbackType = {
  pressed: false,
  hovered: false,
  focused: false,
};

export type Props = PressableProps & {
  borderless?: boolean;
  background?: PressableAndroidRippleConfig;
  centered?: boolean;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void | null;
  onLongPress?: (e: GestureResponderEvent) => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
  rippleColor?: ColorValue;
  underlayColor?: string;
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
  children,
  theme: themeOverrides,
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

  // With no touch handler and no explicit disabled this is not a control, so it
  // renders as a plain View. A Pressable is wrong here either way: keep the old
  // disabled flag and it gets announced as a disabled control, drop the flag and
  // it starts claiming the touch, swallowing taps meant for whatever wraps it.
  const isControl = hasPassedTouchHandler || Boolean(disabledProp);
  const isInteractive = hasPassedTouchHandler && !disabledProp;

  // `role` wins over `accessibilityRole` on every platform, so resolve it the
  // same way instead of testing both.
  const effectiveRole: string | undefined = rest.role ?? rest.accessibilityRole;
  const claimsActivatable =
    effectiveRole !== undefined && ACTIVATABLE_ROLES.includes(effectiveRole);

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

  // Keep the static form when possible: `Pressable` only tracks the pressed
  // state when `children` or `style` is a function.
  const resolveStyle = (
    baseStyle: StyleProp<ViewStyle>
  ): PressableProps['style'] =>
    typeof style === 'function'
      ? (state) => [baseStyle, style(state)]
      : [baseStyle, style];

  if (!isControl) {
    const baseStyle = TouchableRipple.supported
      ? useForeground && styles.overflowHidden
      : borderless && styles.overflowHidden;

    return (
      <View
        {...rest}
        ref={ref}
        // Pressable defaults this to true, so keep it to preserve any role and
        // state the caller set, e.g. a read only checked CheckboxItem.
        accessible={rest.accessible !== false}
        // Drop the claim, keep the element so its label is still announced.
        role={claimsActivatable ? 'none' : rest.role}
        // A consumer role of button makes react-native-web render a real
        // <button>, which is tabbable by default. Nothing to activate here.
        focusable={rest.focusable ?? false}
        style={[
          baseStyle,
          typeof style === 'function' ? style(IDLE_STATE) : style,
        ]}
      >
        {typeof children === 'function' ? children(IDLE_STATE) : children}
      </View>
    );
  }

  if (TouchableRipple.supported) {
    const androidRipple =
      rippleEffectEnabled && isInteractive
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
        disabled={disabledProp}
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
      disabled={disabledProp}
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
