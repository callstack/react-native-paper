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
  /**
   * Vertical gap between menu groups (`Menu.Section`).
   * @see https://m3.material.io/components/menus/specs
   */
  groupGap: 8,
} as const;

const shapes = {
  /** Menu surface corner. Spec: corner.large (16dp). */
  container: 'large' as ShapeToken,
  /** First / last / selected item corners. Spec: corner.medium. */
  item: 'medium' as ShapeToken,
} as const;

const typography = {
  label: 'labelLarge' as TypescaleKey,
  supporting: 'bodySmall' as TypescaleKey,
  trailingSupporting: 'labelLarge' as TypescaleKey,
} as const;

/**
 * Standard (baseline) color scheme roles.
 * Container fill still comes from elevation[levelN] → surfaceContainerLow at default elevation 2.
 */
const standardColors = {
  label: 'onSurface' as ColorRole,
  icon: 'onSurfaceVariant' as ColorRole,
  supporting: 'onSurfaceVariant' as ColorRole,
  selectedContainer: 'tertiaryContainer' as ColorRole,
  selectedContent: 'onTertiaryContainer' as ColorRole,
} as const;

/**
 * M3 Expressive vibrant menu roles.
 * @see https://m3.material.io/components/menus/specs
 */
const vibrantColors = {
  label: 'onTertiaryContainer' as ColorRole,
  icon: 'onTertiaryContainer' as ColorRole,
  supporting: 'onTertiaryContainer' as ColorRole,
  /** Vibrant menu surface uses tertiaryContainer instead of elevation surface. */
  container: 'tertiaryContainer' as ColorRole,
  selectedContainer: 'tertiary' as ColorRole,
  selectedContent: 'onTertiary' as ColorRole,
} as const;

const elevation = {
  default: 2 as Elevation,
} as const;

export const MenuTokens = {
  sizes,
  shapes,
  typography,
  standardColors,
  vibrantColors,
  elevation,
};

export type MenuColorScheme = 'standard' | 'vibrant';
