import type { ColorValue } from 'react-native';

import type { Theme } from '../types';

/**
 * Resolve the on-color (content color) that pairs with a given background
 * role from the theme's color scheme.
 *
 * If `background` does not match any known role color (e.g. an arbitrary hex
 * value), falls back to `onSurface`.
 *
 * @example
 *   const fg = contentColorFor(theme, theme.colors.primaryContainer);
 *   // theme.colors.onPrimaryContainer
 */
export function contentColorFor(
  theme: Theme,
  background: ColorValue
): ColorValue {
  const c = theme.colors;

  switch (background) {
    case c.primary:
      return c.onPrimary;
    case c.secondary:
      return c.onSecondary;
    case c.tertiary:
      return c.onTertiary;
    case c.background:
      return c.onBackground;
    case c.error:
      return c.onError;
    case c.primaryContainer:
      return c.onPrimaryContainer;
    case c.secondaryContainer:
      return c.onSecondaryContainer;
    case c.tertiaryContainer:
      return c.onTertiaryContainer;
    case c.errorContainer:
      return c.onErrorContainer;
    case c.inverseSurface:
      return c.inverseOnSurface;
    case c.surfaceVariant:
      return c.onSurfaceVariant;
    case c.surface:
    case c.surfaceBright:
    case c.surfaceDim:
    case c.surfaceContainerLowest:
    case c.surfaceContainerLow:
    case c.surfaceContainer:
    case c.surfaceContainerHigh:
    case c.surfaceContainerHighest:
      return c.onSurface;
    case c.primaryFixed:
    case c.primaryFixedDim:
      return c.onPrimaryFixed;
    case c.secondaryFixed:
    case c.secondaryFixedDim:
      return c.onSecondaryFixed;
    case c.tertiaryFixed:
    case c.tertiaryFixedDim:
      return c.onTertiaryFixed;
    default:
      return c.onSurface;
  }
}
