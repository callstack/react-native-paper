import * as React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import type {
  PressableAndroidRippleConfig,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  ColorValue,
} from 'react-native';

import type { PressableProps } from './Pressable';
import { Pressable } from './Pressable';
import { getTouchableRippleColors } from './utils';
import { SettingsContext } from '../../core/settings';
import type { Settings } from '../../core/settings';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
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

  const containerStyle = TouchableRipple.supported
    ? [useForeground && styles.overflowHidden, style]
    : [borderless && styles.overflowHidden, style];

  if (!isControl) {
    return (
      <Animated.View
        {...rest}
        ref={ref}
        // Pressable defaults this to true, so keep it to preserve any role and
        // state the caller set, e.g. a read only checked CheckboxItem.
        accessible={rest.accessible !== false}
        // A consumer role of button makes react-native-web render a real
        // <button>, which is tabbable by default. Nothing to activate here.
        focusable={rest.focusable ?? false}
        style={containerStyle}
      >
        {React.Children.only(children)}
      </Animated.View>
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
        style={containerStyle}
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
      disabled={disabledProp}
      style={containerStyle}
    >
      {({ pressed }) => (
        <>
          {pressed && rippleEffectEnabled && isInteractive && (
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
    ...StyleSheet.absoluteFill,
    zIndex: 2,
  },
});

export default TouchableRipple;
