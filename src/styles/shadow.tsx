import * as Colors from './colors';
import { Animated } from 'react-native';

export default function shadow(elevation: number | Animated.Value = 0) {
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

  return {
    shadowColor: Colors.black,
    shadowOffset: {
      width,
      height,
    } as unknown,
    shadowOpacity: shadowOpacity as unknown,
    shadowRadius: shadowRadius as unknown,
  };
}
