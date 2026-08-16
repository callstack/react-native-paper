import { tokens } from '../../theme/tokens';
import type {
  ColorRole,
  MotionDuration,
  MotionEasing,
  TypescaleKey,
} from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

const stateOpacity = {
  enabled: tokens.md.sys.state.opacity.enabled,
  disabled: tokens.md.sys.state.opacity.disabled,
} as const;

/**
 * MD3 navigation drawer destination ("item") spec.
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
const itemSizes = {
  height: 56,
  iconSize: 24,
  /** Inset of the active indicator from the drawer container edge. */
  indicatorInset: 12,
  /** Inset of icon + label from the active indicator edge. Container
   *  padding (28dp) minus `indicatorInset`. */
  contentInset: 16,
  iconLabelGap: 12,
  /** Minimum gap the label leaves before the trailing (badge) slot. */
  labelTrailingGap: 32,
} as const satisfies Record<string, number>;

const itemShape = {
  indicatorShape: 'full',
} as const satisfies Record<string, ShapeToken>;

const itemTypescale = {
  labelText: 'labelLarge',
  /** Active destinations use the `label-large-weight-prominent` weight. */
  activeLabelText: 'labelLargeEmphasized',
} as const satisfies Record<string, TypescaleKey>;

const itemColors = {
  activeIndicatorColor: 'secondaryContainer',
  activeIconColor: 'onSecondaryContainer',
  activeLabelTextColor: 'onSecondaryContainer',
  inactiveIconColor: 'onSurfaceVariant',
  inactiveLabelTextColor: 'onSurfaceVariant',
  focusIndicatorColor: 'secondary',
} as const satisfies Record<string, ColorRole>;

const { thickness, innerOffset } = tokens.md.sys.state.focusIndicator;

/**
 * The drawer's focus indicator uses the *inner* offset, so the ring is drawn
 * inside the active indicator. Destinations sit at 0dp spacing, so an outer
 * ring would overlap its neighbours.
 */
const itemFocusIndicator = {
  thickness,
  /** Distance from the active indicator edge to the ring's outer edge. */
  inset: -innerOffset,
} as const;

export const DrawerItemTokens = {
  ...itemSizes,
  ...itemShape,
  ...itemTypescale,
  ...itemColors,
  focusIndicator: itemFocusIndicator,
  stateOpacity,
};

/**
 * MD3 navigation drawer headline ("section title") spec. Dividers follow the
 * standalone divider component: the drawer's own divider tokens are deprecated.
 * @see https://m3.material.io/components/navigation-drawer/specs
 * @see https://m3.material.io/components/divider/specs
 */
const sectionSizes = {
  headlineHeight: 56,
  /** Aligns the headline with the destination icons. */
  headlinePadding: 28,
  bottomSpacing: 4,
  dividerSpacing: 4,
} as const;

const sectionTypescale = {
  headlineText: 'titleSmall',
} as const satisfies Record<string, TypescaleKey>;

const sectionColors = {
  headlineColor: 'onSurfaceVariant',
} as const satisfies Record<string, ColorRole>;

export const DrawerSectionTokens = {
  ...sectionSizes,
  ...sectionTypescale,
  ...sectionColors,
};

/**
 * `Drawer.CollapsedItem` renders a navigation *rail* destination, so its
 * values come from the rail spec rather than the drawer's.
 * @see https://m3.material.io/components/navigation-rail/specs
 */
const collapsedItemSizes = {
  containerWidth: 80,
  iconSize: 24,
  activeIndicatorWidth: 56,
  activeIndicatorHeight: 32,
  /** Taller indicator used when the destination has no label. */
  noLabelActiveIndicatorHeight: 56,
  labelSpacing: 4,
  labelPadding: 12,
  containerSpacing: 12,
} as const;

const collapsedItemShape = {
  activeIndicatorShape: 'full',
} as const satisfies Record<string, ShapeToken>;

/** The active indicator settles back to full size when the press is released. */
const collapsedItemMotion = {
  activeIndicatorDuration: 'short3',
  activeIndicatorEasing: 'standard',
} as const satisfies {
  activeIndicatorDuration: keyof MotionDuration;
  activeIndicatorEasing: keyof MotionEasing;
};

const collapsedItemTypescale = {
  labelText: 'labelMedium',
} as const satisfies Record<string, TypescaleKey>;

const collapsedItemColors = {
  activeIndicatorColor: 'secondaryContainer',
  activeIconColor: 'onSecondaryContainer',
  activeLabelTextColor: 'onSurface',
  inactiveIconColor: 'onSurfaceVariant',
  inactiveLabelTextColor: 'onSurfaceVariant',
} as const satisfies Record<string, ColorRole>;

export const DrawerCollapsedItemTokens = {
  ...collapsedItemSizes,
  ...collapsedItemShape,
  ...collapsedItemMotion,
  ...collapsedItemTypescale,
  ...collapsedItemColors,
  stateOpacity,
};
