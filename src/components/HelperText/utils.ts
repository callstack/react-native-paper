import color from 'color';

import type { InternalTheme } from '../../types';

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
  type?: 'error' | 'info';
};

export function getTextColor({ theme, disabled, type }: BaseProps) {
  const { colors, dark } = theme;

  if (type === 'error') {
    return colors?.error;
  }

  if (theme.isV3) {
    if (disabled) {
      return theme.colors.onSurfaceDisabled;
    } else {
      return theme.colors.onSurfaceVariant;
    }
  }

  return color(theme?.colors?.text)
    .alpha(dark ? 0.7 : 0.54)
    .rgb()
    .string();
}
