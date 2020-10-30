import * as React from 'react';
import {
  BackgroundPropType,
  StyleProp,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import color from 'color';
import { withTheme } from '../../core/theming';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

type Props = React.ComponentProps<typeof TouchableWithoutFeedback> & {
  borderless?: boolean;
  background?: BackgroundPropType;
  disabled?: boolean;
  onPress?: () => void | null;
  rippleColor?: string;
  underlayColor?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme: ReactNativePaper.Theme;
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
  const { dark, colors } = theme;
  const disabled = disabledProp || !rest.onPress;
  const calculatedRippleColor =
    rippleColor ||
    color(colors.text)
      .alpha(dark ? 0.32 : 0.2)
      .rgb()
      .string();

  // A workaround for ripple on Android P is to use useForeground + overflow: 'hidden'
  // https://github.com/facebook/react-native/issues/6480
  const useForeground =
    Platform.OS === 'android' &&
    Platform.Version >= ANDROID_VERSION_PIE &&
    borderless;

  if (TouchableRipple.supported) {
    return (
      <TouchableNativeFeedback
        {...rest}
        disabled={disabled}
        useForeground={useForeground}
        background={
          background != null
            ? background
            : TouchableNativeFeedback.Ripple(calculatedRippleColor, borderless)
        }
      >
        <View style={[borderless && { overflow: 'hidden' }, style]}>
          {React.Children.only(children)}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableHighlight
      {...rest}
      disabled={disabled}
      style={[borderless && { overflow: 'hidden' }, style]}
      underlayColor={
        underlayColor != null
          ? underlayColor
          : color(calculatedRippleColor).fade(0.5).rgb().string()
      }
    >
      {React.Children.only(children)}
    </TouchableHighlight>
  );
};

TouchableRipple.supported =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

export default withTheme(TouchableRipple);
