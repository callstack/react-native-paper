import type { AccessibilityRole, ColorValue } from 'react-native';

import type { AvatarImageSource } from './AvatarImage';
import { white } from '../../theme/colors';
import type { InternalTheme } from '../../theme/types';
import { contentColorFor } from '../../theme/utils/color';
import getContrastingColor from '../../utils/getContrastingColor';

export const DEFAULT_SIZE = 64;
export const ICON_SIZE_RATIO = 0.6;

let hasWarnedUnresolvedBackground = false;

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
 *   else falls back to white and warns once in development, because its
 *   contrast cannot be checked. Pass `color` for such backgrounds.
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

  if (Object.values(theme.colors).includes(background)) {
    return { background, textColor: contentColorFor(theme, background) };
  }

  if (process.env.NODE_ENV !== 'production' && !hasWarnedUnresolvedBackground) {
    hasWarnedUnresolvedBackground = true;
    console.warn(
      'Avatar: the custom backgroundColor is a dynamic color that is not in the theme, so its contrast cannot be checked. Pass `color` to set a readable content color.'
    );
  }

  return { background, textColor: white };
};

/**
 * `role="img"` for a labelled avatar, because web does not expose a name on
 * an element without a role. `role` wins over `accessibilityRole`, so a
 * custom `accessibilityRole` is kept.
 */
export const getAvatarRole = (accessibilityRole?: AccessibilityRole) =>
  accessibilityRole === undefined ? { role: 'img' as const } : {};

/**
 * Identity for retrying a failed avatar image.
 * Function sources use `sourceKey`, or one stable key without it, so inline
 * renderers do not reset state.
 */
export const getAvatarImageSourceKey = (
  source: AvatarImageSource,
  sourceKey?: string | number
) => {
  if (typeof source === 'function') {
    return sourceKey ?? 'function';
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
