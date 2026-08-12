import * as React from 'react';
import type { ColorValue } from 'react-native';

import { ToolbarTokens } from './tokens';
import type { ColorScheme, Variant } from './tokens';
import type { Elevation } from '../../theme/types';
import type { InternalTheme } from '../../types';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';

const resolveColors = (colorScheme: ColorScheme) =>
  colorScheme === 'vibrant'
    ? ToolbarTokens.vibrantColors
    : ToolbarTokens.standardColors;

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

type RecolorableProps = {
  children?: React.ReactNode;
  mode?: unknown;
  selected?: boolean;
  iconColor?: ColorValue;
  containerColor?: ColorValue;
  textColor?: ColorValue;
  buttonColor?: ColorValue;
};

const recolorChildren = (
  children: React.ReactNode,
  theme: InternalTheme,
  colorScheme: ColorScheme
): React.ReactNode =>
  React.Children.map(children, (child) => {
    if (!React.isValidElement<RecolorableProps>(child)) {
      return child;
    }

    // `React.Children.map` doesn't flatten a `Fragment`, so recurse into
    // it manually.
    if (child.type === React.Fragment) {
      return React.cloneElement(
        child,
        undefined,
        recolorChildren(child.props.children, theme, colorScheme)
      );
    }

    if (child.type === IconButton) {
      // A `mode` or explicit color prop means it already has its own
      // spec-defined coloring.
      if (
        child.props.mode != null ||
        child.props.iconColor != null ||
        child.props.containerColor != null
      ) {
        return child;
      }

      const { iconColor, containerColor } = resolveIconColors({
        theme,
        colorScheme,
        selected: child.props.selected ?? false,
      });
      return React.cloneElement(child, {
        iconColor,
        containerColor,
        ...(child.props.selected ? { mode: 'contained-tonal' } : null),
      });
    }

    if (child.type === Button) {
      // `text` is `Button`'s mode-less default; any other mode (its own
      // spec-defined coloring) or an explicit color prop opts it out.
      if (
        (child.props.mode != null && child.props.mode !== 'text') ||
        child.props.textColor != null ||
        child.props.buttonColor != null
      ) {
        return child;
      }

      const textColor = resolveLabelColor({ theme, colorScheme });
      return React.cloneElement(child, { textColor });
    }

    return child;
  });

/**
 * Recolors every direct (including Fragment-nested), mode-less
 * `IconButton`/`Button` child per `colorScheme`.
 */
export const withToolbarChildColors = ({
  children,
  theme,
  colorScheme,
}: {
  children: React.ReactNode;
  theme: InternalTheme;
  colorScheme: ColorScheme;
}): React.ReactNode => recolorChildren(children, theme, colorScheme);

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
