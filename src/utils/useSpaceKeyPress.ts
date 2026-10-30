import * as React from 'react';
import { type GestureResponderEvent, Platform } from 'react-native';

import useLatestCallback from 'use-latest-callback';

type KeyboardEvent = React.KeyboardEvent<HTMLElement>;

type Options = {
  /**
   * Called when Space is released. Pass `undefined` while the element cannot
   * be pressed.
   */
  onPress: ((e: GestureResponderEvent) => void) | undefined;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

const isSpaceKey = ({ nativeEvent: { key } }: KeyboardEvent) =>
  key === ' ' || key === 'Spacebar';

/**
 * React Native Web presses on Space only for `role="button"`, so on a focused
 * element with another role, such as `checkbox`, Space scrolls the page
 * instead. The returned key handlers keep the page in place and press once
 * Space is released, as a native checkbox does. Enter needs nothing here:
 * React Native Web presses on it for every role. Native platforms get no
 * handlers.
 */
export const useSpaceKeyPress = ({
  onPress,
  onPressIn,
  onPressOut,
}: Options) => {
  const pressedRef = React.useRef(false);
  const enabled = Platform.OS === 'web' && onPress !== undefined;

  /** Drops a pending Space press, e.g. when focus leaves before the release. */
  const cancel = useLatestCallback(() => {
    if (!pressedRef.current) return;

    pressedRef.current = false;
    onPressOut?.();
  });

  // Without `onPress` the release is never handled, so a press pending at
  // that moment would otherwise fire on a later, unrelated release.
  React.useEffect(() => {
    if (!enabled) cancel();
  }, [enabled, cancel]);

  const keyHandlers = enabled
    ? {
        onKeyDown: (event: KeyboardEvent) => {
          if (!isSpaceKey(event)) return;

          event.preventDefault();
          if (event.nativeEvent.repeat) return;

          pressedRef.current = true;
          onPressIn?.();
        },
        onKeyUp: (event: KeyboardEvent) => {
          if (!isSpaceKey(event)) return;

          event.preventDefault();
          if (!pressedRef.current) return;

          pressedRef.current = false;
          onPressOut?.();
          // React Native Web hands the key event to `onPress` for Enter too.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
          onPress(event as unknown as GestureResponderEvent);
        },
      }
    : undefined;

  return { keyHandlers, cancel };
};
