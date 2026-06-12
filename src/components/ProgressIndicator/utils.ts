import type { ColorValue } from 'react-native';

import type { InternalTheme } from '../../types';

export type ProgressIndicatorColors = {
  activeColor: ColorValue;
  trackColor: ColorValue;
  stopColor: ColorValue;
};

/**
 * Resolves the colors shared by every progress indicator. A passed `color` / `trackColor`
 * wins; otherwise the default MD3 roles apply: `primary` for the active and stop parts,
 * `secondaryContainer` for the track.
 */
export const getProgressIndicatorColors = ({
  theme,
  color,
  trackColor,
}: {
  theme: InternalTheme;
  color?: ColorValue;
  trackColor?: ColorValue;
}): ProgressIndicatorColors => {
  const activeColor = color || theme.colors.primary;
  return {
    activeColor,
    trackColor: trackColor || theme.colors.secondaryContainer,
    stopColor: activeColor,
  };
};
