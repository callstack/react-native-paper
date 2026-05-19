import type {
  MotionConfig,
  MotionDuration,
  MotionEasing,
  RawSpring,
  SpringConfig,
} from '../../types';

// Spring, easing curves and duration constants per the M3 spec:
// https://m3.material.io/styles/motion/easing-and-duration/tokens-specs

const expressiveSpring = {
  spring: {
    fast: {
      spatial: { stiffness: 800, damping: 0.6 },
      effects: { stiffness: 3800, damping: 1 },
    },
    default: {
      spatial: { stiffness: 380, damping: 0.8 },
      effects: { stiffness: 1600, damping: 1 },
    },
    slow: {
      spatial: { stiffness: 200, damping: 0.8 },
      effects: { stiffness: 800, damping: 1 },
    },
  },
};

const standardSpring = {
  spring: {
    fast: {
      spatial: { stiffness: 1400, damping: 0.9 },
      effects: { stiffness: 3800, damping: 1 },
    },
    default: {
      spatial: { stiffness: 700, damping: 0.9 },
      effects: { stiffness: 1600, damping: 1 },
    },
    slow: {
      spatial: { stiffness: 300, damping: 0.9 },
      effects: { stiffness: 800, damping: 1 },
    },
  },
};

export const motionEasing: MotionEasing = {
  emphasized: [0.2, 0, 0, 1],
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15],
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1],
  standard: [0.2, 0, 0, 1],
  standardAccelerate: [0.3, 0, 1, 1],
  standardDecelerate: [0, 0, 0, 1],
  linear: [0, 0, 1, 1],
};

export const motionDuration: MotionDuration = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  extraLong1: 700,
  extraLong2: 800,
  extraLong3: 900,
  extraLong4: 1000,
};

export const expressiveMotion: MotionConfig = {
  ...expressiveSpring,
  easing: motionEasing,
  duration: motionDuration,
};

export const standardMotion: MotionConfig = {
  ...standardSpring,
  easing: motionEasing,
  duration: motionDuration,
};

/**
 * Converts a `SpringConfig` (spec damping ratio 0–1) to the raw damping
 * coefficient expected by `Animated.spring` and Reanimated's `withSpring`.
 *
 * @example
 * Animated.spring(value, {
 *   toValue: 0.85,
 *   ...toRawSpring(theme.motion.spring.fast.spatial),
 *   useNativeDriver: true,
 * });
 *
 * // Reanimated
 * sharedValue.value = withSpring(
 *   target,
 *   toRawSpring(theme.motion.spring.fast.spatial)
 * );
 */
export function toRawSpring({
  stiffness,
  damping: ratio,
}: SpringConfig): RawSpring {
  return {
    stiffness,
    damping: ratio * 2 * Math.sqrt(stiffness),
    mass: 1, // as per MD specs
  };
}
