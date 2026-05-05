export type SpringConfig = {
  stiffness: number;
  damping: number; // damping ratio 0–1; matches md.sys.motion.spring.*.*.damping
};

export type MotionSpring = {
  fast: { spatial: SpringConfig; effects: SpringConfig };
  default: { spatial: SpringConfig; effects: SpringConfig };
  slow: { spatial: SpringConfig; effects: SpringConfig };
};

export type EasingConfig = readonly [number, number, number, number];

export type MotionEasing = {
  emphasized: EasingConfig;
  emphasizedAccelerate: EasingConfig;
  emphasizedDecelerate: EasingConfig;
  standard: EasingConfig;
  standardAccelerate: EasingConfig;
  standardDecelerate: EasingConfig;
  linear: EasingConfig;
};

export type MotionDuration = {
  short1: number;
  short2: number;
  short3: number;
  short4: number;
  medium1: number;
  medium2: number;
  medium3: number;
  medium4: number;
  long1: number;
  long2: number;
  long3: number;
  long4: number;
  extraLong1: number;
  extraLong2: number;
  extraLong3: number;
  extraLong4: number;
};

export type MotionConfig = {
  spring: MotionSpring;
  easing: MotionEasing;
  duration: MotionDuration;
};
