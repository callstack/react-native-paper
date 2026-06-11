import * as React from 'react';
import {
  type ColorValue,
  type LayoutChangeEvent,
  StyleSheet,
  View,
  type StyleProp,
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
import Svg, { Circle, G, Path } from 'react-native-svg';

import { LinearWavyProgressIndicatorTokens as T } from './tokens';
import { useLocale } from '../../../core/locale';
import { useInternalTheme } from '../../../core/theming';
import { useReduceMotion } from '../../../theme/accessibility/ReduceMotionContext';
import { motionEasing } from '../../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../../types';
import { useIndeterminatePhase, useProgressAccessibility } from '../hooks';
import {
  LINEAR_INDETERMINATE_DURATION as CYCLE,
  LINEAR_INDETERMINATE_LINES as LINES,
  lineFraction,
} from '../indeterminateSpecs';
import { getProgressIndicatorColors } from '../utils';
import { buildLinearWavePath, buildStraightPath } from '../wavePath';

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
   * Color of the active indicator and the stop dot. Defaults to `theme.colors.primary`.
   */
  color?: ColorValue;
  /**
   * Color of the track. Defaults to `theme.colors.secondaryContainer`.
   */
  trackColor?: ColorValue;
  /**
   * Stroke thickness of the active indicator and the track.
   */
  thickness?: number;
  /**
   * Wave height in dp. The wave flattens near the start and end of the progress.
   */
  amplitude?: number;
  /**
   * Distance in dp between two wave peaks. Defaults to 40 (determinate) or 20 (indeterminate).
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
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const [STD_X1, STD_Y1, STD_X2, STD_Y2] = motionEasing.standard;
const [ACC_X1, ACC_Y1, ACC_X2, ACC_Y2] = motionEasing.emphasizedAccelerate;

const AMPLITUDE_DURATION = 500;

/**
 * Material Design 3 wavy linear progress indicator. The active indicator is drawn as a moving
 * sine wave that flattens near the start and end of the progress. Supports determinate and
 * indeterminate modes.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { LinearWavyProgressIndicator } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <LinearWavyProgressIndicator progress={0.5} />
 * );
 *
 * export default MyComponent;
 * ```
 */
const LinearWavyProgressIndicator = ({
  progress = 0,
  indeterminate = false,
  color,
  trackColor,
  thickness = T.activeThickness,
  amplitude,
  wavelength,
  waveSpeed,
  style,
  theme: themeOverrides,
  testID = 'linear-wavy-progress-indicator',
  accessibilityLabel,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const reduceMotion = useReduceMotion();

  const {
    activeColor,
    trackColor: resolvedTrackColor,
    stopColor,
  } = getProgressIndicatorColors({ theme, color, trackColor });

  const [width, setWidth] = React.useState(0);

  const { progressPercent, busy } = useProgressAccessibility(
    progress,
    indeterminate
  );

  const capWidth = thickness / 2;
  // Amplitude is constant; the container grows so the wave plus stroke always fits
  // (height = thickness + 2 * amplitude), matching the MD3 spec.
  const maxAmplitude = amplitude ?? T.amplitude;
  const containerHeight = Math.max(T.height, thickness + 2 * maxAmplitude);
  const centerY = containerHeight / 2;
  const gap = T.trackActiveSpace;
  const stopSize = Math.min(thickness, T.stopSize);

  const waveLength =
    wavelength ??
    (indeterminate ? T.wavelengthIndeterminate : T.wavelengthDeterminate);
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

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const activeProps = useAnimatedProps(() => {
    const shift = waveOffset.value * waveLength;
    if (indeterminate) {
      const elapsed = phase.value * CYCLE;
      const min = capWidth;
      const max = width - capWidth;
      const clip = (value: number) => Math.min(max, Math.max(min, value));
      const s1Tail = clip(
        lineFraction(elapsed, LINES.firstTail.delay, LINES.firstTail.duration) *
          width
      );
      const s1Head = clip(
        lineFraction(elapsed, LINES.firstHead.delay, LINES.firstHead.duration) *
          width
      );
      const s2Tail = clip(
        lineFraction(
          elapsed,
          LINES.secondTail.delay,
          LINES.secondTail.duration
        ) * width
      );
      const s2Head = clip(
        lineFraction(
          elapsed,
          LINES.secondHead.delay,
          LINES.secondHead.duration
        ) * width
      );
      return {
        d:
          buildLinearWavePath(
            s1Tail,
            s1Head,
            centerY,
            amp.value,
            waveLength,
            shift
          ) +
          buildLinearWavePath(
            s2Tail,
            s2Head,
            centerY,
            amp.value,
            waveLength,
            shift
          ),
      };
    }
    const p = Math.min(
      1,
      Math.max(0, typeof progress === 'number' ? progress : progress.value)
    );
    const head = capWidth + p * (width - 2 * capWidth);
    return {
      d: buildLinearWavePath(
        capWidth,
        head,
        centerY,
        amp.value,
        waveLength,
        shift
      ),
    };
  }, [indeterminate, progress, width, centerY, capWidth, waveLength]);

  const trackProps = useAnimatedProps(() => {
    const min = capWidth;
    const max = width - capWidth;
    const clip = (value: number) => Math.min(max, Math.max(min, value));
    if (indeterminate) {
      const elapsed = phase.value * CYCLE;
      const firstHead =
        lineFraction(elapsed, LINES.firstHead.delay, LINES.firstHead.duration) *
        width;
      const firstTail =
        lineFraction(elapsed, LINES.firstTail.delay, LINES.firstTail.duration) *
        width;
      const secondHead =
        lineFraction(
          elapsed,
          LINES.secondHead.delay,
          LINES.secondHead.duration
        ) * width;
      const secondTail =
        lineFraction(
          elapsed,
          LINES.secondTail.delay,
          LINES.secondTail.duration
        ) * width;
      const right = buildStraightPath(
        clip(firstHead > 0 ? firstHead + gap : min),
        max,
        centerY
      );
      const middle = buildStraightPath(
        clip(secondHead > 0 ? secondHead + gap : min),
        clip(firstTail < width ? firstTail - gap : max),
        centerY
      );
      const left = buildStraightPath(min, clip(secondTail - gap), centerY);
      return { d: left + middle + right };
    }
    const p = Math.min(
      1,
      Math.max(0, typeof progress === 'number' ? progress : progress.value)
    );
    const head = capWidth + p * (width - 2 * capWidth);
    const trackStart = head + gap + 2 * capWidth;
    return { d: buildStraightPath(clip(trackStart), max, centerY) };
  }, [indeterminate, progress, width, centerY, capWidth, gap]);

  const stopProps = useAnimatedProps(() => {
    const p = Math.min(
      1,
      Math.max(0, typeof progress === 'number' ? progress : progress.value)
    );
    const head = capWidth + p * (width - 2 * capWidth);
    const stopCenter = width - capWidth;
    const overlap = Math.max(0, head + capWidth - (stopCenter - stopSize / 2));
    return { r: Math.max(0, stopSize / 2 - overlap) };
  }, [progress, width, capWidth, stopSize]);

  const mirror =
    direction === 'rtl' && width > 0
      ? `translate(${width}, 0) scale(-1, 1)`
      : undefined;

  return (
    <View
      onLayout={onLayout}
      accessible
      accessibilityRole="progressbar"
      accessibilityState={{ busy }}
      accessibilityValue={
        indeterminate ? {} : { min: 0, max: 100, now: progressPercent }
      }
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[styles.container, { height: containerHeight }, style]}
    >
      {width > 0 ? (
        <Svg width={width} height={containerHeight}>
          <G transform={mirror}>
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
            {!indeterminate ? (
              <AnimatedCircle
                testID={`${testID}-stop`}
                animatedProps={stopProps}
                cx={width - capWidth}
                cy={centerY}
                fill={stopColor}
              />
            ) : null}
          </G>
        </Svg>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    overflow: 'visible',
  },
});

export default LinearWavyProgressIndicator;
