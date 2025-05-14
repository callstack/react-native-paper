import type { InternalTheme } from '../../../types';

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
};

export function getTextColor({ theme, disabled }: BaseProps) {
  const {
    colors: { onSurfaceDisabled, onSurfaceVariant },
  } = theme;

  if (disabled) {
    return onSurfaceDisabled;
  }
  return onSurfaceVariant;
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
  const {
    colors: { onSurfaceDisabled, onSurfaceVariant },
  } = theme;

  if (typeof customColor === 'function') {
    return customColor(isTextInputFocused);
  }

  if (customColor) {
    return customColor;
  }

  if (disabled) {
    return onSurfaceDisabled;
  }

  return onSurfaceVariant;
}
