import { tokens } from '../../theme/tokens';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ColorRole } from '../../theme/types';

export type SegmentedButtonInteractionState =
  | 'enabled'
  | 'hovered'
  | 'focused'
  | 'pressed';

type ActiveInteractionState = Exclude<
  SegmentedButtonInteractionState,
  'enabled'
>;

const stateTokens = tokens.md.sys.state;

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
  containerShape: cornerFull,
  labelTextType: 'labelLarge',
  disabledLabelTextOpacity: stateTokens.opacity.disabled,
  disabledIconOpacity: stateTokens.opacity.disabled,
  disabledOutlineOpacity: 0.12,
  stateLayerOpacity: {
    hovered: stateTokens.opacity.hovered,
    focused: stateTokens.opacity.focused,
    pressed: stateTokens.opacity.pressed,
  } as const satisfies Record<ActiveInteractionState, number>,
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
  selectedLabelTextColor: {
    enabled: 'onSecondaryContainer',
    hovered: 'onSecondaryContainer',
    focused: 'onSecondaryContainer',
    pressed: 'onSecondaryContainer',
  },
  unselectedLabelTextColor: {
    enabled: 'onSurface',
    hovered: 'onSurface',
    focused: 'onSurface',
    pressed: 'onSurface',
  },
  selectedIconColor: {
    enabled: 'onSecondaryContainer',
    hovered: 'onSecondaryContainer',
    focused: 'onSecondaryContainer',
    pressed: 'onSecondaryContainer',
  },
  unselectedIconColor: {
    enabled: 'onSurface',
    hovered: 'onSurface',
    focused: 'onSurface',
    pressed: 'onSurface',
  },
} as const satisfies Record<
  | 'selectedLabelTextColor'
  | 'unselectedLabelTextColor'
  | 'selectedIconColor'
  | 'unselectedIconColor',
  Record<SegmentedButtonInteractionState, ColorRole>
>;

const stateLayerColors = {
  selectedStateLayerColor: {
    hovered: 'onSecondaryContainer',
    focused: 'onSecondaryContainer',
    pressed: 'onSecondaryContainer',
  },
  unselectedStateLayerColor: {
    hovered: 'onSurface',
    focused: 'onSurface',
    pressed: 'onSurface',
  },
} as const satisfies Record<
  'selectedStateLayerColor' | 'unselectedStateLayerColor',
  Record<ActiveInteractionState, ColorRole>
>;

export const SegmentedButtonTokens = {
  ...sizes,
  ...baseColors,
  ...contentColors,
  ...stateLayerColors,
};

export const FOCUS_RING_OUTSET =
  SegmentedButtonTokens.focusIndicatorThickness +
  SegmentedButtonTokens.focusIndicatorOutlineOffset;
