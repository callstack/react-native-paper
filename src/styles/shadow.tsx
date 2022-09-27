import { Animated } from 'react-native';

import * as MD2Colors from './themes/v2/colors';
import { MD3Colors } from './themes/v3/tokens';

const SHADOW_COLOR = MD2Colors.black;
const SHADOW_OPACITY = 0.24;
const MD3_SHADOW_OPACITY = 0.3;
const MD3_SHADOW_COLOR = MD3Colors.primary0;

export default function shadow(
  elevation: number | Animated.Value = 0,
  isV3 = false
) {
  return isV3 ? v3Shadow(elevation) : v2Shadow(elevation);
}

function v2Shadow(elevation: number | Animated.Value = 0) {
  if (elevation instanceof Animated.Value) {
    const inputRange = [0, 1, 2, 3, 8, 24];

    return {
      shadowColor: SHADOW_COLOR,
      shadowOffset: {
        width: new Animated.Value(0),
        height: elevation.interpolate({
          inputRange,
          outputRange: [0, 0.5, 0.75, 2, 7, 23],
        }),
      },
      shadowOpacity: elevation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SHADOW_OPACITY],
        extrapolate: 'clamp',
      }),
      shadowRadius: elevation.interpolate({
        inputRange,
        outputRange: [0, 0.75, 1.5, 3, 8, 24],
      }),
    };
  } else {
    if (elevation === 0) {
      return {};
    }

    let height, radius;
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

    return {
      shadowColor: SHADOW_COLOR,
      shadowOffset: {
        width: 0,
        height,
      },
      shadowOpacity: SHADOW_OPACITY,
      shadowRadius: radius,
    };
  }
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
