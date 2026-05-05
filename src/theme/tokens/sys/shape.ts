import type { ViewStyle } from 'react-native';

import type { ShapeCorners, ThemeShapes } from '../../types';

export const defaultShapes: ThemeShapes = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  largeIncreased: 20,
  extraLarge: 28,
  extraLargeIncreased: 32,
  extraExtraLarge: 48,
  full: 9999,
};

type CornersStyle = Pick<
  ViewStyle,
  | 'borderTopStartRadius'
  | 'borderTopEndRadius'
  | 'borderBottomStartRadius'
  | 'borderBottomEndRadius'
>;

export function cornersToStyle(corners: ShapeCorners): CornersStyle {
  return {
    borderTopStartRadius: corners.topStart,
    borderTopEndRadius: corners.topEnd,
    borderBottomStartRadius: corners.bottomStart,
    borderBottomEndRadius: corners.bottomEnd,
  };
}
