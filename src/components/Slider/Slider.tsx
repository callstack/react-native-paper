import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import type { SliderProps } from './types';
import { useInternalTheme } from '../../core/theming';

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const round = (v: number, step: number) => {
  if (!step) return v;
  return Math.round(v / step) * step;
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: 'center',
    paddingVertical: 12,
  } as ViewStyle,
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  } as ViewStyle,
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: -6,
    marginLeft: -8,
  } as ViewStyle,
});

/**
 * Material 3 Slider.
 *
 * A horizontal slider that lets the user pick a value between `min` and `max`
 * by dragging or tapping the track. The thumb position reflects the
 * controlled `value`.
 *
 * @param props
 */
function Slider({
  value,
  min = 0,
  max = 1,
  step,
  onValueChange,
  disabled = false,
  color,
  trackColor,
  thumbColor,
  style,
  theme: themeOverrides,
  testID = 'slider',
}: SliderProps) {
  const theme = useInternalTheme(themeOverrides);
  const [width, setWidth] = React.useState(0);

  const activeColor =
    color ?? (theme.isV3 ? theme.colors.primary : theme.colors.accent);
  const inactiveColor =
    trackColor ?? (theme.isV3 ? theme.colors.surfaceVariant : '#bdbdbd');
  const thumbTintColor = thumbColor ?? activeColor;

  const span = Math.max(max - min, 1e-9);
  const pct = clamp((value - min) / span, 0, 1);

  const valueFromX = (x: number) => {
    const ratio = width > 0 ? clamp(x / width, 0, 1) : 0;
    let next = min + ratio * span;
    if (step) next = min + round(next - min, step);
    return clamp(next, min, max);
  };

  const handleResponder = (e: { nativeEvent: { locationX: number } }) => {
    if (disabled || width <= 0) return;
    onValueChange?.(valueFromX(e.nativeEvent.locationX));
  };

  const handleLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      testID={testID}
      style={[styles.container, style]}
      accessibilityRole="adjustable"
      accessibilityValue={{
        min,
        max,
        now: value,
      }}
      accessibilityState={disabled ? { disabled: true } : undefined}
    >
      <View
        testID={`${testID}-track`}
        style={[styles.track, { backgroundColor: inactiveColor }]}
        onLayout={handleLayout}
        onStartShouldSetResponder={() => !disabled}
        onResponderGrant={handleResponder}
        onResponderMove={handleResponder}
      >
        <View
          testID={`${testID}-active`}
          style={
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${pct * 100}%`,
              backgroundColor: activeColor,
            } as ViewStyle
          }
        />
        <View
          testID={`${testID}-thumb`}
          style={[
            styles.thumb,
            {
              left: pct * width,
              backgroundColor: thumbTintColor,
              opacity: disabled ? 0.4 : 1,
            } as ViewStyle,
          ]}
        />
      </View>
    </View>
  );
}

export default Slider;
