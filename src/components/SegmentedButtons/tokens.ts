import type { ColorRole } from '../../theme/types';

const sizes = {
  containerHeight: {
    regular: 40,
    small: 36,
    medium: 32,
    high: 28,
  } as const satisfies Record<'regular' | 'small' | 'medium' | 'high', number>,
  touchTargetHeight: 48,
  minimumWidth: 48,
  horizontalPadding: 12,
  iconSize: 18,
  iconLabelGap: 8,
  outlineWidth: 1,
  disabledContentOpacity: 0.38,
  disabledOutlineOpacity: 0.12,
} as const;

const colors = {
  selectedContainerColor: 'secondaryContainer',
  selectedContentColor: 'onSecondaryContainerVariant',
  unselectedContentColor: 'onSurface',
  outlineColor: 'outline',
  disabledContentColor: 'onSurface',
  disabledOutlineColor: 'onSurface',
  selectedStateLayerColor: 'onSecondaryContainerVariant',
  unselectedStateLayerColor: 'onSurface',
  focusIndicatorColor: 'secondary',
} as const satisfies Record<string, ColorRole>;

export const SegmentedButtonTokens = { ...sizes, ...colors };
