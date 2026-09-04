import type { ColorValue } from 'react-native';

import { white } from '../../theme/colors';
import { contentColorFor } from '../../theme/utils/color';
import type { InternalTheme } from '../../types';
import getContrastingColor from '../../utils/getContrastingColor';

export const DEFAULT_SIZE = 64;
export const ICON_SIZE_RATIO = 0.6;

export type ResolvedAvatarColors = {
  background: ColorValue;
  textColor: ColorValue;
};

/**
 * Resolve background and content colors for an avatar.
 *
 * - No custom background → MD3 container pair (primaryContainer /
 *   onPrimaryContainer).
 * - Explicit `color` wins.
 * - String custom backgrounds keep the luminance heuristic (arbitrary
 *   per-user colors have no on- role).
 * - Opaque custom values (`PlatformColor` / `DynamicColorIOS`) go through
 *   `contentColorFor`: a theme-role token pairs with its on-color; anything
 *   else falls back to `onSurface`. Pass `color` when that fallback is not
 *   appropriate.
 */
export const resolveAvatarColors = ({
  theme,
  backgroundColor,
  color,
}: {
  theme: InternalTheme;
  backgroundColor?: ColorValue;
  color?: ColorValue;
}): ResolvedAvatarColors => {
  const usingDefault = backgroundColor == null;
  const background = backgroundColor ?? theme.colors.primaryContainer;

  if (color != null) {
    return { background, textColor: color };
  }

  if (usingDefault) {
    return { background, textColor: theme.colors.onPrimaryContainer };
  }

  if (typeof background === 'string') {
    return {
      background,
      textColor: getContrastingColor(background, white, 'rgba(0, 0, 0, .54)'),
    };
  }

  return { background, textColor: contentColorFor(theme, background) };
};

/**
 * Identity for retrying a failed avatar image.
 * Function sources are keyed stably so inline renderers do not reset state.
 */
export const getAvatarImageSourceKey = (source: unknown) => {
  if (typeof source === 'function') {
    return 'function';
  }

  if (
    source &&
    typeof source === 'object' &&
    !Array.isArray(source) &&
    'uri' in source
  ) {
    return source.uri;
  }

  return source;
};
