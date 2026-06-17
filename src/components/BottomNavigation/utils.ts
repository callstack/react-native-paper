import type { ColorValue } from 'react-native';

import type { InternalTheme, Theme } from '../../types';

export const getActiveTintColor = ({
  activeColor,
  theme,
}: {
  activeColor: ColorValue | undefined;
  theme: InternalTheme;
}) => {
  if (activeColor != null) {
    return activeColor;
  }

  return (theme as Theme).colors.onSecondaryContainer;
};

export const getInactiveTintColor = ({
  inactiveColor,
  theme,
}: {
  inactiveColor: ColorValue | undefined;
  theme: InternalTheme;
}) => {
  if (inactiveColor != null) {
    return inactiveColor;
  }

  return (theme as Theme).colors.onSurfaceVariant;
};

export const getLabelColor = ({
  tintColor,
  hasColor,
  focused,
  theme,
}: {
  tintColor: ColorValue;
  hasColor: boolean;
  focused: boolean;
  theme: InternalTheme;
}) => {
  const { colors } = theme as Theme;
  if (hasColor) {
    return tintColor;
  }

  if (focused) {
    // M3 active label color is `secondary` (changed from `onSurface`).
    return colors.secondary;
  }
  return colors.onSurfaceVariant;
};
