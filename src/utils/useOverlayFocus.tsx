import * as React from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import type { HostInstance } from 'react-native';

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

/**
 * Anything that can take focus: a host element, or the handle of a component
 * such as a Paper `TextInput`.
 */
export type OverlayFocusTarget = { focus: () => void };

const hasFocusMethod = (target: unknown): target is OverlayFocusTarget =>
  typeof target === 'object' &&
  target !== null &&
  'focus' in target &&
  typeof target.focus === 'function';

// A component handle has no native node for the screen reader to land on.
const isHostInstance = (target: OverlayFocusTarget): target is HostInstance =>
  'measure' in target && typeof target.measure === 'function';

const isFocusInside = (container: unknown) =>
  container instanceof HTMLElement &&
  document.activeElement instanceof HTMLElement &&
  container.contains(document.activeElement);

// Prefer `target`. Search inside it only if the browser refused focus.
const moveWebFocusTo = (target: OverlayFocusTarget | null) => {
  if (target instanceof HTMLElement) {
    target.focus();

    // The browser refused focus, so try the first element inside instead.
    if (document.activeElement !== target) {
      findFirstTabbable(target)?.focus();
    }

    return true;
  }

  // A component handle decides for itself where its focus goes.
  if (hasFocusMethod(target)) {
    target.focus();

    return true;
  }

  // Anything else has nowhere for focus to go.
  return false;
};

// The first element inside, or the container itself when nothing in it can
// take focus.
const moveWebFocusIntoContainer = (container: OverlayFocusTarget | null) => {
  if (container instanceof HTMLElement) {
    (findFirstTabbable(container) ?? container).focus();

    return true;
  }

  return moveWebFocusTo(container);
};

const moveNativeFocusTo = (target: OverlayFocusTarget | null) => {
  if (!hasFocusMethod(target)) {
    return false;
  }

  if (isHostInstance(target)) {
    AccessibilityInfo.sendAccessibilityEvent(target, 'focus');
  } else {
    target.focus();
  }

  return true;
};

export type OverlayFocusOptions = {
  /** Whether the overlay is open. Drives each capture and restore cycle. */
  visible: boolean;
  /** The overlay's own content. Focused when no `initialFocusRef` is provided. */
  containerRef: React.RefObject<OverlayFocusTarget | null>;
  /** Element to focus when the overlay opens, instead of the container. */
  initialFocusRef?: React.RefObject<OverlayFocusTarget | null>;
  /** Element to focus when the overlay closes. */
  restoreFocusRef?: React.RefObject<OverlayFocusTarget | null>;
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
  const hasOpened = React.useRef(false);
  const hasMovedInitialFocus = React.useRef(false);
  const hasRestoredFocus = React.useRef(false);
  const focusedWebElementBeforeOpen = React.useRef<HTMLElement | null>(null);
  const restoreTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const focusInitialTarget = useLatestCallback(() => {
    if (!visible || hasMovedInitialFocus.current) {
      return;
    }

    const requestedTarget = initialFocusRef?.current ?? null;

    if (Platform.OS !== 'web') {
      hasMovedInitialFocus.current = moveNativeFocusTo(
        requestedTarget ?? containerRef.current
      );

      return;
    }

    // Focus already inside, such as an `autoFocus` field, stays where it is.
    // An element asked for with `initialFocusRef` still takes precedence.
    if (!requestedTarget && isFocusInside(containerRef.current)) {
      hasMovedInitialFocus.current = true;

      return;
    }

    hasMovedInitialFocus.current = requestedTarget
      ? moveWebFocusTo(requestedTarget)
      : moveWebFocusIntoContainer(containerRef.current);
  });

  const restoreFocus = useLatestCallback(() => {
    // On the web an open overlay makes what is behind it inert, which drops
    // focus on the body right away, so there is focus to give back even when
    // the overlay closes before it moved any in. Elsewhere, an overlay that
    // never took focus has none to give back.
    const hasFocusToGiveBack =
      hasMovedInitialFocus.current ||
      (Platform.OS === 'web' && hasOpened.current);

    if (!hasFocusToGiveBack || hasRestoredFocus.current) {
      return;
    }

    hasRestoredFocus.current = true;

    // Wait for the close render to remove background inertness.
    restoreTimeout.current = setTimeout(() => {
      const elementBeforeOpen = focusedWebElementBeforeOpen.current;

      focusedWebElementBeforeOpen.current = null;

      if (Platform.OS === 'web') {
        // An empty ref, such as a row the overlay just deleted, falls back to
        // where focus was before the overlay opened.
        moveWebFocusTo(restoreFocusRef?.current ?? elementBeforeOpen);

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
    hasOpened.current = true;
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
