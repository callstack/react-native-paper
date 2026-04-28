import type { InternalTheme, MD3Theme } from '../../types';

export const getActiveTintColor = ({
  activeColor,
  theme,
}: {
  activeColor: string | undefined;
  theme: InternalTheme;
}) => {
  if (typeof activeColor === 'string') {
    return activeColor;
  }

  return (theme as MD3Theme).colors.onSecondaryContainer;
};

export const getInactiveTintColor = ({
  inactiveColor,
  theme,
}: {
  inactiveColor: string | undefined;
  theme: InternalTheme;
}) => {
  if (typeof inactiveColor === 'string') {
    return inactiveColor;
  }

  return (theme as MD3Theme).colors.onSurfaceVariant;
};

export const getLabelColor = ({
  tintColor,
  hasColor,
  focused,
  theme,
}: {
  tintColor: string;
  hasColor: boolean;
  focused: boolean;
  theme: InternalTheme;
}) => {
  const { colors } = theme as MD3Theme;
  if (hasColor) {
    return tintColor;
  }

  if (focused) {
    return colors.onSurface;
  }
  return colors.onSurfaceVariant;
};
