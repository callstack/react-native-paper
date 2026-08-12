import * as React from 'react';
import { Keyboard, Platform } from 'react-native';
import type { KeyboardEvent } from 'react-native';

type KeyboardMetrics = KeyboardEvent['endCoordinates'];

type Props = {
  /**
   * Whether the keyboard should be tracked at all, e.g. only while the container is visible.
   */
  enabled: boolean;
  /**
   * Position of the bottom edge of the container, as reported by `onLayout`.
   */
  containerBottom: number | null;
};

const getCurrentMetrics = () =>
  // `metrics` is not implemented by react-native-web
  (Keyboard.isVisible() ? Keyboard.metrics?.() : null) ?? null;

/**
 * Returns how much of a container is covered by the on-screen keyboard.
 *
 * Historically components rendered in a `Portal` didn't have to care about the
 * keyboard on Android, because `android:windowSoftInputMode="adjustResize"` made
 * the system shrink the whole window. This no longer happens in edge-to-edge mode
 * (enforced since Android 15), where the keyboard is reported as an inset which has
 * to be handled by the app, and it never happened on iOS.
 *
 * The overlap is the distance between the bottom edge of the container and the top
 * edge of the keyboard. Both are relative to the window, so windows which are still
 * resized by the system need no correction: the container has already been laid out
 * above the keyboard, which puts the overlap at or below zero.
 */
export default function useKeyboardOverlap({
  enabled,
  containerBottom,
}: Props) {
  const [metrics, setMetrics] = React.useState<KeyboardMetrics | null>(() =>
    enabled ? getCurrentMetrics() : null
  );

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    setMetrics(getCurrentMetrics());

    const onShow = (event: KeyboardEvent) => {
      setMetrics(event.endCoordinates);
      // `scheduleLayoutAnimation` is not implemented by react-native-web
      Keyboard.scheduleLayoutAnimation?.(event);
    };

    const onHide = (event: KeyboardEvent) => {
      setMetrics(null);
      Keyboard.scheduleLayoutAnimation?.(event);
    };

    // `keyboardWillShow` and `keyboardWillHide` are not emitted on Android.
    const subscriptions =
      Platform.OS === 'ios'
        ? [
            Keyboard.addListener('keyboardWillShow', onShow),
            Keyboard.addListener('keyboardWillHide', onHide),
          ]
        : [
            Keyboard.addListener('keyboardDidShow', onShow),
            Keyboard.addListener('keyboardDidHide', onHide),
          ];

    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [enabled]);

  if (!enabled || metrics == null || containerBottom == null) {
    return 0;
  }

  // iOS reports a keyboard positioned at the top of the screen when the
  // "Prefer Cross-Fade Transitions" accessibility setting is enabled.
  if (metrics.screenY <= 0) {
    return 0;
  }

  return Math.max(0, containerBottom - metrics.screenY);
}
