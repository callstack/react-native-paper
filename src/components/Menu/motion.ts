import { Animated } from 'react-native';

import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { InternalTheme } from '../../types';

type OpenMotionArgs = {
  reduceMotion: boolean;
  scaleAnimation: Animated.ValueXY;
  opacityAnimation: Animated.Value;
  menuWidth: number;
  menuHeight: number;
  theme: InternalTheme;
  onFinish: () => void;
};

type CloseMotionArgs = {
  reduceMotion: boolean;
  opacityAnimation: Animated.Value;
  theme: InternalTheme;
  onFinish: () => void;
};

/**
 * Open the menu surface: spring scale+opacity, or snap when reduce-motion.
 * Returns which path ran so tests can assert the real shipped branch.
 */
export function runMenuOpenMotion({
  reduceMotion,
  scaleAnimation,
  opacityAnimation,
  menuWidth,
  menuHeight,
  theme,
  onFinish,
}: OpenMotionArgs): 'snap' | 'spring' {
  if (reduceMotion) {
    scaleAnimation.setValue({ x: menuWidth, y: menuHeight });
    opacityAnimation.setValue(1);
    onFinish();
    return 'snap';
  }

  const spatialSpring = toRawSpring(theme.motion.spring.fast.spatial);
  const effectsSpring = toRawSpring(theme.motion.spring.fast.effects);

  Animated.parallel([
    Animated.spring(scaleAnimation, {
      toValue: { x: menuWidth, y: menuHeight },
      ...spatialSpring,
      useNativeDriver: true,
    }),
    Animated.spring(opacityAnimation, {
      toValue: 1,
      ...effectsSpring,
      useNativeDriver: true,
    }),
  ]).start(onFinish);

  return 'spring';
}

/**
 * Close the menu surface: spring opacity out, or snap when reduce-motion.
 */
export function runMenuCloseMotion({
  reduceMotion,
  opacityAnimation,
  theme,
  onFinish,
}: CloseMotionArgs): 'snap' | 'spring' {
  if (reduceMotion) {
    opacityAnimation.setValue(0);
    onFinish();
    return 'snap';
  }

  const effectsSpring = toRawSpring(theme.motion.spring.fast.effects);

  Animated.spring(opacityAnimation, {
    toValue: 0,
    ...effectsSpring,
    useNativeDriver: true,
  }).start(onFinish);

  return 'spring';
}
