/**
 * MD3 timing for the indeterminate linear progress animation. Shared by the linear
 * progress indicators.
 *
 * One 1750ms cycle moves two lines. Each line has a head and a tail edge. An edge waits
 * for its `delay`, eases from 0 to 1 over its `duration`, then stays at 1 until the cycle
 * repeats. The head is always ahead of the tail, so a line covers the range [tail, head].
 */
import { Easing } from 'react-native-reanimated';

import { motionEasing } from '../../theme/tokens/sys/motion';

export const LINEAR_INDETERMINATE_DURATION = 1750;

export const LINEAR_INDETERMINATE_LINES = {
  firstHead: { delay: 0, duration: 1000 },
  firstTail: { delay: 250, duration: 1000 },
  secondHead: { delay: 650, duration: 850 },
  secondTail: { delay: 900, duration: 850 },
} as const;

const [ACCEL_X1, ACCEL_Y1, ACCEL_X2, ACCEL_Y2] =
  motionEasing.emphasizedAccelerate;

/**
 * Eased 0..1 position of one line edge, `elapsed` ms into the
 * {@link LINEAR_INDETERMINATE_DURATION} cycle. All edges read the same `elapsed` (one clock),
 * which keeps them in sync. Separate timers would drift by a frame at the cycle boundary and
 * flash a full-width segment.
 */
export function lineFraction(elapsed: number, delay: number, duration: number) {
  'worklet';
  if (elapsed <= delay) return 0;
  const local = (elapsed - delay) / duration;
  if (local >= 1) return 1;
  return Easing.bezierFn(ACCEL_X1, ACCEL_Y1, ACCEL_X2, ACCEL_Y2)(local);
}
