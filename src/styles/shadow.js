/* @flow */

import * as Colors from './colors';
import { Animated } from 'react-native';

type Shadow = {
  shadowColor: Animated.Interpolation,
  shadowOffset: {
    width: Animated.Value,
    height: Animated.Interpolation,
  },
  shadowOpacity: Animated.Value,
  shadowRadius: Animated.Interpolation,
};

export default function shadow(elevation: ?number | Animated.Value): Shadow {
  const animatedElevation: Animated.Value =
    elevation instanceof Animated.Value
      ? elevation
      : new Animated.Value(elevation || 0);
  const inputRange = [0, 1, 2, 3, 8, 24];

  // Important: we need to return Animated values to ensure they are properly used in the Animated.View
  const shadowOpacity = new Animated.Value(0.24);
  const width = new Animated.Value(0);
  const height = animatedElevation.interpolate({
    inputRange,
    outputRange: [0, 0.5, 0.75, 2, 7, 23],
  });
  const shadowRadius = animatedElevation.interpolate({
    inputRange,
    outputRange: [0, 0.75, 1.5, 3, 8, 24],
  });

  // We cannot use strings in Animated.Value
  // Hence we need to interpolate all inputs to the same color
  const shadowColor = animatedElevation.interpolate({
    inputRange,
    outputRange: inputRange.map(() => Colors.black),
  });

  return {
    shadowColor,
    shadowOffset: {
      width,
      height,
    },
    shadowOpacity,
    shadowRadius,
  };
}
