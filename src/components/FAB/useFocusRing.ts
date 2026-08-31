import * as React from 'react';
import { Platform } from 'react-native';

import { useSharedValue, type SharedValue } from 'react-native-reanimated';

export type FocusRingState = {
  /**
   * `true` when the surface is keyboard-focused. Drive the focus ring's
   * `opacity` from this in a `useAnimatedStyle`.
   */
  focusedSV: SharedValue<boolean>;
  /** Wire to the `Pressable`/`TouchableRipple`'s `onFocus`. */
  onFocus: () => void;
  /** Wire to the `Pressable`/`TouchableRipple`'s `onBlur`. */
  onBlur: () => void;
};

/**
 * Drives an MD3 focus indicator for FAB-flavored surfaces. On web, focus is
 * gated by `:focus-visible` so a mouse click does not light the ring; on
 * native, every focus event is honored.
 */
export function useFocusRing(): FocusRingState {
  const focusedSV = useSharedValue(false);

  const onFocus = React.useCallback(() => {
    if (
      Platform.OS === 'web' &&
      !document.activeElement?.matches(':focus-visible')
    ) {
      return;
    }
    focusedSV.value = true;
  }, [focusedSV]);

  const onBlur = React.useCallback(() => {
    focusedSV.value = false;
  }, [focusedSV]);

  return { focusedSV, onFocus, onBlur };
}
