/* @flow */

import * as Colors from './colors';
import { Animated } from 'react-native';

export default function shadow(elevation: number | Animated.Value) {
  let height, radius, width;

  if (elevation instanceof Animated.Value) {
    width = elevation.interpolate({
      inputRange: [0, 1, 2, 3, 8, 24],
      outputRange: [0, 0, 0, 0, 0, 0],
    });

    height = elevation.interpolate({
      inputRange: [0, 1, 2, 3, 8, 24],
      outputRange: [0, 0, 0, 0, 0, 0],
    });

    radius = elevation.interpolate({
      inputRange: [0, 1, 2, 3, 8, 24],
      outputRange: [0, 0.75, 1.5, 3, 8, 24],
    });
  } else {
    width = 0;
    height = 0;

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
  }

  return {
    shadowColor: Colors.black,
    shadowOffset: {
      width,
      height,
    },
    shadowOpacity: 0.24,
    shadowRadius: radius,
  };
}
