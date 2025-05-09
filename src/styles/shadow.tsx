import { Animated } from 'react-native';

import { MD3Colors } from './themes/v3/tokens';

const MD3_SHADOW_OPACITY = 0.3;
const MD3_SHADOW_COLOR = MD3Colors.primary0;

export default function shadow(elevation: number | Animated.Value = 0) {
  return v3Shadow(elevation);
}

function v3Shadow(elevation: number | Animated.Value = 0) {
  const inputRange = [0, 1, 2, 3, 4, 5];
  const shadowHeight = [0, 1, 2, 4, 6, 8];
  const shadowRadius = [0, 3, 6, 8, 10, 12];

  if (elevation instanceof Animated.Value) {
    return {
      shadowColor: MD3_SHADOW_COLOR,
      shadowOffset: {
        width: new Animated.Value(0),
        height: elevation.interpolate({
          inputRange,
          outputRange: shadowHeight,
        }),
      },
      shadowOpacity: elevation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, MD3_SHADOW_OPACITY],
        extrapolate: 'clamp',
      }),
      shadowRadius: elevation.interpolate({
        inputRange,
        outputRange: shadowRadius,
      }),
    };
  } else {
    return {
      shadowColor: MD3_SHADOW_COLOR,
      shadowOpacity: elevation ? MD3_SHADOW_OPACITY : 0,
      shadowOffset: {
        width: 0,
        height: shadowHeight[elevation],
      },
      shadowRadius: shadowRadius[elevation],
    };
  }
}
