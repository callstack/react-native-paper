import * as React from 'react';
import {
  type ColorValue,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import Animated, {
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { CircularProgressIndicatorTokens as T } from './tokens';
import { useInternalTheme } from '../../../core/theming';
import type { ThemeProp } from '../../../types';
import {
  CIRCULAR_INDETERMINATE_DURATION as CYCLE,
  circularArc,
} from '../circularIndeterminateSpecs';
import { useIndeterminatePhase, useProgressAccessibility } from '../hooks';
import { getProgressIndicatorColors } from '../utils';

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
   * Indicator diameter
   */
  size?: number;
  /**
   * Indicator stroke thickness
   */
  thickness?: number;
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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Material Design 3 circular progress indicator. Supports determinate and indeterminate modes.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { CircularProgressIndicator } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <CircularProgressIndicator indeterminate />
 * );
 *
 * export default MyComponent;
 * ```
 */
const CircularProgressIndicator = ({
  progress = 0,
  indeterminate = false,
  color,
  trackColor,
  size = T.size,
  thickness = T.activeThickness,
  style,
  theme: themeOverrides,
  testID = 'circular-progress-indicator',
  accessibilityLabel,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const { activeColor, trackColor: resolvedTrackColor } =
    getProgressIndicatorColors({ theme, color, trackColor });

  const center = size / 2;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const capAngle = (thickness / 2 / circumference) * 360;
  const gapAngle = (T.trackActiveSpace / circumference) * 360;

  const { progressPercent, busy } = useProgressAccessibility(
    progress,
    indeterminate
  );

  const phase = useIndeterminatePhase(indeterminate, CYCLE);

  const arc = useDerivedValue(() => {
    if (indeterminate) {
      const { startAngle, sweepAngle } = circularArc(phase.value * CYCLE);
      const sweepLen = Math.max((sweepAngle / 360) * circumference, 0.01);
      return { rotate: startAngle, sweepLen };
    }
    const p = Math.min(
      1,
      Math.max(0, typeof progress === 'number' ? progress : progress.value)
    );
    return { rotate: -90, sweepLen: p * circumference };
  }, [indeterminate, progress, circumference]);

  const activeRotation = useAnimatedStyle(
    () => ({ transform: [{ rotate: `${arc.value.rotate}deg` }] }),
    []
  );

  // dasharray [C, C] makes the visible length = C - dashoffset, anchored at the stroke start.
  const activeProps = useAnimatedProps(
    () => ({ strokeDashoffset: circumference - arc.value.sweepLen }),
    [circumference]
  );

  const trackRotation = useAnimatedStyle(() => {
    const p = Math.min(
      1,
      Math.max(0, typeof progress === 'number' ? progress : progress.value)
    );
    return {
      transform: [{ rotate: `${-90 + p * 360 + 2 * capAngle + gapAngle}deg` }],
    };
  }, [progress, capAngle, gapAngle]);

  const trackProps = useAnimatedProps(() => {
    const p = Math.min(
      1,
      Math.max(0, typeof progress === 'number' ? progress : progress.value)
    );
    const trackLenAngle = 360 - p * 360 - 4 * capAngle - 2 * gapAngle;
    const trackLen = Math.max(0, (trackLenAngle / 360) * circumference);
    return {
      strokeDashoffset: circumference - trackLen,
      strokeOpacity: trackLenAngle <= 0 ? 0 : 1,
    };
  }, [progress, circumference, capAngle, gapAngle]);

  const circleProps = {
    cx: center,
    cy: center,
    r: radius,
    fill: 'none',
    strokeWidth: thickness,
    strokeLinecap: 'round' as const,
    strokeDasharray: [circumference, circumference],
  };

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
      {!indeterminate ? (
        <Animated.View
          key="track"
          style={[styles.layer, trackRotation]}
          pointerEvents="none"
        >
          <Svg width={size} height={size}>
            <AnimatedCircle
              testID={`${testID}-track`}
              stroke={resolvedTrackColor}
              animatedProps={trackProps}
              {...circleProps}
            />
          </Svg>
        </Animated.View>
      ) : null}
      <Animated.View
        key="active"
        style={[styles.layer, activeRotation]}
        pointerEvents="none"
      >
        <Svg width={size} height={size}>
          <AnimatedCircle
            testID={`${testID}-active`}
            stroke={activeColor}
            animatedProps={activeProps}
            {...circleProps}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CircularProgressIndicator;
