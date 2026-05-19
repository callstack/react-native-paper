import * as React from 'react';

export const ReduceMotionContext = React.createContext<boolean>(false);

/**
 * Returns `true` when the user has requested reduced motion, either via the
 * `reduceMotion` prop on `PaperProvider` (`"on"` | `"off"`) or, in `"auto"`
 * mode (the default), via the OS-level setting reported by `AccessibilityInfo`.
 *
 * Use this in component code to gate motion-specific animations (translation,
 * scale, transforms) while keeping non-motion animations (opacity, color) intact.
 */
export function useReduceMotion(): boolean {
  return React.useContext(ReduceMotionContext);
}
