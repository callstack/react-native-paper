import type { ColorRole } from '../../theme/types';

/**
 * MD3 Radio button spec dimensions and color-role tokens.
 * @see https://m3.material.io/components/radio-button/specs
 */
const sizes = {
  ringSize: 20,
  dotSize: 10,
  outlineWidth: 2,
  stateLayerSize: 40,
  touchTargetSize: 48,
} as const;

const colors = {
  checkedColor: 'primary',
  uncheckedColor: 'onSurfaceVariant',
  disabledColor: 'onSurface',
  errorColor: 'error',
  // hover & focus tint by selection; pressing inverts it
  checkedHoverStateLayerColor: 'primary',
  checkedFocusStateLayerColor: 'primary',
  checkedPressedStateLayerColor: 'onSurface',
  uncheckedHoverStateLayerColor: 'onSurface',
  uncheckedFocusStateLayerColor: 'onSurface',
  uncheckedPressedStateLayerColor: 'primary',
  errorStateLayerColor: 'error',
} as const satisfies Record<string, ColorRole>;

export const RadioButtonTokens = { ...sizes, ...colors };
