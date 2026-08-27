import type { ColorRole, Elevation, TypescaleKey } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

/**
 * MD3 Menu / Menu.Item dimensions, shapes, color roles and typescale.
 * @see https://m3.material.io/components/menus/specs
 */
const sizes = {
  /** Min width of a menu item (and thus the menu). */
  minWidth: 112,
  /** Max width of a menu item (and thus the menu). */
  maxWidth: 280,
  /** Standard item height. */
  itemHeight: 48,
  /** Dense item height. */
  denseItemHeight: 32,
  /** Horizontal padding inside an item. */
  itemPaddingHorizontal: 12,
  /** Leading icon size. */
  iconSize: 24,
  /** Gap between leading icon and label. */
  iconLabelGap: 12,
  /** Extra start inset when there is no leading icon. */
  noLeadingIconStart: 4,
  /** Vertical padding of the menu surface. */
  containerPaddingVertical: 8,
  /** Min distance from screen edge. */
  screenIndent: 8,
} as const;

const shapes = {
  /** Menu surface corner. Spec: corner.large (16dp). */
  container: 'large',
  /** First / last / selected item corners. Spec: corner.medium. */
  item: 'medium',
} as const satisfies Record<string, ShapeToken>;

const typography = {
  label: 'labelLarge',
  supporting: 'bodySmall',
  trailingSupporting: 'labelLarge',
} as const satisfies Record<string, TypescaleKey>;

/**
 * Standard (baseline) color scheme roles.
 * Menu surface fill is the MD3 role `surfaceContainerLow` (not elevation.level2 —
 * Paper's elevation.level2 maps to surfaceContainer tones, which is a different color).
 * The `elevation` prop still drives shadow only.
 */
const standardColors = {
  /** MD3 menu container fill. */
  container: 'surfaceContainerLow',
  label: 'onSurface',
  icon: 'onSurfaceVariant',
  supporting: 'onSurfaceVariant',
  selectedContainer: 'tertiaryContainer',
  selectedContent: 'onTertiaryContainer',
} as const satisfies Record<string, ColorRole>;

/**
 * M3 Expressive vibrant menu roles.
 * @see https://m3.material.io/components/menus/specs
 */
const vibrantColors = {
  label: 'onTertiaryContainer',
  icon: 'onTertiaryContainer',
  supporting: 'onTertiaryContainer',
  /** Vibrant menu surface uses tertiaryContainer instead of elevation surface. */
  container: 'tertiaryContainer',
  selectedContainer: 'tertiary',
  selectedContent: 'onTertiary',
} as const satisfies Record<string, ColorRole>;

const elevation = {
  default: 2,
} as const satisfies Record<string, Elevation>;

export const MenuTokens = {
  sizes,
  shapes,
  typography,
  standardColors,
  vibrantColors,
  elevation,
};

export type MenuColorScheme = 'standard' | 'vibrant';
