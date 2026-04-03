import type { ColorValue } from 'react-native';

import color from 'color';

import type { InternalTheme } from '../../types';

const getUnderlayColor = ({
  theme,
  calculatedRippleColor,
  underlayColor,
}: {
  theme: InternalTheme;
  calculatedRippleColor: ColorValue;
  underlayColor?: string;
}) => {
  if (underlayColor != null) {
    return underlayColor;
  }

  if (typeof calculatedRippleColor === 'string') {
    return color(calculatedRippleColor).rgb().string();
  }
  // PlatformColor — can't convert, return stateLayer default
  return theme.colors.primary;
};

const getRippleColor = ({
  theme,
  rippleColor,
}: {
  theme: InternalTheme;
  rippleColor?: ColorValue;
}) => {
  if (rippleColor) {
    return rippleColor;
  }

  return theme.colors.stateLayerPressed;
};

export const getTouchableRippleColors = ({
  theme,
  rippleColor,
  underlayColor,
}: {
  theme: InternalTheme;
  rippleColor?: ColorValue;
  underlayColor?: string;
}) => {
  const calculatedRippleColor = getRippleColor({ theme, rippleColor });
  return {
    calculatedRippleColor,
    calculatedUnderlayColor: getUnderlayColor({
      theme,
      calculatedRippleColor,
      underlayColor,
    }),
  };
};
