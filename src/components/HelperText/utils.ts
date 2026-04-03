import { tokens } from '../../styles/themes/tokens';
import type { InternalTheme } from '../../types';

const { stateOpacity } = tokens.md.ref;

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
  type?: 'error' | 'info';
};

export function getTextColor({ theme, disabled, type }: BaseProps) {
  if (type === 'error') {
    return { color: theme.colors.error, opacity: stateOpacity.enabled };
  }

  if (disabled) {
    return {
      color: theme.colors.onSurfaceVariant,
      opacity: stateOpacity.disabled,
    };
  }

  return {
    color: theme.colors.onSurfaceVariant,
    opacity: stateOpacity.enabled,
  };
}
