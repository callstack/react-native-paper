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

// A role that resolves differently per theme mode. Most roles below
// happen to use the same one in `light`/`dark` (they're already
// theme-aware on their own), but a couple of MD3's "Fixed" roles
// (`on*FixedVariant`) are the wrong pick for `dark`: those are
// *intentionally* the same tone in both modes, whereas the spec's actual
// color for that slot isn't, so `light`/`dark` need to name different
// roles there.
type ToneRole = { light: ColorRole; dark: ColorRole };

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
  container: { light: 'surfaceContainer', dark: 'surfaceContainer' },
  buttonContainer: { light: 'surfaceContainer', dark: 'surfaceContainer' },
  selectedButtonContainer: {
    light: 'secondaryContainer',
    dark: 'secondaryContainer',
  },
  icon: { light: 'onSurfaceVariant', dark: 'onSurfaceVariant' },
  selectedIcon: {
    light: 'onSecondaryFixedVariant',
    dark: 'onSecondaryContainer',
  },
  label: { light: 'onSurfaceVariant', dark: 'onSurfaceVariant' },
} as const satisfies Record<string, ToneRole>;

const vibrantColors = {
  container: { light: 'primaryContainer', dark: 'primaryContainer' },
  buttonContainer: { light: 'primaryContainer', dark: 'primaryContainer' },
  selectedButtonContainer: {
    light: 'surfaceContainer',
    dark: 'surfaceContainer',
  },
  icon: { light: 'onPrimaryFixedVariant', dark: 'onPrimaryContainer' },
  selectedIcon: { light: 'onSurface', dark: 'onSurface' },
  label: { light: 'onPrimaryFixedVariant', dark: 'onPrimaryContainer' },
} as const satisfies Record<string, ToneRole>;

export const ToolbarTokens = {
  floating,
  docked,
  elevation,
  standardColors,
  vibrantColors,
};
