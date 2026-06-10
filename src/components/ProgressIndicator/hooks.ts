import * as React from 'react';

import {
  cancelAnimation,
  Easing,
  type SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * One clock that drives every indeterminate animation. Returns a `phase` SharedValue that
 * loops `0 -> 1` over `duration` ms (linear) while `indeterminate`, and holds `0` otherwise.
 * Deriving every edge/angle from a single clock keeps the moving pieces in sync.
 */
export const useIndeterminatePhase = (
  indeterminate: boolean,
  duration: number
): SharedValue<number> => {
  const phase = useSharedValue(0);

  React.useEffect(() => {
    if (!indeterminate) {
      cancelAnimation(phase);
      phase.value = 0;
      return;
    }

    phase.value = 0;
    phase.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );

    return () => cancelAnimation(phase);
  }, [indeterminate, duration, phase]);

  return phase;
};

/**
 * Whole-percent progress and busy state for the accessibility value. A numeric `progress`
 * maps directly; an animated SharedValue is mirrored to React state via a determinate-gated
 * reaction so it stays correct without re-rendering every frame.
 */
export const useProgressAccessibility = (
  progress: number | SharedValue<number>,
  indeterminate: boolean
): { progressPercent: number; busy: boolean } => {
  const numberProgress = typeof progress === 'number' ? clamp(progress) : null;
  const [animatedPercent, setAnimatedPercent] = React.useState(0);
  const progressPercent =
    numberProgress !== null
      ? Math.round(numberProgress * 100)
      : animatedPercent;
  const busy = indeterminate || progressPercent < 100;

  useAnimatedReaction(
    () => {
      if (indeterminate || typeof progress === 'number') return -1;
      return Math.round(Math.min(1, Math.max(0, progress.value)) * 100);
    },
    (current, previous) => {
      if (current !== -1 && current !== previous) {
        scheduleOnRN(setAnimatedPercent, current);
      }
    },
    [progress, indeterminate]
  );

  return { progressPercent, busy };
};
