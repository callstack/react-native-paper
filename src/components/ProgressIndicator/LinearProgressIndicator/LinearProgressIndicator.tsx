import * as React from 'react';
import {
  type ColorValue,
  type LayoutChangeEvent,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { LinearProgressIndicatorTokens as T } from './tokens';
import { useLocale } from '../../../core/locale';
import { useInternalTheme } from '../../../core/theming';
import type { ThemeProp } from '../../../types';
import { useIndeterminatePhase, useProgressAccessibility } from '../hooks';
import {
  LINEAR_INDETERMINATE_DURATION as CYCLE,
  LINEAR_INDETERMINATE_LINES as LINES,
  lineFraction,
} from '../indeterminateSpecs';
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
   * Color of the active indicator and the stop dot. Defaults to `theme.colors.primary`.
   */
  color?: ColorValue;
  /**
   * Color of the track. Defaults to `theme.colors.secondaryContainer`.
   */
  trackColor?: ColorValue;
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

/**
 * Material Design 3 linear progress indicator. Supports determinate and indeterminate modes.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { LinearProgressIndicator } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <LinearProgressIndicator progress={0.5} />
 * );
 *
 * export default MyComponent;
 * ```
 */
const LinearProgressIndicator = ({
  progress = 0,
  indeterminate = false,
  color,
  trackColor,
  thickness = T.activeThickness,
  style,
  theme: themeOverrides,
  testID = 'linear-progress-indicator',
  accessibilityLabel,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();

  const xSign = direction === 'ltr' ? 1 : -1;
  const leadingAnchor: ViewStyle =
    Platform.OS === 'web' && direction === 'rtl' ? { right: 0 } : { left: 0 };

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

  const radius = thickness / 2;
  const stopSize = Math.min(thickness, T.stopSize);
  const stopOffset = Math.min(
    (thickness - stopSize) / 2,
    T.stopTrailingSpaceMax
  );
  const gap = T.trackActiveSpace;

  const phase = useIndeterminatePhase(indeterminate, CYCLE);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const activeDeterminateStyle = useAnimatedStyle(() => {
    const p = Math.min(
      1,
      Math.max(0, typeof progress === 'number' ? progress : progress.value)
    );
    const w = p <= 0 ? 0 : Math.max(p * width, thickness);
    return { width: w };
  }, [progress, width, thickness]);

  const trackDeterminateStyle = useAnimatedStyle(() => {
    const p = Math.min(
      1,
      Math.max(0, typeof progress === 'number' ? progress : progress.value)
    );
    const head = p * width;
    const activeWidth = p <= 0 ? 0 : Math.max(head, thickness);
    const gapPx = activeWidth > 0 ? Math.min(gap, head) : 0;
    const offset = Math.min(activeWidth + gapPx, width);
    return {
      transform: [{ translateX: xSign * offset }],
      width: Math.max(0, width - offset),
    };
  }, [progress, width, thickness, gap, xSign]);

  const segment1Style = useAnimatedStyle(() => {
    const elapsed = phase.value * CYCLE;
    const tail =
      lineFraction(elapsed, LINES.firstTail.delay, LINES.firstTail.duration) *
      width;
    const head =
      lineFraction(elapsed, LINES.firstHead.delay, LINES.firstHead.duration) *
      width;
    return {
      transform: [{ translateX: xSign * tail }],
      width: Math.max(0, head - tail),
    };
  }, [width, xSign]);

  const segment2Style = useAnimatedStyle(() => {
    const elapsed = phase.value * CYCLE;
    const tail =
      lineFraction(elapsed, LINES.secondTail.delay, LINES.secondTail.duration) *
      width;
    const head =
      lineFraction(elapsed, LINES.secondHead.delay, LINES.secondHead.duration) *
      width;
    return {
      transform: [{ translateX: xSign * tail }],
      width: Math.max(0, head - tail),
    };
  }, [width, xSign]);

  const trackRightStyle = useAnimatedStyle(() => {
    const elapsed = phase.value * CYCLE;
    const firstHead =
      lineFraction(elapsed, LINES.firstHead.delay, LINES.firstHead.duration) *
      width;
    const offset = firstHead > 0 ? firstHead + gap : 0;
    return {
      transform: [{ translateX: xSign * offset }],
      width: Math.max(0, width - offset),
    };
  }, [width, gap, xSign]);

  const trackMiddleStyle = useAnimatedStyle(() => {
    const elapsed = phase.value * CYCLE;
    const secondHead =
      lineFraction(elapsed, LINES.secondHead.delay, LINES.secondHead.duration) *
      width;
    const firstTail =
      lineFraction(elapsed, LINES.firstTail.delay, LINES.firstTail.duration) *
      width;
    const offset = secondHead > 0 ? secondHead + gap : 0;
    const end = firstTail < width ? firstTail - gap : width;
    return {
      transform: [{ translateX: xSign * offset }],
      width: Math.max(0, end - offset),
    };
  }, [width, gap, xSign]);

  const trackLeftStyle = useAnimatedStyle(() => {
    const elapsed = phase.value * CYCLE;
    const secondTail =
      lineFraction(elapsed, LINES.secondTail.delay, LINES.secondTail.duration) *
      width;
    return { width: Math.max(0, secondTail - gap) };
  }, [width, gap]);

  const lineStyle = { height: thickness, borderRadius: radius };

  let body: React.ReactNode;
  if (!indeterminate) {
    body = (
      <>
        <Animated.View
          key="determinate-track"
          testID={`${testID}-track`}
          style={[
            styles.positioned,
            leadingAnchor,
            lineStyle,
            { backgroundColor: resolvedTrackColor },
            trackDeterminateStyle,
          ]}
        />
        <Animated.View
          key="determinate-active"
          testID={`${testID}-active`}
          style={[
            styles.positioned,
            leadingAnchor,
            lineStyle,
            { backgroundColor: activeColor },
            activeDeterminateStyle,
          ]}
        />
        {width > 0 ? (
          <View
            key="determinate-stop"
            testID={`${testID}-stop`}
            style={[
              styles.stop,
              {
                width: stopSize,
                height: stopSize,
                borderRadius: stopSize / 2,
                top: (thickness - stopSize) / 2,
                backgroundColor: stopColor,
              },
              Platform.OS === 'web' && direction === 'rtl'
                ? { left: stopOffset }
                : { right: stopOffset },
            ]}
          />
        ) : null}
      </>
    );
  } else {
    body = (
      <>
        <Animated.View
          key="indeterminate-track-left"
          testID={`${testID}-track`}
          style={[
            styles.positioned,
            leadingAnchor,
            lineStyle,
            { backgroundColor: resolvedTrackColor },
            trackLeftStyle,
          ]}
        />
        <Animated.View
          key="indeterminate-track-middle"
          style={[
            styles.positioned,
            leadingAnchor,
            lineStyle,
            { backgroundColor: resolvedTrackColor },
            trackMiddleStyle,
          ]}
        />
        <Animated.View
          key="indeterminate-track-right"
          style={[
            styles.positioned,
            leadingAnchor,
            lineStyle,
            { backgroundColor: resolvedTrackColor },
            trackRightStyle,
          ]}
        />
        <Animated.View
          key="indeterminate-segment-1"
          testID={`${testID}-active`}
          style={[
            styles.positioned,
            leadingAnchor,
            lineStyle,
            { backgroundColor: activeColor },
            segment1Style,
          ]}
        />
        <Animated.View
          key="indeterminate-segment-2"
          style={[
            styles.positioned,
            leadingAnchor,
            lineStyle,
            { backgroundColor: activeColor },
            segment2Style,
          ]}
        />
      </>
    );
  }

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
      style={[styles.container, { height: thickness }, style]}
    >
      <View style={styles.inner}>{body}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    overflow: 'visible',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  positioned: {
    position: 'absolute',
  },
  stop: {
    position: 'absolute',
  },
});

export default LinearProgressIndicator;
