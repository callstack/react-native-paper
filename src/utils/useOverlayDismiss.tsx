import * as React from 'react';
import { Platform } from 'react-native';

import useLatestCallback from 'use-latest-callback';

import { addEventListener } from './addEventListener';
import { BackHandler } from './BackHandler/BackHandler';

const visibleOverlays: Array<number> = [];

let nextKey = 0;

const registerOverlay = () => {
  const key = nextKey++;

  visibleOverlays.push(key);

  return key;
};

const unregisterOverlay = (key: number) => {
  const index = visibleOverlays.indexOf(key);

  if (index === -1) {
    return;
  }

  visibleOverlays.splice(index, 1);
};

const isTopmost = (key: number | undefined) =>
  key !== undefined && visibleOverlays[visibleOverlays.length - 1] === key;

export type OverlayDismissOptions = {
  enabled: boolean;
  /**
   * When false, back is absorbed and not passed on, and Escape closes nothing.
   * Escape still reaches the rest of the page.
   */
  dismissable: boolean;
  /** Called when the overlay should close. */
  onDismiss?: () => void;
};

/**
 * Closes only the overlay on top when the user presses back or Escape.
 */
export function useOverlayDismiss({
  enabled,
  dismissable,
  onDismiss,
}: OverlayDismissOptions) {
  const overlayKey = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const registeredKey = registerOverlay();

    overlayKey.current = registeredKey;

    return () => {
      unregisterOverlay(registeredKey);

      overlayKey.current = undefined;
    };
  }, [enabled]);

  const handleDismiss = useLatestCallback(() => {
    if (!isTopmost(overlayKey.current)) {
      return false;
    }

    if (dismissable) {
      onDismiss?.();
    }

    return true;
  });

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const subscription = addEventListener(
      BackHandler,
      'hardwareBackPress',
      handleDismiss
    );

    return () => subscription.remove();
  }, [enabled, handleDismiss]);

  React.useEffect(() => {
    if (!enabled || Platform.OS !== 'web' || !('document' in global)) {
      return undefined;
    }

    const pending = new Set<ReturnType<typeof setTimeout>>();

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape cancels an IME composition, it does not close the overlay.
      if (event.key !== 'Escape' || event.isComposing) {
        return;
      }

      // Decided now, so that one key press closes one overlay even when the
      // overlay on top has gone by the time the others look.
      if (!isTopmost(overlayKey.current)) {
        return;
      }

      // Listening in the capture phase puts this ahead of everything else,
      // including react-native-web's `TextInput`, which stops every key press
      // from travelling on. The overlay waits until the key has been through
      // the page, and leaves it alone if something there already used it.
      const timeout = setTimeout(() => {
        pending.delete(timeout);

        if (!event.defaultPrevented) {
          handleDismiss();
        }
      }, 0);

      pending.add(timeout);
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      pending.forEach(clearTimeout);
    };
  }, [enabled, handleDismiss]);
}
