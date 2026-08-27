import { runOnJS, withSpring } from 'react-native-reanimated';

import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { InternalTheme } from '../../types';

/**
 * The slice of a Reanimated shared value these helpers touch. Keeping it
 * structural lets unit tests drive the real code path with a plain object.
 */
type MotionValue = { value: number };

type OpenMotionArgs = {
  reduceMotion: boolean;
  scale: MotionValue;
  opacity: MotionValue;
  theme: InternalTheme;
  onFinish: () => void;
};

type CloseMotionArgs = {
  reduceMotion: boolean;
  opacity: MotionValue;
  theme: InternalTheme;
  onFinish: () => void;
};

/**
 * Open the menu surface: spring scale+opacity, or snap when reduce-motion.
 * Returns which path ran so tests can assert the real shipped branch.
 */
export function runMenuOpenMotion({
  reduceMotion,
  scale,
  opacity,
  theme,
  onFinish,
}: OpenMotionArgs): 'snap' | 'spring' {
  if (reduceMotion) {
    scale.value = 1;
    opacity.value = 1;
    onFinish();
    return 'snap';
  }

  scale.value = withSpring(1, toRawSpring(theme.motion.spring.fast.spatial));
  opacity.value = withSpring(
    1,
    toRawSpring(theme.motion.spring.fast.effects),
    (finished) => {
      'worklet';
      if (finished) {
        runOnJS(onFinish)();
      }
    }
  );

  return 'spring';
}

/**
 * Close the menu surface: spring opacity out, or snap when reduce-motion.
 */
export function runMenuCloseMotion({
  reduceMotion,
  opacity,
  theme,
  onFinish,
}: CloseMotionArgs): 'snap' | 'spring' {
  if (reduceMotion) {
    opacity.value = 0;
    onFinish();
    return 'snap';
  }

  opacity.value = withSpring(
    0,
    toRawSpring(theme.motion.spring.fast.effects),
    (finished) => {
      'worklet';
      if (finished) {
        runOnJS(onFinish)();
      }
    }
  );

  return 'spring';
}
