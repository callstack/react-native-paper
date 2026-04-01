import type { InternalTheme } from 'src/types';

type BaseProps = {
  theme: InternalTheme;
};

export const getActiveTintColor = ({
  activeColor,
  theme,
}: BaseProps & {
  activeColor: string | undefined;
}) => {
  if (typeof activeColor === 'string') {
    return activeColor;
  }

  return theme.colors.onSecondaryContainer;
};

export const getInactiveTintColor = ({
  inactiveColor,
  theme,
}: BaseProps & {
  inactiveColor: string | undefined;
}) => {
  if (typeof inactiveColor === 'string') {
    return inactiveColor;
  }

  return theme.colors.onSurfaceVariant;
};

export const getLabelColor = ({
  tintColor,
  hasColor,
  focused,
  theme,
}: BaseProps & {
  tintColor: string;
  hasColor: boolean;
  focused: boolean;
}) => {
  if (hasColor) {
    return tintColor;
  }

  if (focused) {
    return theme.colors.onSurface;
  }
  return theme.colors.onSurfaceVariant;
};
