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

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape cancels an IME composition, it does not close the overlay.
      if (event.key !== 'Escape' || event.isComposing) {
        return;
      }

      if (!handleDismiss()) {
        return;
      }

      event.preventDefault();
    };

    // The bubble phase, and the event keeps travelling: handlers in the app
    // still see the key.
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleDismiss]);
}
