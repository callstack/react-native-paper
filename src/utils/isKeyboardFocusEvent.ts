import {
  type NativeSyntheticEvent,
  Platform,
  type TargetedEvent,
} from 'react-native';

/** True when a focus event came from keyboard navigation. Native: always true. */
export const isKeyboardFocusEvent = (
  e: NativeSyntheticEvent<TargetedEvent>
): boolean => {
  if (Platform.OS !== 'web') return true;
  try {
    const target: unknown = e.currentTarget;
    if (typeof target === 'object' && target !== null && 'matches' in target) {
      const { matches } = target;
      if (typeof matches === 'function') {
        return matches.call(target, ':focus-visible');
      }
    }
  } catch {
    // older browsers throw on unknown selectors
  }
  return true;
};
