import type { Animated, ViewStyle } from 'react-native';

import type { AppbarTrailingAction, AppbarVariant } from './types';

export const APPBAR_ICON_BUTTON_SIZE = 48;
export const APPBAR_WIDE_ICON_BUTTON_SIZE = 64;
export const APPBAR_HEADLINE_IMAGE_HEIGHT = 32;
export const APPBAR_SEARCH_MAX_WIDTH = 720;

const borderStyleProperties: readonly (keyof ViewStyle)[] = [
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
];

export const getAppbarBorders = (
  style:
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | Animated.WithAnimatedObject<ViewStyle>
) => {
  const borders: Record<string, number> = {};

  for (const property of borderStyleProperties) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const value = style[property as keyof typeof style];
    if (value) {
      borders[property] = value;
    }
  }

  return borders;
};

export const getAppbarHeight = (
  variant: AppbarVariant,
  hasSubtitle: boolean
) => {
  if (variant === 'search' || variant === 'small') {
    return 64;
  }

  if (variant === 'medium-flexible') {
    return hasSubtitle ? 136 : 112;
  }

  return hasSubtitle ? 152 : 120;
};

export const getTrailingActionsWidth = (
  actions: readonly AppbarTrailingAction[]
) =>
  actions.reduce(
    (width, action) =>
      width +
      (action.variant !== 'standard' && action.width === 'wide'
        ? APPBAR_WIDE_ICON_BUTTON_SIZE
        : APPBAR_ICON_BUTTON_SIZE),
    0
  );
