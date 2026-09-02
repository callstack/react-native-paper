import { tokens } from '../../theme/tokens';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ColorRole } from '../../theme/types';

const stateTokens = tokens.md.sys.state;

const sizes = {
  containerHeight: {
    regular: 40,
    small: 36,
    medium: 32,
    high: 28,
  } as const satisfies Record<'regular' | 'small' | 'medium' | 'high', number>,
  horizontalPadding: 12,
  iconSize: 18,
  iconLabelGap: 8,
  outlineWidth: 1,
  containerShape: cornerFull,
  labelTextType: 'labelLarge',
  disabledLabelTextOpacity: stateTokens.opacity.disabled,
  disabledIconOpacity: stateTokens.opacity.disabled,
  disabledOutlineOpacity: 0.12,
  focusIndicatorThickness: stateTokens.focusIndicator.thickness,
  focusIndicatorOutlineOffset: stateTokens.focusIndicator.outerOffset,
} as const;

const baseColors = {
  selectedContainerColor: 'secondaryContainer',
  outlineColor: 'outline',
  disabledOutlineColor: 'onSurface',
  disabledLabelTextColor: 'onSurface',
  disabledIconColor: 'onSurface',
  focusIndicatorColor: 'secondary',
} as const satisfies Record<string, ColorRole>;

const contentColors = {
  selectedLabelTextColor: 'onSecondaryContainer',
  unselectedLabelTextColor: 'onSurface',
  selectedIconColor: 'onSecondaryContainer',
  unselectedIconColor: 'onSurface',
} as const satisfies Record<
  | 'selectedLabelTextColor'
  | 'unselectedLabelTextColor'
  | 'selectedIconColor'
  | 'unselectedIconColor',
  ColorRole
>;

export const SegmentedButtonTokens = {
  ...sizes,
  ...baseColors,
  ...contentColors,
};

export const FOCUS_RING_OUTSET =
  SegmentedButtonTokens.focusIndicatorThickness +
  SegmentedButtonTokens.focusIndicatorOutlineOffset;
