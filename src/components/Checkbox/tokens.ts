import type { ColorRole } from '../../theme/types';

// MD3 Checkbox spec: https://m3.material.io/components/checkbox/specs
const sizes = {
  containerSize: 18,
  containerRadius: 2,
  outlineWidth: 2,
  stateLayerSize: 40,

  checkmarkWidth: 11,
  checkmarkHeight: 6,
  checkmarkStrokeWidth: 2,
  indeterminateWidth: 10,
  indeterminateHeight: 2,
  indeterminateRadius: 1,

  fillDuration: 100,
  checkDuration: 150,
} as const;

const colors = {
  containerColor: 'primary',
  iconColor: 'onPrimary',
  outlineColor: 'onSurfaceVariant',

  errorContainerColor: 'error',
  errorIconColor: 'onError',
  errorOutlineColor: 'error',

  disabledContainerColor: 'onSurface',
  disabledIconColor: 'surface',
  disabledOutlineColor: 'onSurface',

  selectedStateLayerColor: 'primary',
  unselectedStateLayerColor: 'onSurface',
  errorStateLayerColor: 'error',

  focusIndicatorColor: 'secondary',
} as const satisfies Record<string, ColorRole>;

export const CheckboxTokens = { ...sizes, ...colors };
