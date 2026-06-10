import * as React from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Tokens } from './tokens';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { InternalTheme } from '../../types';

/**
 * Drives the show/hide fade shared by both tooltip variants.
 *
 * Given a `visible` intent it keeps the tooltip mounted (`rendered`) through
 * the exit fade so the animation can play before unmounting, holds the opacity
 * at 0 until the tooltip has been measured (so it never flashes at the wrong
 * position), and honors the reduce-motion preference. The actual unmount is
 * deferred by the exit duration via a timer rather than a Reanimated callback,
 * which keeps the behavior deterministic and testable with fake timers.
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

  const opacity = useSharedValue(0);
  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  const enterConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration[Tokens.motion.enter.duration],
      easing: Easing.bezier(...theme.motion.easing[Tokens.motion.enter.easing]),
      reduceMotion: reanimatedReduceMotion,
    }),
    [theme.motion, reanimatedReduceMotion]
  );
  const exitConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration[Tokens.motion.exit.duration],
      easing: Easing.bezier(...theme.motion.easing[Tokens.motion.exit.easing]),
      reduceMotion: reanimatedReduceMotion,
    }),
    [theme.motion, reanimatedReduceMotion]
  );
  const exitDurationMs = reduceMotion
    ? 0
    : theme.motion.duration[Tokens.motion.exit.duration];

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  // Mount as soon as the tooltip is requested.
  React.useEffect(() => {
    if (visible) {
      setRendered(true);
    }
  }, [visible]);

  // Drive the fade and defer unmount until the exit animation has played.
  React.useEffect(() => {
    if (!rendered) {
      return;
    }

    if (visible) {
      opacity.value = measurement.measured ? withTiming(1, enterConfig) : 0;
      return;
    }

    opacity.value = withTiming(0, exitConfig);
    const id = setTimeout(() => {
      setRendered(false);
      setMeasurement({ children: {}, tooltip: {}, measured: false });
    }, exitDurationMs) as unknown as NodeJS.Timeout;

    return () => clearTimeout(id);
  }, [
    visible,
    rendered,
    measurement.measured,
    opacity,
    enterConfig,
    exitConfig,
    exitDurationMs,
  ]);

  const onLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    childrenWrapperRef.current?.measure(
      (_x, _y, width, height, pageX, pageY) => {
        setMeasurement({
          children: { pageX, pageY, height, width },
          tooltip: { ...layout },
          measured: true,
        });
      }
    );
  };

  return { rendered, measurement, animatedStyle, onLayout, childrenWrapperRef };
};
