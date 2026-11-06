import type { ComponentRef } from 'react';
import { Platform } from 'react-native';
import type { View } from 'react-native';

// This is a rough list of selectors that can be focused.
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Resolves the DOM element that can receive keyboard focus for a ref: its first
 * focusable descendant, or the node itself when it is the focusable element.
 * Web only; returns `null` on native.
 */
export const getFocusableElement = (
  el: ComponentRef<typeof View> | null | undefined
): HTMLElement | null => {
  if (Platform.OS !== 'web' || !(el instanceof HTMLElement)) {
    return null;
  }

  return (
    el.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
    (el.matches(FOCUSABLE_SELECTOR) ? el : null)
  );
};
