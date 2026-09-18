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
    (element) => isVisible(element) && element.closest('[inert]') === null
  ) ?? null;

/** Prefer `target`. Search children only if the browser refused focus. */
const focusDOMTarget = (target: HTMLElement) => {
  target.focus();

  if (document.activeElement !== target) {
    findFirstTabbable(target)?.focus();
  }
};

export type OverlayFocusOptions = {
  /**
   * Whether the overlay is visible.
   */
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
 * @returns `focusInitialTarget`, that should be called once the overlay can take focus.
 */
export function useOverlayFocus({
  visible,
  containerRef,
  initialFocusRef,
  restoreFocusRef,
}: OverlayFocusOptions) {
  const hasMovedInitialFocus = React.useRef(false);
  const focusedBeforeOpen = React.useRef<HTMLElement | null>(null);

  const focusInitialTarget = useLatestCallback(() => {
    if (!visible || hasMovedInitialFocus.current) {
      return;
    }

    const target = initialFocusRef?.current ?? containerRef.current;

    if (!target) {
      return;
    }

    if (Platform.OS === 'web') {
      if (!(target instanceof HTMLElement)) {
        return;
      }

      // The first interactive element, which only the DOM can work out.
      hasMovedInitialFocus.current = true;
      focusDOMTarget(
        initialFocusRef?.current
          ? target
          : (findFirstTabbable(target) ?? target)
      );

      return;
    }

    hasMovedInitialFocus.current = true;
    AccessibilityInfo.sendAccessibilityEvent(target, 'focus');
  });

  const restoreFocus = useLatestCallback(() => {
    if (Platform.OS === 'web') {
      const target = restoreFocusRef?.current ?? focusedBeforeOpen.current;

      focusedBeforeOpen.current = null;

      // A target that has left the document is left to the browser.
      if (target instanceof HTMLElement && target.isConnected) {
        focusDOMTarget(target);
      }

      return;
    }

    if (restoreFocusRef?.current) {
      AccessibilityInfo.sendAccessibilityEvent(
        restoreFocusRef?.current,
        'focus'
      );
    }
  });

  React.useEffect(() => {
    if (!visible) {
      return undefined;
    }

    if (Platform.OS === 'web' && 'document' in global) {
      const activeElement = document.activeElement;

      focusedBeforeOpen.current =
        activeElement instanceof HTMLElement ? activeElement : null;
    }

    return () => {
      if (!hasMovedInitialFocus.current) {
        return;
      }

      hasMovedInitialFocus.current = false;

      setTimeout(restoreFocus, 0);
    };
  }, [visible, restoreFocus]);

  return { focusInitialTarget };
}
