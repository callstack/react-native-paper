import type { ColorValue } from 'react-native';

import { white } from '../../theme/colors';
import { contentColorFor } from '../../theme/utils/color';
import type { InternalTheme } from '../../types';
import getContrastingColor from '../../utils/getContrastingColor';

export type ResolvedAvatarColors = {
  background: ColorValue;
  textColor: ColorValue;
};

/**
 * Resolve background and content colors for an avatar.
 *
 * - Explicit `color` wins.
 * - String backgrounds keep the luminance heuristic (including string theme
 *   tokens such as `theme.colors.primary` in the static schemes).
 * - Opaque values (`PlatformColor` / `DynamicColorIOS`) go through
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
  const background = backgroundColor ?? theme.colors.primary;

  if (color != null) {
    return { background, textColor: color };
  }

  if (typeof background === 'string') {
    return {
      background,
      textColor: getContrastingColor(background, white, 'rgba(0, 0, 0, .54)'),
    };
  }

  return { background, textColor: contentColorFor(theme, background) };
};
