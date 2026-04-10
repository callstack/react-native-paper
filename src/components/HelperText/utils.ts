import type { InternalTheme } from '../../types';

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
  type?: 'error' | 'info';
};

export function getTextColor({ theme, disabled, type }: BaseProps) {
  const { colors } = theme;

  if (type === 'error') {
    return colors?.error;
  }

  if (disabled) {
    return theme.colors.onSurfaceDisabled;
  }
  return theme.colors.onSurfaceVariant;
}
