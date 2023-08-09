import * as React from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import type { ThemeProp } from 'src/types';

import { useInternalTheme } from '../../../core/theming';

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
  theme?: ThemeProp;
};

export const Underline = ({
  parentState,
  error,
  colors,
  activeColor,
  underlineColorCustom,
  hasActiveOutline,
  style,
  theme: themeOverrides,
}: UnderlineProps) => {
  const { isV3 } = useInternalTheme(themeOverrides);

  let backgroundColor = parentState.focused
    ? activeColor
    : underlineColorCustom;

  if (error) backgroundColor = colors?.error;

  const activeScale = isV3 ? 2 : 1;

  return (
    <Animated.View
      testID="text-input-underline"
      style={[
        styles.underline,
        isV3 && styles.md3Underline,
        {
          backgroundColor,
          // Underlines is thinner when input is not focused
          transform: [
            {
              scaleY: (isV3 ? hasActiveOutline : parentState.focused)
                ? activeScale
                : 0.5,
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
    height: 2,
    zIndex: 1,
  },
  md3Underline: {
    height: 1,
  },
});
