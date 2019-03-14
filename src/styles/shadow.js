/* @flow */

import * as Colors from './colors';
import { Animated } from 'react-native';

function getRadius(elevation: ?number) {
  let radius = 0;

  switch (elevation) {
    case 1:
      radius = 0.75;
      break;
    case 2:
      radius = 1.5;
      break;
    default:
      radius = elevation;
  }

  return radius;
}

export default function shadow(elevation: ?number | Animated.Value) {
  const animatedElevation: Animated.Value =
    elevation instanceof Animated.Value
      ? elevation
      : new Animated.Value(elevation || 0);
  const inputRange = [0, 1, 2, 3, 8, 24];

  // We need to return Animated properties to ensure they are properly used in the Animated.View
  const shadowOpacity = new Animated.Value(0.24);

  // We cannot used strings in Animated.Value and hence we need to interpolate something
  const shadowColor = animatedElevation.interpolate({
    inputRange,
    outputRange: inputRange.map(() => Colors.black),
  });

  // Width and height are required to be numbers on web (i.e. not undefined)
  const width = animatedElevation.interpolate({
    inputRange,
    outputRange: [0, 0, 0, 0, 0, 0],
  });
  const height = animatedElevation.interpolate({
    inputRange,
    outputRange: [0, 0, 0, 0, 0, 0],
  });

  // Calculate radius based on elevation
  const shadowRadius = animatedElevation.interpolate({
    inputRange,
    outputRange: inputRange.map(getRadius),
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
