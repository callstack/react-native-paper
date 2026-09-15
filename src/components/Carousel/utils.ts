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
  snapToInterval?: number;
  disableIntervalMomentum?: boolean;
  decelerationRate: 'fast' | 'normal';
};

/**
 * Translates a strategy's fling behaviour into scroll view props.
 *
 * The snap target is the focal keyline offset rather than the container edge.
 * On the unmasked axis that offset is a whole number of items, which is why a
 * plain interval is enough to express it.
 */
export function getSnapScrollProps(
  strategy: CarouselStrategy
): SnapScrollProps {
  switch (strategy.snap) {
    case 'single':
      return {
        snapToInterval: strategy.itemSize,
        disableIntervalMomentum: true,
        decelerationRate: 'fast',
      };
    case 'multi':
      // Momentum decays across several items, then settles on the nearest
      // focal keyline.
      return {
        snapToInterval: strategy.itemSize,
        decelerationRate: 'normal',
      };
    default:
      return { decelerationRate: 'normal' };
  }
}
