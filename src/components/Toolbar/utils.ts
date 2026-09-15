import type { ColorValue } from 'react-native';

import { ToolbarTokens } from './tokens';
import type { ColorScheme, Variant } from './tokens';
import { resolveColors } from './ToolbarColorContext';
import type { Elevation } from '../../theme/types';
import type { InternalTheme } from '../../theme/types';

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
 * content row is a fixed band (see `Toolbar.tsx`'s `thickness`), so
 * it only pads horizontally to leave room for taller children like a
 * `Button` label; `floating` has no such fixed height, so it pads every
 * side.
 */
export const getSpacing = ({
  variant,
}: {
  variant: Variant;
}): {
  paddingLeading: number;
  paddingTrailing: number;
  paddingTop: number;
  paddingBottom: number;
  gap: number;
} => {
  if (variant === 'docked') {
    const tokens = ToolbarTokens.docked;
    return {
      paddingLeading: tokens.containerLeadingSpace,
      paddingTrailing: tokens.containerTrailingSpace,
      paddingTop: 0,
      paddingBottom: 0,
      gap: tokens.defaultSpacing,
    };
  }

  const tokens = ToolbarTokens.floating;
  return {
    paddingLeading: tokens.containerLeadingSpace,
    paddingTrailing: tokens.containerTrailingSpace,
    paddingTop: tokens.containerTopSpace,
    paddingBottom: tokens.containerBottomSpace,
    gap: tokens.defaultSpacing,
  };
};
