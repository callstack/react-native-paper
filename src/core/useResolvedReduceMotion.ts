import * as React from 'react';
import { AccessibilityInfo } from 'react-native';

import { addEventListener } from '../utils/addEventListener';

export type ReduceMotionPreference = 'auto' | 'on' | 'off';

/**
 * Resolves a reduce-motion preference into a boolean.
 *
 * - `'on'` / `'off'` are explicit overrides.
 * - `'auto'` subscribes to `AccessibilityInfo.reduceMotionChanged` and follows
 *   the OS-level setting.
 *
 * `AccessibilityInfo.isReduceMotionEnabled()` is async, so the first render
 * returns `false` for one frame regardless of OS state.
 */
export function useResolvedReduceMotion(
  preference: ReduceMotionPreference
): boolean {
  const [osReduceMotion, setOsReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (preference !== 'auto') return;
    let cancelled = false;

    const init = async () => {
      const v = await AccessibilityInfo.isReduceMotionEnabled?.();
      if (!cancelled && v != null) setOsReduceMotion(v);
    };
    void init();

    const sub = addEventListener(
      AccessibilityInfo,
      'reduceMotionChanged',
      setOsReduceMotion
    );
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, [preference]);

  return preference === 'auto' ? osReduceMotion : preference === 'on';
}
