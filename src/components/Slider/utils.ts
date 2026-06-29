export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function snapToStep(
  value: number,
  min: number,
  max: number,
  step: number
): number {
  if (step <= 0) return clamp(value, min, max);
  const snapped = Math.round((value - min) / step) * step + min;
  return clamp(snapped, min, max);
}

export function valueToFraction(
  value: number,
  min: number,
  max: number
): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

export function fractionToValue(
  fraction: number,
  min: number,
  max: number,
  step: number
): number {
  const raw = min + clamp(fraction, 0, 1) * (max - min);
  return snapToStep(raw, min, max, step);
}

export function positionToFraction(
  touchPx: number,
  trackLengthPx: number,
  isRTL: boolean,
  isVertical: boolean
): number {
  if (trackLengthPx <= 0) return 0;
  let fraction = touchPx / trackLengthPx;
  // Vertical: top of track = max, bottom = min (invert)
  if (isVertical) fraction = 1 - fraction;
  // RTL horizontal: invert
  if (!isVertical && isRTL) fraction = 1 - fraction;
  return clamp(fraction, 0, 1);
}

export function stopFractions(
  min: number,
  max: number,
  step: number
): number[] {
  if (step <= 0 || max <= min) return [];
  const fractions: number[] = [];
  let v = min;
  while (v <= max + Number.EPSILON) {
    fractions.push(valueToFraction(v, min, max));
    v += step;
  }
  return fractions;
}

export type SliderVariant = 'standard' | 'centered' | 'range';

export function activeSegment(
  variant: SliderVariant,
  valueFraction: number,
  startFraction: number
): [number, number] {
  if (variant === 'range') {
    return [
      Math.min(startFraction, valueFraction),
      Math.max(startFraction, valueFraction),
    ];
  }
  if (variant === 'centered') {
    return [Math.min(0.5, valueFraction), Math.max(0.5, valueFraction)];
  }
  return [0, valueFraction];
}

export function nearestHandle(
  touchFraction: number,
  startFraction: number,
  endFraction: number
): 'start' | 'end' {
  const distStart = Math.abs(touchFraction - startFraction);
  const distEnd = Math.abs(touchFraction - endFraction);
  return distStart < distEnd ? 'start' : 'end';
}
