import * as React from 'react';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

type FocusVisibleEvent = {
  currentTarget: object;
};

/**
 * Convenience hook for components that gate a focus indicator on
 * `:focus-visible` semantics. Returns `{ focusVisible, onFocus, onBlur }`;
 * wire `onFocus` / `onBlur` to a `Pressable` (or equivalent) and gate the
 * indicator on `focusVisible`.
 *
 * On web, delegates to the browser's `:focus-visible` matcher. On native,
 * `onFocus` only fires for keyboard-style focus (external keyboard, D-pad,
 * a11y navigation, programmatic focus), so `focusVisible` is always `true`
 * while focused.
 */
export function useFocusVisible() {
  const [focusVisible, setFocusVisible] = React.useState(false);
  const onFocus = React.useCallback((e: FocusVisibleEvent) => {
    if (!isWeb) {
      setFocusVisible(true);
      return;
    }
    const target = e.currentTarget;
    const matches =
      'matches' in target && typeof target.matches === 'function'
        ? target.matches
        : null;
    setFocusVisible(!!matches?.call(target, ':focus-visible'));
  }, []);
  const onBlur = React.useCallback(() => setFocusVisible(false), []);
  return { focusVisible, onFocus, onBlur };
}
