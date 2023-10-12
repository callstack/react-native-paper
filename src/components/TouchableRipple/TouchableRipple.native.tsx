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
        disabled={disabled}
        style={[borderless && styles.overflowHidden, style]}
        android_ripple={androidRipple}
      >
        {React.Children.only(children)}
      </Pressable>
    );
  }

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={[borderless && styles.overflowHidden, style]}
    >
      {({ pressed }) => (
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

export default TouchableRipple;
