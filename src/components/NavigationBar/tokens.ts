import type { ColorRole, TypescaleKey } from '../../theme/types';

/**
 * Resolved M3 "flexible navigation bar" spec values.
 * @see https://m3.material.io/components/navigation-bar/specs
 */

// Container heights (dp). The flexible navigation bar is shorter than the
// original navigation bar (which was 80dp).
export const BAR_HEIGHT = 64;
export const NO_LABEL_BAR_HEIGHT = 64;

// Active indicator / state-layer pill (dp). Matches the M3 `large` corner (16).
export const INDICATOR_WIDTH = 64;
export const INDICATOR_HEIGHT = 32;
export const INDICATOR_BORDER_RADIUS = 16;

// Icon + spacing (dp).
export const ICON_SIZE = 24;
export const ICON_LABEL_GAP = 4;

// Tab width clamps used by the `compact` layout (dp).
export const MIN_TAB_WIDTH = 96;
export const MAX_TAB_WIDTH = 168;

export const LABEL_TYPESCALE: TypescaleKey = 'labelMedium';

/**
 * Color roles per the M3 spec. `activeLabel` is `secondary` (changed from
 * `onSurface` in Material 3 / Compose Material3 1.4.0).
 */
export const colorRoles = {
  container: 'surfaceContainer',
  activeIcon: 'onSecondaryContainer',
  activeIndicator: 'secondaryContainer',
  activeLabel: 'secondary',
  inactiveIcon: 'onSurfaceVariant',
  inactiveLabel: 'onSurfaceVariant',
} as const satisfies Record<string, ColorRole>;
