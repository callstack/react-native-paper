import * as React from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import type { View } from 'react-native';

import useLatestCallback from 'use-latest-callback';

const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]',
]
  .map((selector) => `${selector}:not([tabindex="-1"])`)
  .join(', ');

const isVisible = (element: HTMLElement) =>
  element.getClientRects().length > 0 &&
  getComputedStyle(element).visibility !== 'hidden';

const findFirstTabbable = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).find(
    isVisible
  ) ?? null;

// Prefer `target`. Search inside it only if the browser refused focus.
const moveWebFocusTo = (target: View | HTMLElement | null) => {
  // Anything outside the document has nowhere for focus to go.
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  target.focus();

  // The browser refused focus, so try the first element inside instead.
  if (document.activeElement !== target) {
    findFirstTabbable(target)?.focus();
  }

  return true;
};

const moveNativeFocusTo = (target: View | null) => {
  if (!target) {
    return false;
  }

  AccessibilityInfo.sendAccessibilityEvent(target, 'focus');

  return true;
};

export type OverlayFocusOptions = {
  /** Whether the overlay is open. Drives each capture and restore cycle. */
  visible: boolean;
  /** The overlay's own content. Focused when no `initialFocusRef` is provided. */
  containerRef: React.RefObject<View | null>;
  /** Element to focus when the overlay opens, instead of the container. */
  initialFocusRef?: React.RefObject<View | null>;
  /** Element to focus when the overlay closes. */
  restoreFocusRef?: React.RefObject<View | null>;
};

/**
 * Moves focus into an overlay when it opens and back when it closes.
 *
 * @returns
 *
 * `focusInitialTarget`, to call once the overlay can take focus.
 * `restoreFocus`, to call once it can no longer.
 */
export function useOverlayFocus({
  visible,
  containerRef,
  initialFocusRef,
  restoreFocusRef,
}: OverlayFocusOptions) {
  const hasMovedInitialFocus = React.useRef(false);
  const hasRestoredFocus = React.useRef(false);
  const focusedWebElementBeforeOpen = React.useRef<HTMLElement | null>(null);
  const restoreTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const focusInitialTarget = useLatestCallback(() => {
    if (!visible || hasMovedInitialFocus.current) {
      return;
    }

    const target = initialFocusRef?.current ?? containerRef.current;

    hasMovedInitialFocus.current =
      Platform.OS === 'web'
        ? moveWebFocusTo(target)
        : moveNativeFocusTo(target);
  });

  const restoreFocus = useLatestCallback(() => {
    // An overlay that never took focus has none to give back.
    if (!hasMovedInitialFocus.current || hasRestoredFocus.current) {
      return;
    }

    hasRestoredFocus.current = true;

    // Wait for the close render to remove background inertness.
    restoreTimeout.current = setTimeout(() => {
      const elementBeforeOpen = focusedWebElementBeforeOpen.current;

      focusedWebElementBeforeOpen.current = null;

      if (Platform.OS === 'web') {
        moveWebFocusTo(
          restoreFocusRef ? restoreFocusRef.current : elementBeforeOpen
        );

        return;
      }

      moveNativeFocusTo(restoreFocusRef?.current ?? null);
    }, 0);
  });

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    clearTimeout(restoreTimeout.current);
    restoreTimeout.current = undefined;
    hasMovedInitialFocus.current = false;
    hasRestoredFocus.current = false;

    // Captured on open, not on mount: overlays mount long before they show.
    if (Platform.OS === 'web' && 'document' in global) {
      const activeElement = document.activeElement;
      const container = containerRef.current;
      const focusStayedInOverlay =
        container instanceof HTMLElement &&
        activeElement instanceof HTMLElement &&
        container.contains(activeElement);

      // Focus still inside ->  reopen mid-close -> keep the first invoker.
      if (!focusStayedInOverlay) {
        focusedWebElementBeforeOpen.current =
          activeElement instanceof HTMLElement ? activeElement : null;
      }
    }
  }, [containerRef, visible]);

  React.useEffect(() => () => restoreFocus(), [restoreFocus]);

  return { focusInitialTarget, restoreFocus };
}
