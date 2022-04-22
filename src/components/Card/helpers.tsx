import type { Animated } from 'react-native';
import color from 'color';
import { black, white } from '../../styles/themes/v2/colors';
import type { Theme } from '../../types';
import overlay from '../../styles/overlay';

export type cardMode = 'elevated' | 'outlined' | 'filled';

export const getCardColors = ({
  theme,
  mode,
  dark,
  isAdaptiveMode,
  elevation,
}: {
  theme: Theme;
  mode: cardMode;
  dark?: boolean;
  isAdaptiveMode?: boolean;
  elevation: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
}) => {
  let backgroundColor;
  let borderColor;

  const isMode = (modeToCompare: cardMode) => {
    return mode === modeToCompare;
  };

  const darkModeBackgroundColor =
    dark && isAdaptiveMode
      ? overlay(elevation, theme.colors.surface)
      : theme.colors.surface;

  if (theme.isV3) {
    if (isMode('filled')) {
      backgroundColor = theme.colors.surfaceVariant;
    } else if (isMode('outlined')) {
      borderColor = theme.colors.outline;
      backgroundColor = darkModeBackgroundColor;
    } else {
      backgroundColor = darkModeBackgroundColor;
    }
  } else {
    backgroundColor = darkModeBackgroundColor;
    borderColor = color(dark ? white : black)
      .alpha(0.12)
      .rgb()
      .string();
  }

  return {
    backgroundColor,
    borderColor,
  };
};
