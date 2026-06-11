import * as React from 'react';
import {
  type ColorValue,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  type SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { CircularWavyProgressIndicatorTokens as T } from './tokens';
import { useInternalTheme } from '../../../core/theming';
import { useReduceMotion } from '../../../theme/accessibility/ReduceMotionContext';
import { motionEasing } from '../../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../../types';
import {
  CIRCULAR_INDETERMINATE_DURATION as CYCLE,
  circularArc,
} from '../circularIndeterminateSpecs';
import { useIndeterminatePhase, useProgressAccessibility } from '../hooks';
import { getProgressIndicatorColors } from '../utils';
import { buildArcWavePath, NO_DRAW_PATH } from '../wavePath';

export type Props = {
  /**
   * Progress between 0 and 1 (out-of-range values are clamped). Pass a number to set it
   * directly, or a Reanimated `SharedValue<number>` to animate it on the UI thread.
   */
  progress?: number | SharedValue<number>;
  /**
   * Show progress of an unknown duration. While set, `progress` is ignored.
   */
  indeterminate?: boolean;
  /**
   * Color of the active indicator. Defaults to `theme.colors.primary`.
   */
  color?: ColorValue;
  /**
   * Color of the track. Defaults to `theme.colors.secondaryContainer`. The track is hidden
   * while indeterminate.
   */
  trackColor?: ColorValue;
  /**
   * Indicator diameter.
   */
  size?: number;
  /**
   * Indicator stroke thickness.
   */
  thickness?: number;
  /**
   * Wave height in dp. The wave flattens near the start and end of the progress.
   */
  amplitude?: number;
  /**
   * Distance in dp between two wave peaks. Snapped to fit a whole number of waves around the ring.
   */
  wavelength?: number;
  /**
   * Wave travel speed in dp per second. Defaults to one wavelength per second.
   */
  waveSpeed?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
  /**
   * Label describing what is loading, e.g. "Loading news article".
   */
  accessibilityLabel?: string;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

const [STD_X1, STD_Y1, STD_X2, STD_Y2] = motionEasing.standard;
const [ACC_X1, ACC_Y1, ACC_X2, ACC_Y2] = motionEasing.emphasizedAccelerate;

const AMPLITUDE_DURATION = 500;

/**
 * Material Design 3 wavy circular progress indicator. The active indicator is drawn as a wavy
 * arc that flattens near the start and end of the progress. Supports determinate and
 * indeterminate modes.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { CircularWavyProgressIndicator } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <CircularWavyProgressIndicator progress={0.5} />
 * );
 *
 * export default MyComponent;
 * ```
 */
const CircularWavyProgressIndicator = ({
  progress = 0,
  indeterminate = false,
  color,
  trackColor,
  size = T.size,
  thickness = T.activeThickness,
  amplitude,
  wavelength,
  waveSpeed,
  style,
  theme: themeOverrides,
  testID = 'circular-wavy-progress-indicator',
  accessibilityLabel,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();

  const { activeColor, trackColor: resolvedTrackColor } =
    getProgressIndicatorColors({ theme, color, trackColor });

  const { progressPercent, busy } = useProgressAccessibility(
    progress,
    indeterminate
  );

  const center = size / 2;
  // Amplitude is constant; the centerline radius is inset by it so the wave peaks always fit
  // inside the box.
  const maxAmplitude = amplitude ?? T.amplitude;
  const radius = (size - thickness) / 2 - maxAmplitude;
  const circumference = 2 * Math.PI * radius;
  const capAngle = (thickness / 2 / circumference) * 360;
  const gapAngle = (T.trackActiveSpace / circumference) * 360;

  const waveLength = wavelength ?? T.wavelength;
  // Snap to a whole number of waves so the pattern joins seamlessly around the ring.
  const waveCount = Math.max(5, Math.round(circumference / waveLength));
  const waveSpeedValue = waveSpeed ?? waveLength;

  const phase = useIndeterminatePhase(indeterminate, CYCLE);
  const waveOffset = useSharedValue(0);
  const amp = useSharedValue(0);

  // Slide the wave pattern at a steady speed; one wavelength per `duration`.
  React.useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(waveOffset);
      waveOffset.value = 0;
      return;
    }
    const duration = Math.max(50, (waveLength / waveSpeedValue) * 1000);
    waveOffset.value = 0;
    waveOffset.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(waveOffset);
  }, [reduceMotion, waveLength, waveSpeedValue, waveOffset]);

  // Grow the wave once progress is underway and flatten it near the ends.
  useAnimatedReaction(
    () => {
      if (reduceMotion) return 0;
      if (indeterminate) return 1;
      const p = Math.min(
        1,
        Math.max(0, typeof progress === 'number' ? progress : progress.value)
      );
      return p > 0.1 && p < 0.95 ? 1 : 0;
    },
    (on, previous) => {
      if (on === previous) return;
      amp.value = withTiming(on ? maxAmplitude : 0, {
        duration: AMPLITUDE_DURATION,
        easing: on
          ? Easing.bezier(STD_X1, STD_Y1, STD_X2, STD_Y2)
          : Easing.bezier(ACC_X1, ACC_Y1, ACC_X2, ACC_Y2),
      });
    },
    [reduceMotion, indeterminate, progress, maxAmplitude]
  );

  const activeProps = useAnimatedProps(() => {
    const wavePhase = waveOffset.value * 2 * Math.PI;
    if (indeterminate) {
      const { startAngle, sweepAngle } = circularArc(phase.value * CYCLE);
      return {
        d: buildArcWavePath(
          center,
          center,
          radius,
          startAngle,
          sweepAngle,
          amp.value,
          waveCount,
          wavePhase
        ),
      };
    }
    const p = Math.min(
      1,
      Math.max(0, typeof progress === 'number' ? progress : progress.value)
    );
    return {
      d: buildArcWavePath(
        center,
        center,
        radius,
        -90,
        p * 360,
        amp.value,
        waveCount,
        wavePhase
      ),
    };
  }, [indeterminate, progress, center, radius, waveCount]);

  // The track is the arc left by the active indicator: it starts a gap past the active head and
  // runs back to a gap before its tail, with rounded ends. It follows the active arc in both
  // determinate and indeterminate modes, so it shrinks as the active grows.
  const trackProps = useAnimatedProps(() => {
    let activeStart;
    let activeSweep;
    if (indeterminate) {
      const { startAngle, sweepAngle } = circularArc(phase.value * CYCLE);
      activeStart = startAngle;
      activeSweep = sweepAngle;
    } else {
      const p = Math.min(
        1,
        Math.max(0, typeof progress === 'number' ? progress : progress.value)
      );
      activeStart = -90;
      activeSweep = p * 360;
    }
    const trackSweep = 360 - activeSweep - 4 * capAngle - 2 * gapAngle;
    if (trackSweep <= 0) return { d: NO_DRAW_PATH };
    const trackStart = activeStart + activeSweep + 2 * capAngle + gapAngle;
    return {
      d: buildArcWavePath(
        center,
        center,
        radius,
        trackStart,
        trackSweep,
        0,
        waveCount,
        0
      ),
    };
  }, [indeterminate, progress, center, radius, capAngle, gapAngle, waveCount]);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityState={{ busy }}
      accessibilityValue={
        indeterminate ? {} : { min: 0, max: 100, now: progressPercent }
      }
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[{ width: size, height: size }, style]}
    >
      <Svg width={size} height={size}>
        <AnimatedPath
          testID={`${testID}-track`}
          animatedProps={trackProps}
          stroke={resolvedTrackColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
        />
        <AnimatedPath
          testID={`${testID}-active`}
          animatedProps={activeProps}
          stroke={activeColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

export default CircularWavyProgressIndicator;
