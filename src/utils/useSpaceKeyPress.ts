import * as React from 'react';
import {
  type GestureResponderEvent,
  type NativeSyntheticEvent,
  Platform,
  type TargetedEvent,
} from 'react-native';

import useLatestCallback from 'use-latest-callback';

type KeyboardEvent = React.KeyboardEvent<HTMLElement>;

type Options = {
  /**
   * Called when Space is released. Pass `undefined` while the element cannot
   * be pressed.
   */
  onPress: ((e: GestureResponderEvent) => void) | undefined;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
};

const isSpaceKey = ({ nativeEvent: { key } }: KeyboardEvent) =>
  key === ' ' || key === 'Spacebar';

// React Native Web hands Enter's key events to the press callbacks as they
// are, so Space passes its own events the same way.
const asPressEvent = (
  event: KeyboardEvent | NativeSyntheticEvent<TargetedEvent>
) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  event as unknown as GestureResponderEvent;

/**
 * React Native Web presses on Space only for `role="button"`, so on a focused
 * element with another role, such as `checkbox`, Space scrolls the page
 * instead. The returned key handlers keep the page in place and press the way
 * Enter does: press in on key down, then press out and press on release.
 * Enter needs nothing here, since React Native Web handles it for every role.
 * Native platforms get no handlers.
 */
export const useSpaceKeyPress = ({
  onPress,
  onPressIn,
  onPressOut,
}: Options) => {
  // The key down event of the pending press, or `null` when there is none.
  const pressInEventRef = React.useRef<KeyboardEvent | null>(null);
  const enabled = Platform.OS === 'web' && onPress !== undefined;

  /** Presses out the pending press, if any, and returns whether there was one. */
  const endPress = useLatestCallback(
    (event: KeyboardEvent | NativeSyntheticEvent<TargetedEvent>) => {
      if (pressInEventRef.current === null) return false;

      pressInEventRef.current = null;
      onPressOut?.(asPressEvent(event));
      return true;
    }
  );

  // Without `onPress` the release is never handled, so a pending press ends
  // here instead, without pressing. Otherwise it would press on a later,
  // unrelated release.
  React.useEffect(() => {
    const pressInEvent = pressInEventRef.current;
    if (!enabled && pressInEvent !== null) endPress(pressInEvent);
  }, [enabled, endPress]);

  /** Ends a pending press when focus leaves before Space is released. */
  const onBlur = useLatestCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      endPress(event);
    }
  );

  const keyHandlers = enabled
    ? {
        onKeyDown: (event: KeyboardEvent) => {
          if (!isSpaceKey(event)) return;

          event.preventDefault();
          if (event.nativeEvent.repeat) return;

          pressInEventRef.current = event;
          onPressIn?.(asPressEvent(event));
        },
        onKeyUp: (event: KeyboardEvent) => {
          if (!isSpaceKey(event)) return;

          event.preventDefault();
          if (endPress(event)) onPress(asPressEvent(event));
        },
      }
    : undefined;

  return { keyHandlers, onBlur };
};
