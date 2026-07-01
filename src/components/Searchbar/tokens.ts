import type { ColorRole } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

const sizes = {
  /** Min height of the contained search bar (MD3: 56dp). */
  minHeight: 56,
  /** Min height of the divided search view, which is taller. */
  dividedMinHeight: 72,
  /** Horizontal gap between the input and its surrounding icons. */
  inputPaddingHorizontal: 8,
  /**
   * Horizontal margin around the contained bar when unfocused. On focus it
   * animates down to `marginFocused`, producing the M3 Expressive
   * "grow wider" effect.
   */
  marginUnfocused: 24,
  /** Horizontal margin around the contained bar when focused. */
  marginFocused: 12,
} as const;

const shape = {
  /** Contained search bar: fully rounded (28dp). */
  contained: 'extraLarge',
  /** Divided search view: square corners. */
  divided: 'none',
} as const satisfies Record<string, ShapeToken>;

const colors = {
  container: 'surfaceContainerHigh',
  // Input/placeholder colors per MD3 — previously swapped in the legacy
  // component (input was onSurfaceVariant, placeholder was onSurface).
  input: 'onSurface',
  placeholder: 'onSurfaceVariant',
  leadingIcon: 'onSurfaceVariant',
  trailingIcon: 'onSurfaceVariant',
  cursor: 'primary',
  divider: 'outline',
  resultsContainer: 'surfaceContainerHigh',
} as const satisfies Record<string, ColorRole>;

export const SearchbarTokens = { ...sizes, ...shape, ...colors };
