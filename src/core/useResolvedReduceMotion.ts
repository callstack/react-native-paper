import * as React from 'react';
import { AccessibilityInfo } from 'react-native';

import { useReducedMotion } from 'react-native-reanimated';

import { addEventListener } from '../utils/addEventListener';

export type ReduceMotionPreference = 'auto' | 'on' | 'off';

/**
 * Resolves a reduce-motion preference into a boolean.
 *
 * - `'on'` / `'off'` are explicit overrides.
 * - `'auto'` follows the OS-level setting. It starts from the value Reanimated
 *   reads synchronously when the app launches, so animations that start on the
 *   first render already see it. It then asks
 *   `AccessibilityInfo.isReduceMotionEnabled()`, which answers asynchronously,
 *   and subscribes to `AccessibilityInfo.reduceMotionChanged`.
 */
export function useResolvedReduceMotion(
  preference: ReduceMotionPreference
): boolean {
  const reducedMotionAtLaunch = useReducedMotion();
  const [osReduceMotion, setOsReduceMotion] = React.useState(
    reducedMotionAtLaunch
  );

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
