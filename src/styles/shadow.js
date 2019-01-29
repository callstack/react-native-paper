/* @flow */

import * as Colors from './colors';
import { Animated } from 'react-native';

export default function shadow(elevation: number | Animated.Value) {
  let height, radius;

  if (elevation instanceof Animated.Value) {
    height = elevation.interpolate({
      inputRange: [0, 1, 2, 3, 8, 24],
      outputRange: [0, 0.5, 0.75, 2, 7, 23],
    });

    radius = elevation.interpolate({
      inputRange: [0, 1, 2, 3, 8, 24],
      outputRange: [0, 0.75, 1.5, 3, 8, 24],
    });
  } else {
    switch (elevation) {
      case 1:
        height = 0.5;
        radius = 0.75;
        break;
      case 2:
        height = 0.75;
        radius = 1.5;
        break;
      default:
        height = elevation - 1;
        radius = elevation;
    }
  }

  return {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height,
    },
    shadowOpacity: 0.24,
    shadowRadius: radius,
  };
}
