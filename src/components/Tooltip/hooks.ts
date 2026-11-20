import * as React from 'react';
import { Dimensions, Platform, View } from 'react-native';
import type { LayoutChangeEvent, PointerEvent } from 'react-native';

import { cubicBezier } from 'react-native-reanimated';
import useLatestCallback from 'use-latest-callback';

import { Tokens } from './tokens';
import { isPointerInside } from './utils';
import type { Measurement } from './utils';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { InternalTheme } from '../../theme/types';
import { addEventListener } from '../../utils/addEventListener';

// Scheduling replaces the pending timeout
export const useTimeout = () => {
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = React.useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const schedule = React.useCallback(
    (callback: () => void, delay: number) => {
      clear();
      timer.current = setTimeout(() => {
        timer.current = null;
        callback();
      }, delay);
    },
    [clear]
  );

  React.useEffect(() => clear, [clear]);

  return React.useMemo(() => ({ schedule, clear }), [schedule, clear]);
};

/**
 * Web only: a tap focuses the trigger, and that focus mustn't open the tooltip
 * the way keyboard focus does.
 */
const useTouchFocusGuard = () => {
  const touching = React.useRef(false);

  return React.useMemo(
    () => ({
      onPointerDown: (e: PointerEvent) => {
        touching.current = e.nativeEvent.pointerType === 'touch';
      },
      // a touch that turns into a scroll ends without a focus or a press
      onPointerCancel: () => {
        touching.current = false;
      },
      // true once, for the focus that follows a tap
      consumeTouchFocus: () => {
        const wasTouch = touching.current;
        touching.current = false;
        return wasTouch;
      },
    }),
    []
  );
};

type TriggerHoverOptions = {
  wrapperRef: React.RefObject<TooltipHostElement | null>;
  onEnter: (isTouch: boolean) => void;
  onLeave: () => void;
};

/**
 * Web only: hover over the trigger's wrapper, through pointer events, as
 * React Native Web's `View` ignores `onHoverIn`/`onHoverOut` and its
 * `Pressable` hover flickers.
 */
export const useTriggerHover = ({
  wrapperRef,
  onEnter,
  onLeave,
}: TriggerHoverOptions) => {
  // a non-touch pointer sits on the trigger
  const hoveringRef = React.useRef(false);
  const touchFocusGuard = useTouchFocusGuard();

  const onPointerEnter = useLatestCallback((e: PointerEvent) => {
    const isTouch = e.nativeEvent.pointerType === 'touch';
    hoveringRef.current = !isTouch;
    onEnter(isTouch);
  });

  const onPointerLeave = useLatestCallback((e: PointerEvent) => {
    if (isPointerInside(wrapperRef.current, e.nativeEvent)) {
      return;
    }
    hoveringRef.current = false;
    onLeave();
  });

  const wrapperProps =
    Platform.OS === 'web'
      ? {
          onPointerDown: touchFocusGuard.onPointerDown,
          onPointerCancel: touchFocusGuard.onPointerCancel,
          onPointerEnter,
          onPointerLeave,
        }
      : {};

  return {
    hoveringRef,
    consumeTouchFocus: touchFocusGuard.consumeTouchFocus,
    wrapperProps,
  };
};

// After a resize or rotation the position no longer matches the trigger
export const useHideOnDimensionsChange = (hide: () => void) => {
  React.useEffect(() => {
    const subscription = addEventListener(Dimensions, 'change', hide);

    return () => subscription.remove();
  }, [hide]);
};

export type TooltipHostElement = React.ComponentRef<typeof View> & {
  getBoundingClientRect?(): DOMRect;
  contains?(node: unknown): boolean;
};

const NO_SCROLL = { x: 0, y: 0 };

const UNMEASURED: Measurement = {
  children: { pageX: 0, pageY: 0, width: 0, height: 0 },
  tooltip: { x: 0, y: 0, width: 0, height: 0 },
  scroll: NO_SCROLL,
  measured: false,
};

/**
 * Fades both tooltip variants in and out. Keeps the tooltip mounted through the
 * exit fade and transparent until it is measured, so it never flashes at the
 * wrong position.
 */
export const useTooltipFade = (theme: InternalTheme, visible: boolean) => {
  const reduceMotion = useReduceMotion();
  const [rendered, setRendered] = React.useState(false);
  const [measurement, setMeasurement] = React.useState<Measurement>(UNMEASURED);
  const childrenWrapperRef = React.useRef<TooltipHostElement>(null);
  // The trigger measurement and tooltip layout are each obtained via async
  // native calls that can complete in either order. Both refs are written by
  // whichever side fires first; the second side checks whether the other is
  // already available and, if so, completes the combined measurement.
  const childrenMeasurement = React.useRef<Measurement['children'] | null>(
    null
  );
  const tooltipLayout = React.useRef<Measurement['tooltip'] | null>(null);
  const scroll = React.useRef(NO_SCROLL);

  const enterDuration = reduceMotion
    ? 0
    : theme.motion.duration[Tokens.motion.enter.duration];
  const exitDuration = reduceMotion
    ? 0
    : theme.motion.duration[Tokens.motion.exit.duration];

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
        childrenMeasurement.current = { pageX, pageY, width, height };
        scroll.current =
          Platform.OS === 'web'
            ? { x: window.scrollX ?? 0, y: window.scrollY ?? 0 }
            : NO_SCROLL;
        if (tooltipLayout.current) {
          setMeasurement({
            children: childrenMeasurement.current,
            tooltip: tooltipLayout.current,
            scroll: scroll.current,
            measured: true,
          });
        }
      }
    );
  }, [rendered, visible]);

  React.useEffect(() => {
    if (!rendered || visible) {
      return;
    }

    const id = setTimeout(() => {
      setRendered(false);
      setMeasurement(UNMEASURED);
      childrenMeasurement.current = null;
      tooltipLayout.current = null;
    }, exitDuration);

    return () => clearTimeout(id);
  }, [rendered, visible, exitDuration]);

  const onLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    // Positioning the tooltip causes another onLayout with different x/y but
    // the same dimensions. Only its size affects our position calculation, so
    // ignore that second event instead of rebuilding the animated native layer
    // while it is fading in (which can move it by one physical pixel on
    // Android).
    if (
      tooltipLayout.current?.width === layout.width &&
      tooltipLayout.current?.height === layout.height
    ) {
      return;
    }

    const nextLayout = { ...layout, x: 0, y: 0 };
    tooltipLayout.current = nextLayout;
    if (!childrenMeasurement.current) {
      return;
    }

    setMeasurement({
      children: childrenMeasurement.current,
      tooltip: nextLayout,
      scroll: scroll.current,
      measured: true,
    });
  };

  const fadeDuration = visible ? enterDuration : exitDuration;
  const fadeStyle = {
    opacity: visible && measurement.measured ? 1 : 0,
    transitionProperty: 'opacity',
    transitionDuration: `${fadeDuration}ms`,
    transitionTimingFunction: visible
      ? cubicBezier(...theme.motion.easing[Tokens.motion.enter.easing])
      : cubicBezier(...theme.motion.easing[Tokens.motion.exit.easing]),
  };

  return {
    rendered,
    measurement,
    fadeStyle,
    fadeDuration,
    onLayout,
    childrenWrapperRef,
  };
};
