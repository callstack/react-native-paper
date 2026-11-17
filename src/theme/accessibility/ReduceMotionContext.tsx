import * as React from 'react';

export const ReduceMotionContext = React.createContext<boolean>(false);

/**
 * Returns `true` when motion should be reduced, and `false` otherwise.
 *
 * The value comes from the `reduceMotion` prop of the nearest `PaperProvider`:
 * `'on'` and `'off'` set it, and `'auto'` (the default) follows the OS setting
 * reported by `AccessibilityInfo`. Outside a `PaperProvider` it is `false`.
 * Paper's own components read it too: when it is `true`, their transitions
 * jump to the end state instead of animating.
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
