/**
 * Timing for the indeterminate circular spinner. Three motions share one 6000ms clock:
 *  - global rotation: linear 0 -> 1080deg,
 *  - extra rotation: four 90deg steps (each a 300ms move, then a pause), 0 -> 360deg,
 *  - sweep length: grows 0.1 -> 0.87 of a turn, then shrinks back.
 * Total rotation per clock is 1080 + 360 = 1440deg (four full turns), so the loop has no visible
 * seam. Everything reads the same `elapsed`, so the spin and the grow/shrink stay in sync.
 */
import { Easing } from 'react-native-reanimated';

import { motionEasing } from '../../theme/tokens/sys/motion';

export const CIRCULAR_INDETERMINATE_DURATION = 6000;

const GLOBAL_ROTATION_TARGET = 1080;
const ADDITIONAL_ROTATION_TARGET = 360;

const STEP_MOVE_DURATION = 300;
const STEP_INTERVAL = 1500;
const STEP_DEGREES = 90;
const STEP_COUNT = ADDITIONAL_ROTATION_TARGET / STEP_DEGREES; // 4

const MIN_PROGRESS = 0.1;
const MAX_PROGRESS = 0.87;

const [STD_X1, STD_Y1, STD_X2, STD_Y2] = motionEasing.standard;

const clamp01 = (value: number) => {
  'worklet';
  return Math.min(1, Math.max(0, value));
};

const easeStandard = (x: number) => {
  'worklet';
  return Easing.bezierFn(STD_X1, STD_Y1, STD_X2, STD_Y2)(x);
};

const globalRotation = (elapsed: number) => {
  'worklet';
  return (elapsed / CIRCULAR_INDETERMINATE_DURATION) * GLOBAL_ROTATION_TARGET;
};

const additionalRotation = (elapsed: number) => {
  'worklet';
  const step = Math.min(Math.floor(elapsed / STEP_INTERVAL), STEP_COUNT - 1);
  const local = elapsed - step * STEP_INTERVAL;
  const moved = clamp01(local / STEP_MOVE_DURATION);
  return (step + moved) * STEP_DEGREES;
};

const progressFraction = (elapsed: number) => {
  'worklet';
  const half = CIRCULAR_INDETERMINATE_DURATION / 2;
  const span = MAX_PROGRESS - MIN_PROGRESS;
  if (elapsed <= half) {
    return MIN_PROGRESS + span * (elapsed / half);
  }
  return MAX_PROGRESS - span * easeStandard((elapsed - half) / half);
};

/**
 * Arc shape at `elapsed` ms into the clock. Returns the start angle (degrees, clockwise) and the
 * visible sweep length in degrees. The arc spins, so its start angle is just the rotation.
 */
export function circularArc(elapsed: number) {
  'worklet';
  const t = elapsed % CIRCULAR_INDETERMINATE_DURATION;
  return {
    startAngle: globalRotation(t) + additionalRotation(t),
    sweepAngle: progressFraction(t) * 360,
  };
}
