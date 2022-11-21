import * as React from 'react';
import {
  PressableAndroidRippleConfig,
  StyleProp,
  Platform,
  ViewStyle,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from 'react-native';

import { withInternalTheme } from '../../core/theming';
import type { InternalTheme } from '../../types';
import { getTouchableRippleColors } from './utils';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

type Props = React.ComponentProps<typeof Pressable> & {
  borderless?: boolean;
  background?: PressableAndroidRippleConfig;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void | null;
  rippleColor?: string;
  underlayColor?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme: InternalTheme;
};

const TouchableRipple = ({
  style,
  background,
  borderless = false,
  disabled: disabledProp,
  rippleColor,
  underlayColor,
  children,
  theme,
  ...rest
}: Props) => {
  const [showUnderlay, setShowUnderlay] = React.useState<boolean>(false);

  const disabled = disabledProp || !rest.onPress;
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

  const handlePressIn = (e: GestureResponderEvent) => {
    setShowUnderlay(true);
    rest.onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    setShowUnderlay(false);
    rest.onPressOut?.(e);
  };

  if (TouchableRipple.supported) {
    return (
      <Pressable
        {...rest}
        disabled={disabled}
        style={[borderless && styles.overflowHidden, style]}
        android_ripple={
          background != null
            ? background
            : {
                color: calculatedRippleColor,
                borderless,
                foreground: useForeground,
              }
        }
      >
        {React.Children.only(children)}
      </Pressable>
    );
  }

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={[
        borderless && styles.overflowHidden,
        showUnderlay && { backgroundColor: calculatedUnderlayColor },
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {React.Children.only(children)}
    </Pressable>
  );
};

TouchableRipple.supported =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

const styles = StyleSheet.create({
  overflowHidden: {
    overflow: 'hidden',
  },
});

export default withInternalTheme(TouchableRipple);
