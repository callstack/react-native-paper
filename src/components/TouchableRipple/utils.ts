import color from 'color';

import type { InternalTheme } from '../../types';

const getUnderlayColor = ({
  theme,
  calculatedRippleColor,
  underlayColor,
}: {
  theme: InternalTheme;
  calculatedRippleColor: string;
  underlayColor?: string;
}) => {
  if (underlayColor != null) {
    return underlayColor;
  }

  if (theme.isV3) {
    return color(calculatedRippleColor).rgb().string();
  }

  return color(calculatedRippleColor).fade(0.5).rgb().string();
};

const getRippleColor = ({
  theme,
  rippleColor,
}: {
  theme: InternalTheme;
  rippleColor?: string;
}) => {
  if (rippleColor) {
    return rippleColor;
  }

  if (theme.isV3) {
    return color(theme.colors.onSurface).alpha(0.12).rgb().string();
  }

  if (theme.dark) {
    return color(theme.colors.text).alpha(0.32).rgb().string();
  }
  return color(theme.colors.text).alpha(0.2).rgb().string();
};

export const getTouchableRippleColors = ({
  theme,
  rippleColor,
  underlayColor,
}: {
  theme: InternalTheme;
  rippleColor?: string;
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
