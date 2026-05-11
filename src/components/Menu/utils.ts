import { tokens } from '../../theme/tokens';
import type { InternalTheme } from '../../types';
import type { IconSource } from '../Icon';

const { stateOpacity } = tokens.md.ref;

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

const getTitleColor = ({ theme }: ColorProps) => {
  return theme.colors.onSurface;
};

const getIconColor = ({ theme }: ColorProps) => {
  return theme.colors.onSurfaceVariant;
};

export const getMenuItemColor = ({ theme, disabled }: ColorProps) => {
  const contentOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;

  return {
    titleColor: getTitleColor({ theme, disabled }),
    iconColor: getIconColor({ theme, disabled }),
    contentOpacity,
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
