import color from 'color';
import type { InternalTheme } from 'src/types';

import type { black, white } from '../../styles/themes/v2/colors';

type BaseProps = {
  defaultColor: typeof black | typeof white;
  theme: InternalTheme;
};

export const getActiveTintColor = ({
  activeColor,
  defaultColor,
  theme,
}: BaseProps & {
  activeColor: string | undefined;
}) => {
  if (typeof activeColor === 'string') {
    return activeColor;
  }

  if (theme.isV3) {
    return theme.colors.onSecondaryContainer;
  }

  return defaultColor;
};

export const getInactiveTintColor = ({
  inactiveColor,
  defaultColor,
  theme,
}: BaseProps & {
  inactiveColor: string | undefined;
}) => {
  if (typeof inactiveColor === 'string') {
    return inactiveColor;
  }

  if (theme.isV3) {
    return theme.colors.onSurfaceVariant;
  }

  return color(defaultColor).alpha(0.5).rgb().string();
};

export const getLabelColor = ({
  tintColor,
  hasColor,
  focused,
  defaultColor,
  theme,
}: BaseProps & {
  tintColor: string;
  hasColor: boolean;
  focused: boolean;
}) => {
  if (hasColor) {
    return tintColor;
  }

  if (theme.isV3) {
    if (focused) {
      return theme.colors.onSurface;
    }
    return theme.colors.onSurfaceVariant;
  }

  return defaultColor;
};
