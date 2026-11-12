import type { ColorValue } from 'react-native';

import { white } from '../../theme/colors';
import type { InternalTheme } from '../../theme/types';

export type AppbarModes =
  | 'small'
  | 'medium'
  | 'large'
  | 'center-aligned'
  | 'medium-flexible'
  | 'large-flexible';

export const APPBAR_HORIZONTAL_PADDING = 4;

// Width of an icon button with its margin.
export const APPBAR_ACTION_WIDTH = 52;

// Height of the row with the controls of a flexible Appbar.
export const APPBAR_FLEXIBLE_CONTROLS_HEIGHT = 56;

export const isFlexibleMode = (mode: AppbarModes) =>
  mode === 'medium-flexible' || mode === 'large-flexible';

export const getAppbarBackgroundColor = (
  theme: InternalTheme,
  elevated: boolean,
  customBackground?: ColorValue
): ColorValue => {
  const { colors } = theme;
  if (customBackground) {
    return customBackground;
  }

  if (elevated) {
    return colors.surfaceContainer;
  }

  return colors.surface;
};

export const getAppbarColor = ({
  color,
  isDark,
}: {
  color?: ColorValue;
  isDark: boolean;
}) => {
  if (typeof color !== 'undefined') {
    return color;
  }

  if (isDark) {
    return white;
  }

  return undefined;
};

export const DEFAULT_APPBAR_HEIGHT = 56;
const MD3_DEFAULT_APPBAR_HEIGHT = 64;

/**
 * Height of the content area of the Appbar, without the safe area insets.
 * The flexible modes use it as the minimum height.
 */
export const modeAppbarHeight = {
  small: MD3_DEFAULT_APPBAR_HEIGHT,
  medium: 112,
  large: 152,
  'center-aligned': MD3_DEFAULT_APPBAR_HEIGHT,
  'medium-flexible': 112,
  'large-flexible': 120,
};

export const modeTextVariant = {
  small: 'titleLarge',
  medium: 'headlineSmall',
  large: 'headlineMedium',
  'center-aligned': 'titleLarge',
  'medium-flexible': 'headlineMedium',
  'large-flexible': 'displaySmall',
} as const;
