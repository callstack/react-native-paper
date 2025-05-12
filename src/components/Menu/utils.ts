import type { ColorValue } from 'react-native';

import color from 'color';

import type { InternalTheme } from '../../types';
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
  customRippleColor?: ColorValue;
};

const getDisabledColor = (theme: InternalTheme) => {
  const {
    colors: { onSurfaceDisabled },
  } = theme;

  return onSurfaceDisabled;
};

const getTitleColor = ({ theme, disabled }: ColorProps) => {
  const {
    colors: { onSurface },
  } = theme;
  if (disabled) {
    return getDisabledColor(theme);
  }

  return onSurface;
};

const getIconColor = ({ theme, disabled }: ColorProps) => {
  const {
    colors: { onSurfaceVariant },
  } = theme;
  if (disabled) {
    return getDisabledColor(theme);
  }

  return onSurfaceVariant;
};

const getRippleColor = ({
  theme,
  customRippleColor,
}: Omit<ColorProps, 'disabled'>) => {
  const {
    colors: { onSurfaceVariant },
  } = theme;

  if (customRippleColor) {
    return customRippleColor;
  }

  return color(onSurfaceVariant).alpha(0.12).rgb().string();
};

export const getMenuItemColor = ({
  theme,
  disabled,
  customRippleColor,
}: ColorProps) => {
  return {
    titleColor: getTitleColor({ theme, disabled }),
    iconColor: getIconColor({ theme, disabled }),
    rippleColor: getRippleColor({ theme, customRippleColor }),
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
