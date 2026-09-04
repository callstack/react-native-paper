import { tokens as systemTokens } from '../../theme/tokens';
import type { Elevation, InternalTheme } from '../../theme/types';

export const cardVariants = ['filled', 'elevated', 'outlined'] as const;

export type CardVariant = (typeof cardVariants)[number];

export const cardStates = [
  'enabled',
  'hovered',
  'focused',
  'pressed',
  'dragged',
  'disabled',
] as const;

export type CardState = (typeof cardStates)[number];

type ContainerColorRole =
  | 'surfaceContainerLow'
  | 'surfaceContainerHighest'
  | 'surfaceVariant'
  | 'surface';

type OutlineColorRole = 'outlineVariant' | 'onSurface' | 'outline';

type CardStateTokens = {
  containerColor: ContainerColorRole;
  containerOpacity: number;
  outlineColor: OutlineColorRole;
  outlineOpacity: number;
  outlineWidth: 0 | 1;
  elevation: Elevation;
  stateLayerOpacity: number;
};

type CardTokenMatrix = Record<CardVariant, Record<CardState, CardStateTokens>>;

const { opacity } = systemTokens.md.sys.state;

/**
 * Material 3 Card variant-by-state tokens.
 *
 * Rechecked 2026-09-04 against the Material 3 Card specification and the
 * current AndroidX generated Card tokens at commit
 * 160825094a81825468a95b115bfb1b541e549856:
 * https://m3.material.io/components/cards/specs
 * - FilledCardTokens v0_210
 * - ElevatedCardTokens v0_210
 * - OutlinedCardTokens v0_192
 * https://github.com/androidx/androidx/tree/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens
 *
 * State opacities were rechecked against Material Components Android generated
 * token set 34.0.0 at commit 4d3710682140722f48a5965b68109b240e1fe79e.
 * https://github.com/material-components/material-components-android/tree/4d3710682140722f48a5965b68109b240e1fe79e/lib/java/com/google/android/material
 */
const cardTokenMatrix = {
  filled: {
    enabled: {
      containerColor: 'surfaceContainerHighest',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 0,
      stateLayerOpacity: 0,
    },
    hovered: {
      containerColor: 'surfaceContainerHighest',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 1,
      stateLayerOpacity: opacity.hovered,
    },
    focused: {
      containerColor: 'surfaceContainerHighest',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 0,
      stateLayerOpacity: opacity.focused,
    },
    pressed: {
      containerColor: 'surfaceContainerHighest',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 0,
      stateLayerOpacity: opacity.pressed,
    },
    dragged: {
      containerColor: 'surfaceContainerHighest',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 3,
      stateLayerOpacity: opacity.dragged,
    },
    disabled: {
      containerColor: 'surfaceVariant',
      containerOpacity: opacity.disabled,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 0,
      stateLayerOpacity: 0,
    },
  },
  elevated: {
    enabled: {
      containerColor: 'surfaceContainerLow',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 1,
      stateLayerOpacity: 0,
    },
    hovered: {
      containerColor: 'surfaceContainerLow',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 2,
      stateLayerOpacity: opacity.hovered,
    },
    focused: {
      containerColor: 'surfaceContainerLow',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 1,
      stateLayerOpacity: opacity.focused,
    },
    pressed: {
      containerColor: 'surfaceContainerLow',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 1,
      stateLayerOpacity: opacity.pressed,
    },
    dragged: {
      containerColor: 'surfaceContainerLow',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 4,
      stateLayerOpacity: opacity.dragged,
    },
    disabled: {
      containerColor: 'surface',
      containerOpacity: opacity.disabled,
      outlineColor: 'outlineVariant',
      outlineOpacity: 0,
      outlineWidth: 0,
      elevation: 1,
      stateLayerOpacity: 0,
    },
  },
  outlined: {
    enabled: {
      containerColor: 'surface',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 1,
      outlineWidth: 1,
      elevation: 0,
      stateLayerOpacity: 0,
    },
    hovered: {
      containerColor: 'surface',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 1,
      outlineWidth: 1,
      elevation: 1,
      stateLayerOpacity: opacity.hovered,
    },
    focused: {
      containerColor: 'surface',
      containerOpacity: 1,
      outlineColor: 'onSurface',
      outlineOpacity: 1,
      outlineWidth: 1,
      elevation: 0,
      stateLayerOpacity: opacity.focused,
    },
    pressed: {
      containerColor: 'surface',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 1,
      outlineWidth: 1,
      elevation: 0,
      stateLayerOpacity: opacity.pressed,
    },
    dragged: {
      containerColor: 'surface',
      containerOpacity: 1,
      outlineColor: 'outlineVariant',
      outlineOpacity: 1,
      outlineWidth: 1,
      elevation: 3,
      stateLayerOpacity: opacity.dragged,
    },
    disabled: {
      containerColor: 'surface',
      containerOpacity: 1,
      outlineColor: 'outline',
      outlineOpacity: 0.12,
      outlineWidth: 1,
      elevation: 0,
      stateLayerOpacity: 0,
    },
  },
} as const satisfies CardTokenMatrix;

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

export const resolveCardVisuals = ({
  theme,
  variant,
  elevation: customElevation,
  disabled = false,
  dragged = false,
  pressed = false,
  focused = false,
  hovered = false,
}: ResolveCardVisualsOptions) => {
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
  const stateTokens = cardTokenMatrix[variant][state];

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
  };
};
