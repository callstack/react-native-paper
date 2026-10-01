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
  /** When false the press is absorbed, not passed on; same for Escape. */
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
      // Something nearer the key press already dealt with it.
      if (event.key !== 'Escape' || event.defaultPrevented) {
        return;
      }

      if (!handleDismiss()) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [enabled, handleDismiss]);
}
