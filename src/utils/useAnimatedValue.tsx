// eslint-disable-next-line no-restricted-imports -- TODO: remove after BottomNavigation migrates to Reanimated.
import { Animated } from 'react-native';

import useLazyRef from './useLazyRef';

export default function useAnimatedValue(initialValue: number) {
  const { current } = useLazyRef(() => new Animated.Value(initialValue));

  return current;
}
