import { Animated } from 'react-native';
import useLazyRef from './useLazyRef';

export default function useAnimatedValue(initialValue: number) {
  const { current } = useLazyRef(() => new Animated.Value(initialValue));

  return current;
}
