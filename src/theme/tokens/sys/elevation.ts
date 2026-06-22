// M3 elevation tokens and shadow builder per spec:
// https://m3.material.io/styles/elevation/tokens

import {
  Animated,
  Platform,
  type ColorValue,
  type ViewStyle,
  type Animated as AnimatedNS,
} from 'react-native';

import color from 'color';

import { isAnimatedValue } from '../../../utils/animations';
import type { Elevation, ThemeElevation } from '../../types';

type AnimatedNativeShadowStyle = {
  shadowColor: ColorValue;
  shadowOffset: {
    width: AnimatedNS.Value;
    height: AnimatedNS.AnimatedInterpolation<number>;
  };
  shadowOpacity: AnimatedNS.AnimatedInterpolation<number>;
  shadowRadius: AnimatedNS.AnimatedInterpolation<number>;
};

type AnimatedBoxShadowStyle = {
  boxShadow: AnimatedNS.AnimatedInterpolation<string | number>;
};

type AnimatedShadowStyle = AnimatedNativeShadowStyle | AnimatedBoxShadowStyle;

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

export const SHADOW_OPACITY = 0.3;
// iOS shadowRadius is a Gaussian sigma; CSS blur-radius = 2*sigma.
// Dividing by this factor normalizes the spread to match Web.
export const IOS_SHADOW_RADIUS_FACTOR = 0.5;

export const shadowLayers = [
  {
    shadowOpacity: 0.15,
    height: [0, 1, 2, 4, 6, 8],
    shadowRadius: [0, 3, 6, 8, 10, 12],
  },
  {
    shadowOpacity: SHADOW_OPACITY,
    height: [0, 1, 1, 1, 2, 4],
    shadowRadius: [0, 2, 2, 3, 3, 4],
  },
];

const getShadowColor = (shadowColor: ColorValue, shadowOpacity: number) => {
  if (typeof shadowColor !== 'string') {
    throw new Error(
      `Expected a string shadow color on Web, but received a ${typeof shadowColor}.`
    );
  }

  return color(shadowColor).alpha(shadowOpacity).rgb().string();
};

const getBoxShadowValue = (elevation: number, shadowColor: string) =>
  `0px ${shadowLayers[0].height[elevation]}px ${shadowLayers[0].shadowRadius[elevation]}px ${shadowColor}`;

export function shadow(elevation: number, shadowColor: ColorValue): ViewStyle;
// eslint-disable-next-line no-redeclare
export function shadow(
  elevation: Animated.Value,
  shadowColor: ColorValue
): AnimatedShadowStyle;
// eslint-disable-next-line no-redeclare
export function shadow(
  elevation: number | Animated.Value,
  shadowColor: ColorValue
): ViewStyle | AnimatedShadowStyle;
// eslint-disable-next-line no-redeclare
export function shadow(
  elevation: number | Animated.Value = 0,
  shadowColor: ColorValue
): ViewStyle | AnimatedShadowStyle {
  if (Platform.OS === 'web') {
    const webShadowColor = getShadowColor(shadowColor, SHADOW_OPACITY);

    if (isAnimatedValue(elevation)) {
      return {
        boxShadow: elevation.interpolate({
          inputRange: elevationInputRange,
          outputRange: elevationInputRange.map((value) =>
            getBoxShadowValue(value, webShadowColor)
          ),
        }),
      };
    }

    return {
      boxShadow: getBoxShadowValue(elevation, webShadowColor),
    };
  }

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
        outputRange: [0, SHADOW_OPACITY],
        extrapolate: 'clamp',
      }),
      shadowRadius: elevation.interpolate({
        inputRange: elevationInputRange,
        outputRange: shadowLayers[0].shadowRadius.map(
          (r) => r * IOS_SHADOW_RADIUS_FACTOR
        ),
      }),
    };
  }

  return {
    shadowColor,
    shadowOpacity: elevation ? SHADOW_OPACITY : 0,
    shadowOffset: {
      width: 0,
      height: shadowLayers[0].height[elevation],
    },
    shadowRadius:
      shadowLayers[0].shadowRadius[elevation] * IOS_SHADOW_RADIUS_FACTOR,
  };
}
