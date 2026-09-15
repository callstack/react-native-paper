import type { ColorRole } from '../../theme/types';

/**
 * Material Design 3 Expressive navigation bar tokens.
 * @see https://m3.material.io/components/navigation-bar/specs
 */
const sizes = {
  containerHeight: 64,
  tallContainerHeight: 80,
  mediumWindowMinWidth: 600,
  icon: 24,
  verticalIndicatorWidth: 56,
  verticalIndicatorHeight: 32,
  horizontalIndicatorHeight: 40,
  horizontalIndicatorLeading: 16,
  horizontalIndicatorTrailing: 16,
  iconLabelSpace: 4,
  itemVerticalSpace: 6,
  itemHorizontalGap: 8,
  minTabWidth: 96,
  maxTabWidth: 168,
  smallBadgeOffset: 2,
  largeBadgeOffset: 4,
} as const;

const colors = {
  container: 'surfaceContainer',
  activeIcon: 'onSecondaryContainer',
  activeLabel: 'secondary',
  activeLabelOnIndicator: 'onSecondaryContainer',
  activeIndicator: 'secondaryContainer',
  inactiveIcon: 'onSurfaceVariant',
  inactiveLabel: 'onSurfaceVariant',
  activeStateLayer: 'onSecondaryContainer',
  inactiveStateLayer: 'onSurface',
} as const satisfies Record<string, ColorRole>;

export const NavigationBarTokens = {
  ...sizes,
  colors,
};
