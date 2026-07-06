import { Animated } from 'react-native';
import type { ColorValue, ViewStyle } from 'react-native';

import type { InternalTheme, Theme } from '../../types';

export type AppbarModes = 'small' | 'medium' | 'large' | 'center-aligned';

export type AppbarChildProps = {
  isLeading?: boolean;
};

const borderStyleProperties = [
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
];

export const getAppbarBackgroundColor = (
  theme: InternalTheme,
  _elevation: number,
  customBackground?: ColorValue,
  elevated?: boolean
) => {
  const { colors } = theme as Theme;
  if (customBackground) {
    return customBackground;
  }

  if (elevated) {
    return colors.surfaceContainer;
  }

  return colors.surface;
};

export const getAppbarBorders = (
  style:
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | Animated.WithAnimatedObject<ViewStyle>
) => {
  const borders: Record<string, number> = {};

  for (const property of borderStyleProperties) {
    const value = style[property as keyof typeof style];
    if (value) {
      borders[property] = value;
    }
  }

  return borders;
};

export const DEFAULT_APPBAR_HEIGHT = 56;
const MD3_DEFAULT_APPBAR_HEIGHT = 64;

export const modeAppbarHeight = {
  small: MD3_DEFAULT_APPBAR_HEIGHT,
  medium: 112,
  large: 152,
  'center-aligned': MD3_DEFAULT_APPBAR_HEIGHT,
};

export const modeTextVariant = {
  small: 'titleLarge',
  medium: 'headlineSmall',
  large: 'headlineMedium',
  'center-aligned': 'titleLarge',
} as const;
