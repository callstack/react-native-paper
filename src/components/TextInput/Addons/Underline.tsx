import * as React from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';

type UnderlineProps = {
  parentState: {
    focused: boolean;
  };
  error?: boolean;
  colors?: {
    error?: string;
  };
  activeColor: string;
  underlineColorCustom?: string;
  hasActiveOutline?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Underline = ({
  parentState,
  error,
  colors,
  activeColor,
  underlineColorCustom,
  hasActiveOutline,
  style,
}: UnderlineProps) => {
  let backgroundColor = parentState.focused
    ? activeColor
    : underlineColorCustom;

  if (error) backgroundColor = colors?.error;

  return (
    <Animated.View
      testID="text-input-underline"
      style={[
        styles.underline,
        {
          backgroundColor,
          // Underlines is thinner when input is not focused
          transform: [
            {
              scaleY: hasActiveOutline ? 2 : 0.5,
            },
          ],
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    height: 1,
  },
});
