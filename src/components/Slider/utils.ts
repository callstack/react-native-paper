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

/**
 * The slider renders left-to-right in every direction: nothing in its handle,
 * track, corner radii or icon placement is mirrored for RTL. Honouring `isRTL`
 * here while that is true inverts the drag against the handle, so that dragging
 * right moves the handle right and lowers the value.
 *
 * Flip this to `true` in the same change that mirrors the rendering.
 */
const RTL_MIRRORING_IMPLEMENTED = false;

/**
 * Maps a touch position along the track axis onto a value fraction.
 *
 * `insetStart` and `insetEnd` must match the range the handle is drawn across,
 * otherwise the handle trails behind the finger by up to the inset. Distance is
 * resolved in the direction values grow *before* the inset is applied, so the
 * two insets stay independent rather than only working when they are equal.
 */
export function positionToFraction(
  touchPx: number,
  trackLengthPx: number,
  isRTL: boolean,
  isVertical: boolean,
  insetStart: number = 0,
  insetEnd: number = 0
): number {
  const usable = trackLengthPx - insetStart - insetEnd;
  if (usable <= 0) return 0;
  // Vertical: top of track = max, bottom = min.
  const along =
    isVertical || (isRTL && RTL_MIRRORING_IMPLEMENTED)
      ? trackLengthPx - touchPx
      : touchPx;
  return clamp((along - insetStart) / usable, 0, 1);
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

/** Handles closer together than this count as sitting on the same value. */
const HANDLE_OVERLAP_EPSILON = 1e-4;

/** Pixels a drag must travel before its direction is taken as deliberate. */
export const HANDLE_DIRECTION_THRESHOLD = 1;

/**
 * Picks the handle a range gesture should drag.
 *
 * While the handles are apart it is simply the nearest one. Once they sit on the
 * same value there is no nearest handle (every touch is equidistant), and
 * guessing deadlocks the gesture: with both at `max`, the end handle is floored
 * by the start handle and cannot move, while the start handle can never be
 * picked. So overlap defers to 'pending', and the drag direction decides.
 */
export function rangeHandleForTouch(
  touchFraction: number,
  startFraction: number,
  endFraction: number
): 'start' | 'end' | 'pending' {
  if (Math.abs(endFraction - startFraction) <= HANDLE_OVERLAP_EPSILON) {
    return 'pending';
  }
  return nearestHandle(touchFraction, startFraction, endFraction);
}
