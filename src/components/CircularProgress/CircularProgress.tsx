import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import type { CircularProgressProps } from './types';
import { useInternalTheme } from '../../core/theming';

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
});

/**
 * Material 3 determinate circular progress indicator.
 *
 * Shows a circular track with a progress arc covering `progress` of the
 * circle (0 to 1). Unlike {@link ActivityIndicator}, it represents a known
 * amount of progress rather than an indeterminate spin.
 *
 * @param props
 */
function CircularProgress({
  progress,
  size = 48,
  thickness = 4,
  color,
  trackColor,
  style,
  theme: themeOverrides,
  testID = 'circular-progress',
}: CircularProgressProps) {
  const theme = useInternalTheme(themeOverrides);
  const p = clamp(progress, 0, 1);

  const progressColor =
    color ?? (theme.isV3 ? theme.colors.primary : theme.colors.accent);
  const backgroundColor =
    trackColor ??
    (theme.isV3 ? theme.colors.primary : theme.colors.accent) + '33';

  const radius = size / 2;
  // The progress arc is drawn with two half-discs that rotate as the progress
  // passes 0.5, which lets a circular arc be rendered without an SVG dep.
  const firstHalfAngle = p <= 0.5 ? p * 360 : 180;
  const secondHalfAngle = p > 0.5 ? (p - 0.5) * 360 : 0;

  const trackStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    borderWidth: thickness,
    borderColor: backgroundColor,
  };

  // Each progress half is a full circle clipped to its half, rotated by the
  // angle that exposes the right amount of arc.
  const halfSize = radius;
  const arcLayerStyle = (angle: number, flipSecond: boolean): ViewStyle => ({
    width: size,
    height: halfSize,
    overflow: 'hidden',
    transform: [
      { rotate: `${angle}deg` },
      ...(flipSecond ? [{ translateY: -halfSize }] : []),
    ],
    ...(flipSecond ? { top: halfSize } : { top: 0 }),
    left: 0,
    position: 'absolute',
  });

  const arcDotStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    borderWidth: thickness,
    borderColor: progressColor,
    // Hide the track border on the progress disc by only drawing the arc.
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  };

  return (
    <View
      testID={testID}
      style={[styles.container, trackStyle, style]}
      accessibilityRole="progressbar"
      accessibilityState={{ busy: false }}
      accessibilityValue={{ min: 0, max: 1, now: p }}
    >
      <View
        testID={`${testID}-half-first`}
        style={arcLayerStyle(firstHalfAngle, false)}
      >
        <View style={arcDotStyle} />
      </View>
      <View
        testID={`${testID}-half-second`}
        style={arcLayerStyle(secondHalfAngle, true)}
      >
        <View style={arcDotStyle} />
      </View>
    </View>
  );
}

export default CircularProgress;
