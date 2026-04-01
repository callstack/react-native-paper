import type { InternalTheme } from '../../../types';

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
};

export function getTextColor({ theme, disabled }: BaseProps) {
  if (disabled) {
    return theme.colors.onSurfaceDisabled;
  }
  return theme.colors.onSurfaceVariant;
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

  if (disabled) {
    return theme.colors.onSurfaceDisabled;
  }

  return theme.colors.onSurfaceVariant;
}
