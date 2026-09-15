import type { ColorRole, Elevation, TypescaleKey } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

export type Alignment = 'top' | 'center' | 'bottom';

/**
 * MD3 Navigation rail spec tokens.
 * @see https://m3.material.io/components/navigation-rail/specs
 */
const rail = {
  collapsedWidth: 96,
  expandedMinWidth: 220,
  expandedMaxWidth: 360,
  topSpace: 44,
  headerSpace: 40,
  itemSpace: 4,
  itemHorizontalPadding: 20,
  elevation: 0,
  modalElevation: 2,
  modalShape: 'large',
} as const satisfies Record<string, number | Elevation | ShapeToken>;

const item = {
  iconSize: 24,
  indicatorShape: 'full',
  badgeInset: 8,
  collapsed: {
    minHeight: 64,
    indicatorWidth: 56,
    indicatorHeight: 32,
    iconLabelGap: 4,
    labelTypescale: 'labelMedium',
  },
  expanded: {
    indicatorHeight: 56,
    leading: 16,
    trailing: 16,
    iconLabelGap: 8,
    labelTypescale: 'labelLarge',
  },
} as const satisfies {
  iconSize: number;
  indicatorShape: ShapeToken;
  badgeInset: number;
  collapsed: Record<string, number | TypescaleKey>;
  expanded: Record<string, number | TypescaleKey>;
};

const colors = {
  container: 'surface',
  modalContainer: 'surfaceContainer',
  activeIcon: 'onSecondaryContainer',
  activeLabel: 'secondary',
  activeExpandedLabel: 'onSecondaryContainer',
  activeIndicator: 'secondaryContainer',
  inactiveIcon: 'onSurfaceVariant',
  inactiveLabel: 'onSurfaceVariant',
  stateLayer: 'onSecondaryContainer',
  focusIndicator: 'secondary',
} as const satisfies Record<string, ColorRole>;

export const NavigationRailTokens = { rail, item, colors };
