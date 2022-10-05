import color from 'color';

import { black, white } from '../../styles/themes/v2/colors';
import type { InternalTheme } from '../../types';
import type { IconSource } from '../Icon';

export const MIN_WIDTH = 112;
export const MAX_WIDTH = 280;

type ContentProps = {
  isV3: boolean;
  iconWidth: number;
  leadingIcon?: IconSource;
  trailingIcon?: IconSource;
};

type ColorProps = {
  theme: InternalTheme;
  disabled?: boolean;
};

const getDisabledColor = (theme: InternalTheme) => {
  if (theme.isV3) {
    return theme.colors.onSurfaceDisabled;
  }

  return color(theme.dark ? white : black)
    .alpha(0.32)
    .rgb()
    .string();
};

const getTitleColor = ({ theme, disabled }: ColorProps) => {
  if (disabled) {
    return getDisabledColor(theme);
  }

  if (theme.isV3) {
    return theme.colors.onSurface;
  }

  return color(theme.colors.text).alpha(0.87).rgb().string();
};

const getIconColor = ({ theme, disabled }: ColorProps) => {
  if (disabled) {
    return getDisabledColor(theme);
  }

  if (theme.isV3) {
    return theme.colors.onSurfaceVariant;
  }

  return color(theme.colors.text).alpha(0.54).rgb().string();
};

export const getMenuItemColor = ({ theme, disabled }: ColorProps) => {
  return {
    titleColor: getTitleColor({ theme, disabled }),
    iconColor: getIconColor({ theme, disabled }),
    underlayColor: theme.isV3
      ? color(theme.colors.primary).alpha(0.12).rgb().string()
      : undefined,
  };
};

export const getContentMaxWidth = ({
  isV3,
  iconWidth,
  leadingIcon,
  trailingIcon,
}: ContentProps) => {
  if (isV3) {
    if (leadingIcon && trailingIcon) {
      return MAX_WIDTH - (2 * iconWidth + 24);
    }

    if (leadingIcon || trailingIcon) {
      return MAX_WIDTH - (iconWidth + 24);
    }

    return MAX_WIDTH - 12;
  }

  if (leadingIcon) {
    return MAX_WIDTH - (iconWidth + 48);
  }

  return MAX_WIDTH - 16;
};
