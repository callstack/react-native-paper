import type { ColorValue } from 'react-native';

import { SliderTokens } from './tokens';
import type { InternalTheme } from '../../theme/types';

export type SliderColors = {
  activeTrackColor: ColorValue;
  inactiveTrackColor: ColorValue;
  handleColor: ColorValue;
  stopIndicatorActiveColor: ColorValue;
  stopIndicatorInactiveColor: ColorValue;
  valueIndicatorContainerColor: ColorValue;
  valueIndicatorTextColor: ColorValue;
  stateLayerColor: ColorValue;
  iconColor: ColorValue;

  disabledActiveTrackColor: ColorValue;
  disabledInactiveTrackColor: ColorValue;
  disabledHandleColor: ColorValue;
  disabledStopIndicatorColor: ColorValue;
  disabledIconColor: ColorValue;
};

export function getDefaultSliderColors(theme: InternalTheme): SliderColors {
  const t = SliderTokens;
  const c = theme.colors;

  return {
    activeTrackColor: c[t.activeTrackColor],
    inactiveTrackColor: c[t.inactiveTrackColor],
    handleColor: c[t.handleColor],
    stopIndicatorActiveColor: c[t.stopIndicatorActiveColor],
    stopIndicatorInactiveColor: c[t.stopIndicatorInactiveColor],
    valueIndicatorContainerColor: c[t.valueIndicatorContainerColor],
    valueIndicatorTextColor: c[t.valueIndicatorTextColor],
    stateLayerColor: c[t.stateLayerColor],
    iconColor: c[t.iconColor],

    disabledActiveTrackColor: c[t.disabledActiveTrackColor],
    disabledInactiveTrackColor: c[t.disabledInactiveTrackColor],
    disabledHandleColor: c[t.disabledHandleColor],
    disabledStopIndicatorColor: c[t.disabledStopIndicatorColor],
    disabledIconColor: c[t.disabledIconColor],
  };
}

/**
 * Clamps a number between min and max inclusive.
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Snaps a value to the nearest step within [min, max].
 */
export function snapToStep(
  value: number,
  min: number,
  max: number,
  step?: number
): number {
  if (typeof step !== 'number' || step <= 0) {
    return clamp(value, min, max);
  }

  const stepsCount = Math.round((value - min) / step);
  const snapped = min + stepsCount * step;

  // Fix possible floating point inaccuracies (e.g., 0.1 + 0.2 = 0.30000000000000004)
  const precision = (step.toString().split('.')[1] || '').length;
  const fixed = Number(snapped.toFixed(Math.max(precision, 4)));

  return clamp(fixed, min, max);
}

/**
 * Converts a value to a ratio between 0 and 1.
 */
export function getRatioFromValue(
  value: number,
  min: number,
  max: number
): number {
  if (max <= min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/**
 * Converts a 0..1 ratio to a stepped value between min and max.
 */
export function getValueFromRatio(
  ratio: number,
  min: number,
  max: number,
  step?: number
): number {
  const raw = min + ratio * (max - min);
  return snapToStep(raw, min, max, step);
}

/**
 * Computes the normalized tick mark ratios [0..1] for a discrete slider.
 */
export function getTickMarks(
  min: number,
  max: number,
  step?: number
): number[] {
  if (typeof step !== 'number' || step <= 0 || max <= min) {
    return [];
  }

  const ticks: number[] = [];
  const range = max - min;
  const stepsCount = Math.floor(range / step);

  // Guard against extreme number of ticks causing performance degradation
  if (stepsCount > 100) {
    return [];
  }

  for (let i = 0; i <= stepsCount; i++) {
    const val = min + i * step;
    ticks.push((val - min) / range);
  }

  // Include the final max tick if not already added
  const lastTick = ticks[ticks.length - 1];
  if (lastTick !== undefined && lastTick < 0.9999) {
    ticks.push(1);
  }

  return ticks;
}
