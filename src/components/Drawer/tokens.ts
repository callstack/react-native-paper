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

const itemSizes = {
  height: 56,
  iconSize: 24,
  indicatorInset: 12,
  contentInset: 16,
  iconLabelGap: 12,
  labelTrailingGap: 32,
} as const satisfies Record<string, number>;

const itemShape = {
  indicatorShape: 'full',
} as const satisfies Record<string, ShapeToken>;

const itemTypescale = {
  labelText: 'labelLarge',
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

const itemFocusIndicator = {
  thickness,
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

const sectionSizes = {
  headlineHeight: 56,
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

const collapsedItemSizes = {
  containerWidth: 80,
  iconSize: 24,
  activeIndicatorWidth: 56,
  activeIndicatorHeight: 32,
  noLabelActiveIndicatorHeight: 56,
  labelSpacing: 4,
  labelPadding: 12,
  containerSpacing: 12,
} as const;

const collapsedItemShape = {
  activeIndicatorShape: 'full',
} as const satisfies Record<string, ShapeToken>;

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
