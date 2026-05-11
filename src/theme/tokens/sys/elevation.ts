// M3 elevation tokens and shadow builder per spec:
// https://m3.material.io/styles/elevation/tokens

import { Animated } from 'react-native';

import { isAnimatedValue } from '../../../utils/animations';
import type { Elevation, ThemeElevation } from '../../types';

export const defaultElevation: ThemeElevation = {
  level0: 0,
  level1: 1,
  level2: 2,
  level3: 3,
  level4: 4,
  level5: 5,
};

export const elevationInputRange: Elevation[] = Object.values(defaultElevation);

export const androidElevationLevels = [0, 1, 3, 6, 8, 12];

export const shadowLayers = [
  {
    shadowOpacity: 0.15,
    height: [0, 1, 2, 4, 6, 8],
    shadowRadius: [0, 3, 6, 8, 10, 12],
  },
  {
    shadowOpacity: 0.3,
    height: [0, 1, 1, 1, 2, 4],
    shadowRadius: [0, 2, 2, 3, 3, 4],
  },
];

export function shadow(
  elevation: number | Animated.Value = 0,
  shadowColor: string
) {
  if (isAnimatedValue(elevation)) {
    return {
      shadowColor,
      shadowOffset: {
        width: new Animated.Value(0),
        height: elevation.interpolate({
          inputRange: elevationInputRange,
          outputRange: shadowLayers[0].height,
        }),
      },
      shadowOpacity: elevation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
        extrapolate: 'clamp',
      }),
      shadowRadius: elevation.interpolate({
        inputRange: elevationInputRange,
        outputRange: shadowLayers[0].shadowRadius,
      }),
    };
  }

  return {
    shadowColor,
    shadowOpacity: elevation ? 0.3 : 0,
    shadowOffset: {
      width: 0,
      height: shadowLayers[0].height[elevation],
    },
    shadowRadius: shadowLayers[0].shadowRadius[elevation],
  };
}
