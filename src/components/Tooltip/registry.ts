import type { LayoutRectangle } from 'react-native';

import { isWithinRect } from './utils';

// Ensures only one tooltip is visible at a time
let dismissCurrentTooltip: (() => void) | null = null;

export const takeSingletonSlot = (dismiss: () => void) => {
  dismissCurrentTooltip?.();
  dismissCurrentTooltip = dismiss;
};

// Mobile backdrop hit-forwarding: each RichTooltip registers its trigger's
// screen rect so the backdrop can forward presses that land on another trigger
// rather than consuming them. This allows one-tap switching between tooltips.
type RichTriggerEntry = {
  rect: LayoutRectangle;
  onPress: () => void;
};

const richTriggerRegistry = new Map<symbol, RichTriggerEntry>();

export const registerRichTrigger = (
  id: symbol,
  entry: RichTriggerEntry
): void => {
  richTriggerRegistry.set(id, entry);
};

export const unregisterRichTrigger = (id: symbol): void => {
  richTriggerRegistry.delete(id);
};

// Returns true if a registered trigger was hit and pressed (caller should NOT
// also call hide() in this case — the singleton dismisses the current tooltip).
export const forwardPressToTriggerAt = (
  pageX: number,
  pageY: number
): boolean => {
  for (const { rect, onPress } of richTriggerRegistry.values()) {
    if (isWithinRect(pageX, pageY, rect)) {
      onPress();
      return true;
    }
  }
  return false;
};

// When a rich tooltip opens, every registered trigger re-measures itself so
// scroll-invalidated coordinates are refreshed before the backdrop is used.
const triggerRefreshCallbacks = new Set<() => void>();

export const subscribeToTriggerRefresh = (cb: () => void): (() => void) => {
  triggerRefreshCallbacks.add(cb);
  return () => triggerRefreshCallbacks.delete(cb);
};

export const refreshRichTriggers = () => {
  triggerRefreshCallbacks.forEach((cb) => cb());
};
