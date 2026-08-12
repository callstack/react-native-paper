import type { ColorRole, Elevation } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

/**
 * MD3 Toolbar spec dimensions, shape, and color-role tokens.
 * @see https://m3.material.io/components/toolbars/specs
 */
export type Variant = 'floating' | 'docked';

export type ColorScheme = 'standard' | 'vibrant';

export type Orientation = 'horizontal' | 'vertical';

const docked = {
  containerHeight: 64,
  containerShape: 'none' as ShapeToken,
  containerLeadingSpace: 16,
  containerTrailingSpace: 16,
  defaultSpacing: 32,
} as const;

const floating = {
  containerHeight: 64,
  containerShape: 'full' as ShapeToken,
  containerLeadingSpace: 8,
  containerTrailingSpace: 8,
  defaultSpacing: 4,
} as const;

const elevation = {
  docked: 0,
  floating: 3,
} as const satisfies Record<string, Elevation>;

// Per https://m3.material.io/components/toolbars/specs—color roles for
// the toolbar itself (`container`) and its mode-less children: `IconButton`
// (`icon`, `buttonContainer`) and `Button` (`label`); a `mode` on either
// (filled, outlined, etc.) opts it out in favor of its own mode-based
// coloring instead (see `withToolbarChildColors`). `selected*` roles apply
// only to `IconButton`—`Button` has no `selected` state, and an
// unselected `IconButton` gets no `buttonContainer` override at all, since
// it's the same role as the toolbar's own `container` (i.e. no visible
// pill, it just blends in).
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
