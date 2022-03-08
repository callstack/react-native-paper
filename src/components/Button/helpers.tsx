import { StyleSheet } from 'react-native';
import color from 'color';
import { black, white } from '../../styles/themes/v2/colors';
import type { Theme } from '../../types';

export type buttonMode =
  | 'text'
  | 'outlined'
  | 'contained'
  | 'elevated'
  | 'contained-tonal';

export const getButtonColors = ({
  buttonColor,
  theme,
  mode,
  disabled,
  dark,
}: {
  buttonColor?: string;
  theme: Theme;
  mode: buttonMode;
  disabled?: boolean;
  dark?: boolean;
}) => {
  let backgroundColor;
  let borderColor;
  let textColor;
  let borderWidth;

  const isMode = (modeToCompare: buttonMode) => {
    return mode === modeToCompare;
  };

  if (theme.isV3) {
    if (disabled) {
      textColor = theme.colors.onSurfaceDisabled;
      if (isMode('outlined')) {
        backgroundColor = 'transparent';
        borderColor = theme.colors.surfaceDisabled;
        borderWidth = 1;
      } else if (isMode('text')) {
        backgroundColor = 'transparent';
      } else {
        backgroundColor = theme.colors.surfaceDisabled;
      }
    } else {
      if (isMode('outlined')) {
        borderColor = theme.colors.outline;
        borderWidth = 1;
        textColor = buttonColor || theme.colors.primary;
      } else if (isMode('text')) {
        textColor = buttonColor || theme.colors.primary;
      } else if (isMode('elevated')) {
        textColor = theme.colors.primary;
        backgroundColor = buttonColor || theme.colors.surface;
      } else if (isMode('contained')) {
        textColor = theme.colors.onPrimary;
        backgroundColor = buttonColor || theme.colors.primary;
      } else if (isMode('contained-tonal')) {
        textColor = theme.colors.onSecondaryContainer;
        backgroundColor = buttonColor || theme.colors.secondaryContainer;
      }
    }
  } else {
    if (isMode('contained')) {
      if (disabled) {
        backgroundColor = color(theme.dark ? white : black)
          .alpha(0.12)
          .rgb()
          .string();
      } else if (buttonColor) {
        backgroundColor = buttonColor;
      } else {
        backgroundColor = theme.colors.primary;
      }
    } else {
      backgroundColor = 'transparent';
    }

    if (isMode('outlined')) {
      borderColor = color(theme.dark ? white : black)
        .alpha(0.29)
        .rgb()
        .string();
      borderWidth = StyleSheet.hairlineWidth;
    } else {
      borderColor = 'transparent';
      borderWidth = 0;
    }

    if (disabled) {
      textColor = color(theme.dark ? white : black)
        .alpha(0.32)
        .rgb()
        .string();
    } else if (isMode('contained')) {
      let isDark;

      if (typeof dark === 'boolean') {
        isDark = dark;
      } else {
        isDark =
          backgroundColor === 'transparent'
            ? false
            : !color(backgroundColor).isLight();
      }

      textColor = isDark ? white : black;
    } else if (buttonColor) {
      textColor = buttonColor;
    } else {
      textColor = theme.colors.primary;
    }
  }

  return {
    backgroundColor,
    borderColor,
    textColor,
    borderWidth,
  };
};
