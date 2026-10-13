import type { ColorRole, Elevation } from '../../theme/types';

/**
 * MD3 Toolbar spec dimensions, shape, and color-role tokens.
 * @see https://m3.material.io/components/toolbars/specs
 */
export type Variant = 'floating' | 'docked';

export type ColorScheme = 'standard' | 'vibrant';

export type Orientation = 'horizontal' | 'vertical';

const docked = {
  containerHeight: 64,
  containerShape: 'none',
  containerLeadingSpace: 16,
  containerTrailingSpace: 16,
  defaultSpacing: 32,
} as const;

const floating = {
  containerHeight: 64,
  containerShape: 'full',
  containerLeadingSpace: 8,
  containerTrailingSpace: 8,
  containerTopSpace: 8,
  containerBottomSpace: 8,
  defaultSpacing: 4,
} as const;

const elevation = {
  docked: 0,
  floating: 3,
} as const satisfies Record<string, Elevation>;

// Color roles for the toolbar's `container` and its mode-less `IconButton`/`Button`
// children. With `mode` IconButton/Button colors itself instead (see `ToolbarColorContext`).
// `selected*` only applies to `IconButton`, unselected ones skip `buttonContainer`.
const standardColors = {
  container: 'surfaceContainer',
  buttonContainer: 'surfaceContainer',
  selectedButtonContainer: 'secondaryContainer',
  icon: 'onSurfaceVariant',
  selectedIcon: 'onSecondaryContainer',
  label: 'onSurfaceVariant',
} as const satisfies Record<string, ColorRole>;

const vibrantColors = {
  container: 'primaryContainer',
  buttonContainer: 'primaryContainer',
  selectedButtonContainer: 'surfaceContainer',
  icon: 'onPrimaryContainer',
  selectedIcon: 'onSurface',
  label: 'onPrimaryContainer',
} as const satisfies Record<string, ColorRole>;

export const ToolbarTokens = {
  floating,
  docked,
  elevation,
  standardColors,
  vibrantColors,
};
