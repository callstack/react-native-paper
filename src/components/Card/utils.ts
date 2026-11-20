import type { ColorValue } from 'react-native';

import { CardTokens } from './tokens';
import type { CardState, CardVariant } from './tokens';
import { tokens as systemTokens } from '../../theme/tokens';
import type { Elevation, InternalTheme } from '../../theme/types';

const { opacity } = systemTokens.md.sys.state;

export type CardStateFlags = {
  disabled?: boolean;
  dragged?: boolean;
  pressed?: boolean;
  focused?: boolean;
  hovered?: boolean;
};

export type ResolveCardVisualsOptions = CardStateFlags & {
  theme: InternalTheme;
  variant: CardVariant;
  elevation?: Elevation;
};

export type CardVisuals = {
  state: CardState;
  containerColor: ColorValue;
  containerOpacity: number;
  outlineColor: ColorValue;
  outlineOpacity: number;
  outlineWidth: 0 | 1;
  elevation: Elevation;
  shape: number;
  stateLayerColor: ColorValue;
  stateLayerOpacity: number;
  contentOpacity: number;
};

export const resolveCardVisuals = ({
  theme,
  variant,
  elevation: customElevation,
  disabled = false,
  dragged = false,
  pressed = false,
  focused = false,
  hovered = false,
}: ResolveCardVisualsOptions): CardVisuals => {
  const state: CardState = disabled
    ? 'disabled'
    : dragged
      ? 'dragged'
      : pressed
        ? 'pressed'
        : focused
          ? 'focused'
          : hovered
            ? 'hovered'
            : 'enabled';
  const stateTokens = CardTokens[variant][state];

  return {
    state,
    containerColor: theme.colors[stateTokens.containerColor],
    containerOpacity: stateTokens.containerOpacity,
    outlineColor: theme.colors[stateTokens.outlineColor],
    outlineOpacity: stateTokens.outlineOpacity,
    outlineWidth: stateTokens.outlineWidth,
    elevation:
      variant === 'elevated' && state === 'enabled' && customElevation != null
        ? customElevation
        : stateTokens.elevation,
    shape: theme.shapes.corner.medium,
    stateLayerColor: theme.colors.onSurface,
    stateLayerOpacity: stateTokens.stateLayerOpacity,
    // Compose dims disabled Card content to the content color at 38%.
    contentOpacity: state === 'disabled' ? opacity.disabled : 1,
  };
};
