import type { ColorRole } from '../../theme/types';

/**
 * MD3 Radio button spec dimensions and color-role tokens.
 * @see https://m3.material.io/components/radio-button/specs
 */
const sizes = {
  ringSize: 20,
  dotSize: 10,
  outlineWidth: 2,
} as const;

const colors = {
  checkedColor: 'primary',
  uncheckedColor: 'onSurfaceVariant',
  disabledColor: 'onSurface',
  errorColor: 'error',
} as const satisfies Record<string, ColorRole>;

export const RadioButtonTokens = { ...sizes, ...colors };
