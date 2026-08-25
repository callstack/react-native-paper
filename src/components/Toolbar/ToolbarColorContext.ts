import * as React from 'react';
import type { ColorValue } from 'react-native';

import { ToolbarTokens } from './tokens';
import type { ColorScheme } from './tokens';
import type { InternalTheme } from '../../types';

export const resolveColors = (colorScheme: ColorScheme) =>
  colorScheme === 'vibrant'
    ? ToolbarTokens.vibrantColors
    : ToolbarTokens.standardColors;

/**
 * Resolve an `IconButton`'s icon color and, if `selected`, its container
 * color. Unselected has no container override, it's the same role as the
 * toolbar's own background, so it just blends in.
 */
export const resolveIconColors = ({
  theme,
  colorScheme,
  selected,
}: {
  theme: InternalTheme;
  colorScheme: ColorScheme;
  selected: boolean;
}): { iconColor: ColorValue; containerColor?: ColorValue } => {
  const roles = resolveColors(colorScheme);

  return selected
    ? {
        iconColor: theme.colors[roles.selectedIcon],
        containerColor: theme.colors[roles.selectedButtonContainer],
      }
    : { iconColor: theme.colors[roles.icon] };
};

/** Resolve a `Button` child's label color (`Button` has no `selected` state, so there's just one). */
export const resolveLabelColor = ({
  theme,
  colorScheme,
}: {
  theme: InternalTheme;
  colorScheme: ColorScheme;
}): ColorValue => theme.colors[resolveColors(colorScheme).label];

export type ToolbarColorContextValue = {
  theme: InternalTheme;
  colorScheme: ColorScheme;
};

/**
 * Lets a mode-less `IconButton`/`Button` pick up the enclosing `Toolbar`'s
 * `colorScheme` (e.g. `vibrant`) without it being passed down explicitly.
 */
export const ToolbarColorContext =
  React.createContext<ToolbarColorContextValue | null>(null);
