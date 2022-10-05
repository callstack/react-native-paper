import * as React from 'react';
import {
  BackgroundPropType,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import { withInternalTheme } from '../../core/theming';
import type { InternalTheme } from '../../types';
import { getTouchableRippleColors } from './utils';

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
        <View style={[borderless && styles.overflowHidden, style]}>
          {React.Children.only(children)}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableHighlight
      {...rest}
      disabled={disabled}
      style={[borderless && styles.overflowHidden, style]}
      underlayColor={calculatedUnderlayColor}
    >
      {React.Children.only(children)}
    </TouchableHighlight>
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
