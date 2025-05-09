import { Animated } from 'react-native';

export const isAnimatedValue = (
  it: number | string | Animated.AnimatedInterpolation<number | string>
): it is Animated.Value => it instanceof Animated.Value;
