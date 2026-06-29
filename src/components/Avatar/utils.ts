import type { ColorValue } from 'react-native';

import { white } from '../../theme/colors';
import type { InternalTheme } from '../../types';
import getContrastingColor from '../../utils/getContrastingColor';

export const DEFAULT_SIZE = 64;
export const ICON_SIZE_RATIO = 0.6;

/**
 * Resolve background and content colors for an avatar.
 * - No custom background → MD3 container pair (primaryContainer / onPrimaryContainer).
 * - Custom background → keep luminance-based contrast so arbitrary per-user
 *   colors stay legible (contentColorFor only handles known theme roles).
 */
export const resolveAvatarColors = ({
  theme,
  backgroundColor,
  color,
}: {
  theme: InternalTheme;
  backgroundColor?: ColorValue;
  color?: string;
}) => {
  const usingDefault = backgroundColor == null;
  const background = backgroundColor ?? theme.colors.primaryContainer;
  const textColor =
    color ??
    (usingDefault
      ? theme.colors.onPrimaryContainer
      : getContrastingColor(background, white, 'rgba(0, 0, 0, .54)'));
  return { background, textColor };
};
