import type { ColorValue } from 'react-native';

import { ToolbarTokens } from './tokens';
import type { ColorScheme, Variant } from './tokens';
import { resolveColors } from './ToolbarColorContext';
import type { Elevation } from '../../theme/types';
import type { InternalTheme } from '../../types';

/** Resolve the container (background) color; an explicit `containerColor` wins over `colorScheme`. */
export const resolveContainerColor = ({
  theme,
  colorScheme,
  containerColor,
}: {
  theme: InternalTheme;
  colorScheme: ColorScheme;
  containerColor?: ColorValue;
}): ColorValue => {
  if (containerColor != null) {
    return containerColor;
  }

  return theme.colors[resolveColors(colorScheme).container];
};

export const resolveElevation = ({
  isDocked,
}: {
  isDocked: boolean;
}): Elevation =>
  isDocked ? ToolbarTokens.elevation.docked : ToolbarTokens.elevation.floating;

/**
 * Leading/trailing padding + inter-item gap for the content row/column,
 * from spec defaults (`contentContainerStyle` can override). `docked`'s
 * content row is a fixed 64dp band (see `Toolbar.tsx`'s `thickness`), so
 * it only pads horizontally to leave room for taller children like a
 * `Button` label; `floating` has no such fixed height, so it pads every
 * side.
 */
export const getSpacing = ({
  variant,
}: {
  variant: Variant;
}): { paddingLeading: number; paddingTrailing: number; gap: number } => {
  const tokens =
    variant === 'docked' ? ToolbarTokens.docked : ToolbarTokens.floating;

  return {
    paddingLeading: tokens.containerLeadingSpace,
    paddingTrailing: tokens.containerTrailingSpace,
    gap: tokens.defaultSpacing,
  };
};
