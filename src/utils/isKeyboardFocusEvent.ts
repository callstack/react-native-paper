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
    const target = e.currentTarget as unknown as {
      matches?: (selector: string) => boolean;
    };
    if (typeof target.matches === 'function') {
      return target.matches(':focus-visible');
    }
  } catch {
    // older browsers throw on unknown selectors
  }
  return true;
};
