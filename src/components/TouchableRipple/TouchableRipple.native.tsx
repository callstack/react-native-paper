import * as React from 'react';
import {
  PressableAndroidRippleConfig,
  StyleProp,
  Platform,
  ViewStyle,
  StyleSheet,
  GestureResponderEvent,
  View,
  ColorValue,
} from 'react-native';

import type { PressableProps } from './Pressable';
import { Pressable } from './Pressable';
import { getTouchableRippleColors } from './utils';
import { Settings, SettingsContext } from '../../core/settings';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import hasTouchHandler from '../../utils/hasTouchHandler';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

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
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeProp;
  /**
   * Debounce time in milliseconds to prevent rapid successive presses.
   * When set, subsequent onPress calls within this time window will be ignored.
   */
  debounce?: number;
};

const TouchableRipple = (
  {
    style,
    background,
    borderless = false,
    disabled: disabledProp,
    rippleColor,
    underlayColor,
    children,
    theme: themeOverrides,
    debounce,
    ...rest
  }: Props,
  ref: React.ForwardedRef<View>
) => {
  const theme = useInternalTheme(themeOverrides);
  const { rippleEffectEnabled } = React.useContext<Settings>(SettingsContext);

  const { onPress, onLongPress, onPressIn, onPressOut } = rest;
  const lastPressTime = React.useRef<number>(0);

  const debouncedOnPress = React.useCallback(
    (e: GestureResponderEvent) => {
      if (!onPress) return;

      if (debounce && debounce > 0) {
        const now = Date.now();
        if (now - lastPressTime.current < debounce) {
          return; // Ignore this press as it's within the debounce window
        }
        lastPressTime.current = now;
      }

      onPress(e);
    },
    [onPress, debounce]
  );

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const disabled = disabledProp || !hasPassedTouchHandler;

  const { calculatedRippleColor, calculatedUnderlayColor } =
    getTouchableRippleColors({
      theme,
      rippleColor,
      underlayColor,
    });

  // A workaround for ripple on Android P is to use useForeground + overflow: 'hidden'
  // https://github.com/facebook/react-native/issues/6480
  const useForeground =
    Platform.OS === 'android' &&
    Platform.Version >= ANDROID_VERSION_PIE &&
    borderless;

  if (TouchableRipple.supported) {
    const androidRipple = rippleEffectEnabled
      ? background ?? {
          color: calculatedRippleColor,
          borderless,
          foreground: useForeground,
        }
      : undefined;

    return (
      <Pressable
        {...rest}
        ref={ref}
        disabled={disabled}
        style={[borderless && styles.overflowHidden, style]}
        android_ripple={androidRipple}
        onPress={debouncedOnPress}
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
      style={[borderless && styles.overflowHidden, style]}
      onPress={debouncedOnPress}
    >
      {({ pressed }: { pressed: boolean }) => (
        <>
          {pressed && rippleEffectEnabled && (
            <View
              testID="touchable-ripple-underlay"
              style={[
                styles.underlay,
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
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
});

const Component = forwardRef(TouchableRipple);

export default Component as typeof Component & { supported: boolean };
