import type { InternalTheme } from '../../types';

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
  type?: 'error' | 'info';
};

export function getTextColor({ theme, disabled, type }: BaseProps) {
  const {
    colors: { error, onSurfaceDisabled, onSurfaceVariant },
  } = theme;

  if (type === 'error') {
    return error;
  }

  if (disabled) {
    return onSurfaceDisabled;
  }

  return onSurfaceVariant;
}
