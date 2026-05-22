import type { ColorRole } from '../../theme/types';

/**
 * MD3 Checkbox spec dimensions and color-role tokens.
 * @see https://m3.material.io/components/checkbox/specs
 */
const sizes = {
  containerSize: 18,
  containerRadius: 2,
  outlineWidth: 2,
  stateLayerSize: 40,
} as const;

const colors = {
  containerColor: 'primary',
  disabledContainerColor: 'onSurface',
  errorContainerColor: 'error',
  outlineColor: 'onSurfaceVariant',
  disabledOutlineColor: 'onSurface',
  errorOutlineColor: 'error',
  iconColor: 'onPrimary',
  disabledIconColor: 'surface',
  errorIconColor: 'onError',
  selectedStateLayerColor: 'primary',
  unselectedStateLayerColor: 'onSurface',
  errorStateLayerColor: 'error',
} as const satisfies Record<string, ColorRole>;

export const CheckboxTokens = { ...sizes, ...colors };
