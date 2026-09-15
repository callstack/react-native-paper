import type { SharedValue } from 'react-native-reanimated';

/**
 * Which arrangement the carousel lays its items out in.
 *
 * - `multi-browse` shows one or two large items next to a medium and a small
 *   one, so several items are browsable at a glance.
 * - `hero` puts the emphasis on a single large item with small items peeking
 *   at one or both sides.
 * - `uncontained` keeps items at the size they were asked for and lets the
 *   last one run past the container edge. It is the layout to reach for when
 *   item aspect ratios have to be preserved.
 * - `full-screen` shows one item filling the container.
 */
export type CarouselLayout =
  | 'multi-browse'
  | 'hero'
  | 'uncontained'
  | 'full-screen';

/** Where the focal (large) item sits. Only `hero` reads this. */
export type CarouselAlignment = 'start' | 'center';

/**
 * How a fling settles.
 *
 * - `single` advances by exactly one item per fling.
 * - `multi` lets momentum decay across several items before springing to the
 *   nearest focal keyline.
 * - `none` does not snap at all.
 */
export type CarouselSnap = 'single' | 'multi' | 'none';

/**
 * The visible rectangle of an item, in item-local coordinates.
 *
 * Items are never resized — every item is measured at the large size for the
 * whole of its life — so this rectangle, not the item's box, is what changes
 * as the item moves through the keylines.
 */
export type CarouselMaskRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/**
 * Live mask state handed to `renderItem`. `rect` and `expansion` are shared
 * values written on the UI thread, so reading them from a `useAnimatedStyle`
 * costs no re-renders.
 */
export type CarouselItemMask = {
  /** The item's visible rectangle, in item-local coordinates. */
  rect: SharedValue<CarouselMaskRect>;
  /** `0` when the item is fully collapsed, `1` when it is at full size. */
  expansion: SharedValue<number>;
  /** Width every item is measured at, mask or no mask. */
  width: number;
  /** Height every item is measured at. */
  height: number;
};

export type CarouselRenderItemInfo<ItemT> = {
  item: ItemT;
  index: number;
  mask: CarouselItemMask;
};
