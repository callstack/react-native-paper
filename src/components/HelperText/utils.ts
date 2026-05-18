import { getStateLayer } from '../../theme/utils/state';
import type { InternalTheme } from '../../types';

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
  type?: 'error' | 'info';
};

export function getTextColor({ theme, disabled, type }: BaseProps) {
  if (type === 'error') {
    return getStateLayer(theme, 'error', 'enabled');
  }
  return getStateLayer(
    theme,
    'onSurfaceVariant',
    disabled ? 'disabled' : 'enabled'
  );
}
