import type { InternalTheme } from '../../theme/types';

export const DEFAULT_SIZE = 64;
export const ICON_SIZE_RATIO = 0.6;

/**
 * Resolve background and content colors for an avatar.
 */
export const resolveAvatarColors = ({
  theme,
  color,
}: {
  theme: InternalTheme;
  color?: string;
}) => {
  const background = theme.colors.primaryContainer;
  const textColor = color ?? theme.colors.onPrimaryContainer;

  return { background, textColor };
};
