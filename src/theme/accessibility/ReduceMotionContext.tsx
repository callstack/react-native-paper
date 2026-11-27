import * as React from 'react';

import useLatestCallback from 'use-latest-callback';

export const ReduceMotionContext = React.createContext<boolean>(false);

/**
 * Returns `true` when motion should be reduced, and `false` otherwise.
 *
 * The value comes from the `reduceMotion` prop of the nearest `PaperProvider`:
 * `'on'` and `'off'` set it, and `'auto'` (the default) follows the OS setting
 * reported by `AccessibilityInfo`. Outside a `PaperProvider` it is `false`.
 * Paper's own components read it too: when it is `true`, all their transitions,
 * opacity and color included, jump to the end state instead of animating.
 *
 * Use it to keep your own components in line with the user's choice. Reduce
 * motion is about movement, so when it is `true`, skip animations that slide,
 * scale, zoom or spin content, and show their end state instead. Opacity and
 * color changes don't move anything on screen, so you can choose to keep them.
 * Reanimated also follows the OS setting on its own, so give a Reanimated
 * animation that this value gates `reduceMotion: ReduceMotion.Never`, or it
 * still skips while the OS setting is on, even under `reduceMotion="off"`.
 *
 * @example
 * const reduceMotion = useReduceMotion();
 * const duration = reduceMotion ? 0 : theme.motion.duration.medium2;
 */
export function useReduceMotion(): boolean {
  return React.useContext(ReduceMotionContext);
}

/**
 * Returns a function that gives back the duration it is passed, or `0` when
 * motion should be reduced.
 *
 * The function keeps its identity and reads the latest value of
 * `useReduceMotion()` when it is called, so an effect that lists it doesn't
 * run again, replaying an animation or restarting a timer, when the
 * preference changes. Call it when an animation starts, not during render:
 * there it can still return the previous render's value.
 *
 * @example
 * const getDuration = useMotionDuration();
 * // In an effect or an event handler:
 * opacity.value = withTiming(1, {
 *   duration: getDuration(200),
 *   reduceMotion: ReduceMotion.Never,
 * });
 */
export function useMotionDuration(): (duration: number) => number {
  const reduceMotion = useReduceMotion();
  return useLatestCallback((duration: number) => (reduceMotion ? 0 : duration));
}
