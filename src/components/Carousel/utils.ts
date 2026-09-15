import type { ColorValue } from 'react-native';

import type { CarouselStrategy, KeylineState } from './strategy';
import { CarouselTokens } from './tokens';
import type { InternalTheme } from '../../theme/types';

export type CarouselColors = {
  containerColor: ColorValue;
  outlineColor: ColorValue;
  focusIndicatorColor: ColorValue;
  hoverStateLayerColor: ColorValue;
  focusStateLayerColor: ColorValue;
  pressedStateLayerColor: ColorValue;
};

export function getDefaultCarouselColors(theme: InternalTheme): CarouselColors {
  const t = CarouselTokens;
  const c = theme.colors;
  return {
    containerColor: c[t.containerColor],
    outlineColor: c[t.outlineColor],
    focusIndicatorColor: c[t.focusIndicatorColor],
    hoverStateLayerColor: c[t.hoverStateLayerColor],
    focusStateLayerColor: c[t.focusStateLayerColor],
    pressedStateLayerColor: c[t.pressedStateLayerColor],
  };
}

export type Placement = {
  /** Where the item's centre is drawn, in container coordinates. */
  center: number;
  /** The item's masked size. */
  size: number;
};

/**
 * Reads a keyline state at a fractional keyline index.
 *
 * Indices outside the state clamp to its outermost keyline, which is the gone
 * keyline — items that far out are off-screen anyway.
 */
function sampleKeylines(state: KeylineState, index: number): Placement {
  'worklet';
  const count = state.sizes.length;
  const clamped = Math.min(Math.max(index, 0), count - 1);
  const lower = Math.min(Math.floor(clamped), count - 2);
  const t = clamped - lower;

  return {
    center:
      state.centers[lower] +
      (state.centers[lower + 1] - state.centers[lower]) * t,
    size:
      state.sizes[lower] + (state.sizes[lower + 1] - state.sizes[lower]) * t,
  };
}

/**
 * Maps an item onto the keylines at the current scroll offset.
 *
 * Items live on an unmasked axis where item `i` is centred at
 * `(i + 0.5) * itemSize`. Subtracting the scroll offset gives the position the
 * keylines are read at, so scrolling to `i * itemSize` always puts item `i` on
 * the first focal keyline — which is why the snap offsets are multiples of the
 * item size rather than of the container width.
 *
 * Near either end the keylines blend into the shifted states, and the focal
 * index is blended along with them so the mapping stays continuous.
 */
export function resolveItemPlacement(
  strategy: CarouselStrategy,
  scroll: number,
  index: number
): Placement {
  'worklet';
  const {
    itemSize,
    startState,
    defaultState,
    endState,
    startShift,
    endShift,
    maxScroll,
  } = strategy;

  let from = defaultState;
  let to = defaultState;
  let t = 0;

  if (startShift > 0 && scroll < startShift) {
    from = startState;
    to = defaultState;
    t = Math.min(Math.max(scroll / startShift, 0), 1);
  } else if (endShift > 0 && scroll > maxScroll - endShift) {
    from = defaultState;
    to = endState;
    t = Math.min(Math.max((scroll - (maxScroll - endShift)) / endShift, 0), 1);
  }

  const focalStart = from.focalStart + (to.focalStart - from.focalStart) * t;
  const position = (index + 0.5) * itemSize - scroll;
  const keylineIndex = position / itemSize - 0.5 + focalStart;

  const a = sampleKeylines(from, keylineIndex);
  const b = sampleKeylines(to, keylineIndex);

  return {
    center: a.center + (b.center - a.center) * t,
    size: a.size + (b.size - a.size) * t,
  };
}

/**
 * How many keylines a strategy has inside and around the container — the
 * number of items that can be on screen at once, used to size the render
 * window.
 */
export function visibleSlotCount(strategy: CarouselStrategy): number {
  return strategy.defaultState.sizes.length;
}

export type SnapScrollProps = {
  decelerationRate: 'normal' | number;
};

/**
 * Hands the settle to the platform or to us.
 *
 * Where the carousel snaps, native deceleration is switched off entirely: the
 * scroll view stops dead when the finger lifts and the decay-plus-spring in
 * `resolveSettleOffset` takes over, so the settle runs on the M3 spring rather
 * than on the platform's own curve. An uncontained carousel does not snap, so
 * it keeps native momentum.
 */
export function getSnapScrollProps(
  strategy: CarouselStrategy
): SnapScrollProps {
  return { decelerationRate: strategy.snap === 'none' ? 'normal' : 0 };
}

/**
 * How far a fling coasts, in seconds of its release velocity.
 *
 * This is the standard projection for a scroll view decelerating at 0.998 per
 * millisecond: `v * rate / (1 - rate)`, which works out at roughly half a
 * second of travel.
 */
const DECAY_PROJECTION = 0.5;

/** A fling shorter than this fraction of an item is treated as a hold. */
const SINGLE_ADVANCE_THRESHOLD = 0.15;

/**
 * Where a fling should come to rest.
 *
 * The three layouts settle differently, and the difference is entirely in this
 * function — `single` advances by at most one item from wherever the drag
 * started, `multi` lets the decay projection carry across as many items as the
 * fling earned, and `none` does not settle at all.
 *
 * The target is always a focal keyline offset, never a container edge: on the
 * unmasked axis those offsets are whole multiples of the item size.
 *
 * `velocity` is in points per second, positive towards the end of the list.
 */
export function resolveSettleOffset(
  strategy: CarouselStrategy,
  offset: number,
  dragStartOffset: number,
  velocity: number
): number | null {
  'worklet';
  const { snap, itemSize, maxScroll } = strategy;
  if (snap === 'none' || itemSize <= 0) {
    return null;
  }

  const projected = offset + velocity * DECAY_PROJECTION;

  if (snap === 'multi') {
    const index = Math.round(projected / itemSize);
    return Math.min(Math.max(index * itemSize, 0), maxScroll);
  }

  const startIndex = Math.round(dragStartOffset / itemSize);
  const travelled = (projected - dragStartOffset) / itemSize;
  const step =
    travelled > SINGLE_ADVANCE_THRESHOLD
      ? 1
      : travelled < -SINGLE_ADVANCE_THRESHOLD
        ? -1
        : 0;

  return Math.min(Math.max((startIndex + step) * itemSize, 0), maxScroll);
}
