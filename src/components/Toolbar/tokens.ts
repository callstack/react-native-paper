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

// Color roles from https://m3.material.io/components/toolbars/specs, for the
// toolbar's own `container` and for its mode-less children: `IconButton`
// (`icon`, `buttonContainer`) and `Button` (`label`). If an `IconButton` or
// `Button` has a `mode` (filled, outlined, etc.), it colors itself instead
// (see `ToolbarColorContext`). The `selected*` roles only apply to
// `IconButton`, `Button` has no selected state. An unselected `IconButton`
// doesn't get a `buttonContainer` override either, since that role is the
// same color as the toolbar's `container`, so it just blends in with no
// visible pill.
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
