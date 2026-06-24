import * as React from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import { cubicBezier } from 'react-native-reanimated';

import { Tokens } from './tokens';
import type { Measurement } from './utils';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { InternalTheme } from '../../types';

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
  const [measurement, setMeasurement] = React.useState({
    children: {},
    tooltip: {},
    measured: false,
  });
  const childrenWrapperRef = React.useRef<View>(null);
  // The trigger is measured synchronously and stashed here so the tooltip's
  // own layout can combine the two into the final measurement in one update.
  const childrenMeasurement = React.useRef<Measurement['children'] | null>(
    null
  );

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
        childrenMeasurement.current = { pageX, pageY, width, height };
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
      setMeasurement({ children: {}, tooltip: {}, measured: false });
      childrenMeasurement.current = null;
    }, exitDuration) as unknown as NodeJS.Timeout;

    return () => clearTimeout(id);
  }, [rendered, visible, exitDuration]);

  // The tooltip reports its own size on layout; combine it with the trigger
  // measurement captured above to compute the final position in one update.
  const onLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
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
  } as const;

  return { rendered, measurement, fadeStyle, onLayout, childrenWrapperRef };
};
