import color from 'color';

import type { InternalTheme } from '../../../types';

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
};

export function getTextColor({ theme, disabled }: BaseProps) {
  if (theme.isV3) {
    if (disabled) {
      return theme.colors.onSurfaceDisabled;
    }
    return theme.colors.onSurfaceVariant;
  }
  return color(theme.colors?.text)
    .alpha(theme.dark ? 0.7 : 0.54)
    .rgb()
    .string();
}

export function getIconColor({
  theme,
  isTextInputFocused,
  disabled,
  customColor,
}: BaseProps & {
  isTextInputFocused: boolean;
  customColor?: ((isTextInputFocused: boolean) => string | undefined) | string;
}) {
  if (typeof customColor === 'function') {
    return customColor(isTextInputFocused);
  }
  if (customColor) {
    return customColor;
  }

  if (!theme.isV3) {
    return theme.colors.text;
  }

  if (disabled) {
    return theme.colors.onSurfaceDisabled;
  }

  return theme.colors.onSurfaceVariant;
}
