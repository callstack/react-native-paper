import color from 'color';
import type { InternalTheme } from 'src/types';

import type { black, white } from '../../styles/themes/v2/colors';

type BaseConfig = {
  defaultColor: typeof black | typeof white;
  theme: InternalTheme;
};

export const getActiveTintColor = ({
  activeColor,
  defaultColor,
  theme,
}: {
  activeColor: string | undefined;
} & BaseConfig) => {
  return activeColor
    ? activeColor
    : theme.isV3
    ? theme.colors.onSecondaryContainer
    : defaultColor;
};

export const getInactiveTintColor = ({
  inactiveColor,
  defaultColor,
  theme,
}: {
  inactiveColor: string | undefined;
} & BaseConfig) => {
  return inactiveColor
    ? inactiveColor
    : theme.isV3
    ? theme.colors.onSurfaceVariant
    : color(defaultColor).alpha(0.5).rgb().string();
};

export const getLabelColor = ({
  tintColor,
  hasColor,
  focused,
  defaultColor,
  theme,
}: {
  tintColor: string;
  hasColor: boolean;
  focused: boolean;
} & BaseConfig) => {
  return hasColor
    ? tintColor
    : focused
    ? theme.colors.onSurface
    : theme.isV3
    ? theme.colors.onSurfaceVariant
    : defaultColor;
};
