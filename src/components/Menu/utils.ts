import type { InternalTheme, MD3Theme } from '../../types';
import type { IconSource } from '../Icon';

export const MIN_WIDTH = 112;
export const MAX_WIDTH = 280;

type ContentProps = {
  iconWidth: number;
  leadingIcon?: IconSource;
  trailingIcon?: IconSource;
};

type ColorProps = {
  theme: InternalTheme;
  disabled?: boolean;
};

const getDisabledColor = (theme: InternalTheme) => {
  return (theme as MD3Theme).colors.onSurfaceDisabled;
};

const getTitleColor = ({ theme, disabled }: ColorProps) => {
  const { colors } = theme as MD3Theme;
  if (disabled) {
    return getDisabledColor(theme);
  }

  return colors.onSurface;
};

const getIconColor = ({ theme, disabled }: ColorProps) => {
  const { colors } = theme as MD3Theme;
  if (disabled) {
    return getDisabledColor(theme);
  }

  return colors.onSurfaceVariant;
};

export const getMenuItemColor = ({ theme, disabled }: ColorProps) => {
  return {
    titleColor: getTitleColor({ theme, disabled }),
    iconColor: getIconColor({ theme, disabled }),
  };
};

export const getContentMaxWidth = ({
  iconWidth,
  leadingIcon,
  trailingIcon,
}: ContentProps) => {
  if (leadingIcon && trailingIcon) {
    return MAX_WIDTH - (2 * iconWidth + 24);
  }

  if (leadingIcon || trailingIcon) {
    return MAX_WIDTH - (iconWidth + 24);
  }

  return MAX_WIDTH - 12;
};
