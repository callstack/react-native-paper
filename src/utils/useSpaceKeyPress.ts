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
  const pressedRef = React.useRef(false);
  const enabled = Platform.OS === 'web' && onPress !== undefined;

  // Without `onPress` the release is never handled, so a press pending at
  // that moment would otherwise fire on a later, unrelated release.
  React.useEffect(() => {
    if (!enabled) pressedRef.current = false;
  }, [enabled]);

  /** Ends a pending press when focus leaves before Space is released. */
  const onBlur = useLatestCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      if (!pressedRef.current) return;

      pressedRef.current = false;
      onPressOut?.(asPressEvent(event));
    }
  );

  const keyHandlers = enabled
    ? {
        onKeyDown: (event: KeyboardEvent) => {
          if (!isSpaceKey(event)) return;

          event.preventDefault();
          if (event.nativeEvent.repeat) return;

          pressedRef.current = true;
          onPressIn?.(asPressEvent(event));
        },
        onKeyUp: (event: KeyboardEvent) => {
          if (!isSpaceKey(event)) return;

          event.preventDefault();
          if (!pressedRef.current) return;

          pressedRef.current = false;
          onPressOut?.(asPressEvent(event));
          onPress(asPressEvent(event));
        },
      }
    : undefined;

  return { keyHandlers, onBlur };
};
