import * as React from 'react';
import { Platform, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import { cubicBezier } from 'react-native-reanimated';

import { Tokens } from './tokens';
import type { Measurement } from './utils';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { InternalTheme } from '../../types';

// Ensures only one tooltip is visible at a time. When a tooltip calls
// takeSingletonSlot it immediately hides the previous one.
let dismissCurrentTooltip: (() => void) | null = null;

// When any tooltip opens, trigger re-measurement of all registered triggers so
// scroll-invalidated coordinates are refreshed before the backdrop is used.
type RefreshCallback = () => void;
const triggerRefreshCallbacks = new Set<RefreshCallback>();

export const subscribeToTriggerRefresh = (
  cb: RefreshCallback
): (() => void) => {
  triggerRefreshCallbacks.add(cb);
  return () => triggerRefreshCallbacks.delete(cb);
};

const refreshAllTriggers = () => {
  triggerRefreshCallbacks.forEach((cb) => cb());
};

export const takeSingletonSlot = (dismiss: () => void) => {
  dismissCurrentTooltip?.();
  dismissCurrentTooltip = dismiss;
  refreshAllTriggers();
};

// Mobile backdrop hit-forwarding: each RichTooltip registers its trigger's
// screen rect so the backdrop can forward presses that land on another trigger
// rather than consuming them. This allows one-tap switching between tooltips.
type RichTriggerEntry = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
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
  for (const entry of richTriggerRegistry.values()) {
    if (
      pageX >= entry.pageX &&
      pageX <= entry.pageX + entry.width &&
      pageY >= entry.pageY &&
      pageY <= entry.pageY + entry.height
    ) {
      entry.onPress();
      return true;
    }
  }
  return false;
};

/**
 * Drives the show/hide fade shared by both tooltip variants.
 *
 * Given a `visible` intent it keeps the tooltip mounted (`rendered`) through
 * the exit fade so the animation can play before unmounting, holds the opacity
 * at 0 until the tooltip has been measured (so it never flashes at the wrong
 * position), and honors the reduce-motion preference. The fade itself is a
 * Reanimated CSS transition on `opacity`; the unmount is deferred by the exit
 * duration via a timer, which keeps the behavior deterministic and testable.
 */
export const useTooltipFade = (theme: InternalTheme, visible: boolean) => {
  const reduceMotion = useReduceMotion();
  const [rendered, setRendered] = React.useState(false);
  const [measurement, setMeasurement] = React.useState<Measurement>({
    children: { pageX: 0, pageY: 0, width: 0, height: 0 },
    tooltip: { x: 0, y: 0, width: 0, height: 0 },
    measured: false,
  });
  const childrenWrapperRef = React.useRef<
    View & { getBoundingClientRect?(): DOMRect }
  >(null);
  // The trigger measurement and tooltip layout are each obtained via async
  // native calls that can complete in either order. Both refs are written by
  // whichever side fires first; the second side checks whether the other is
  // already available and, if so, completes the combined measurement.
  const childrenMeasurement = React.useRef<Measurement['children'] | null>(
    null
  );
  const tooltipLayout = React.useRef<Measurement['tooltip'] | null>(null);

  const enterDuration = reduceMotion
    ? 0
    : theme.motion.duration[Tokens.motion.enter.duration];
  const exitDuration = reduceMotion
    ? 0
    : theme.motion.duration[Tokens.motion.exit.duration];

  // Mount as soon as the tooltip is requested — derived during render rather
  // than synced from an effect.
  if (visible && !rendered) {
    setRendered(true);
  }

  // Measure the trigger synchronously once the tooltip is requested, instead
  // of waiting for the tooltip's `onLayout` to do it. (The tooltip itself
  // lives in a `Portal`, so its own size still comes from its layout below.)
  React.useLayoutEffect(() => {
    if (!rendered || !visible) {
      return;
    }

    childrenWrapperRef.current?.measure(
      (_x, _y, width, height, pageX, pageY) => {
        // On web, measure() returns viewport-relative coords but the Portal
        // container is positioned at the document origin — add scroll offset.
        const scrollX =
          Platform.OS === 'web' ? ((window as Window).scrollX ?? 0) : 0;
        const scrollY =
          Platform.OS === 'web' ? ((window as Window).scrollY ?? 0) : 0;
        childrenMeasurement.current = {
          pageX: pageX + scrollX,
          pageY: pageY + scrollY,
          width,
          height,
        };
        // If onLayout already fired before this callback, use the stashed
        // tooltip layout to complete the measurement now.
        if (tooltipLayout.current) {
          setMeasurement({
            children: childrenMeasurement.current,
            tooltip: tooltipLayout.current,
            measured: true,
          });
        }
      }
    );
  }, [rendered, visible]);

  // Keep the tooltip mounted through the exit fade, then unmount.
  React.useEffect(() => {
    if (!rendered || visible) {
      return;
    }

    const id = setTimeout(() => {
      setRendered(false);
      setMeasurement({
        children: { pageX: 0, pageY: 0, width: 0, height: 0 },
        tooltip: { x: 0, y: 0, width: 0, height: 0 },
        measured: false,
      });
      childrenMeasurement.current = null;
      tooltipLayout.current = null;
    }, exitDuration);

    return () => clearTimeout(id);
  }, [rendered, visible, exitDuration]);

  // The tooltip reports its own size on layout; combine it with the trigger
  // measurement to compute the final position. Either side can arrive first:
  // stash the layout and let the measure callback pick it up if it's late.
  const onLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    tooltipLayout.current = layout;
    if (!childrenMeasurement.current) {
      return;
    }

    setMeasurement({
      children: childrenMeasurement.current,
      tooltip: layout,
      measured: true,
    });
  };

  // A Reanimated CSS transition drives the fade — no shared values. Opacity is
  // held at 0 until the tooltip has been measured so it never flashes at the
  // wrong position; entering decelerates in, exiting accelerates out.
  const fadeStyle = {
    opacity: visible && measurement.measured ? 1 : 0,
    transitionProperty: 'opacity',
    transitionDuration: `${visible ? enterDuration : exitDuration}ms`,
    transitionTimingFunction: visible
      ? cubicBezier(...theme.motion.easing[Tokens.motion.enter.easing])
      : cubicBezier(...theme.motion.easing[Tokens.motion.exit.easing]),
  };

  return {
    rendered,
    measurement,
    fadeStyle,
    onLayout,
    childrenWrapperRef,
    enterDuration,
  };
};
