import { CarouselGeometry } from './tokens';
import type { CarouselAlignment, CarouselLayout, CarouselSnap } from './types';

const {
  smallSizeMin: SMALL_MIN,
  smallSizeMax: SMALL_MAX,
  anchorSize: ANCHOR,
  goneSize: GONE,
  heroLargeMaxAspectRatio: HERO_MAX_ASPECT,
  heroCentreAlignedMinItemCount: HERO_CENTRE_MIN_ITEMS,
  heroLargeCountMax: HERO_LARGE_COUNT_MAX,
  uncontainedMediumThreshold: UNCONTAINED_MEDIUM_THRESHOLD,
} = CarouselGeometry;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * One keyline state: the masked size an item takes at each stop across the
 * container, and where that stop is drawn.
 *
 * Both arrays include the two off-container keylines at either end — an anchor
 * and a gone keyline — so an item shrinks to a sliver at the edge rather than
 * popping out of existence.
 */
export type KeylineState = {
  /** Masked size at each keyline. */
  sizes: number[];
  /** Centre of each keyline, in container coordinates. */
  centers: number[];
  /** Index of the first focal (large) keyline. */
  focalStart: number;
  /** Index of the last focal (large) keyline. */
  focalEnd: number;
};

/**
 * Everything the render pass needs to place an item at a given scroll offset.
 *
 * Items are laid out on an *unmasked* axis where every item occupies
 * `itemSize`, and the keylines map a position on that axis onto a drawn centre
 * and a masked size. `startState` and `endState` are the same keylines
 * permuted so the focal range sits hard against the start or the end of the
 * container; the carousel blends into them over the first and last
 * `startShift` / `endShift` of scroll so the first and last items can be
 * focal.
 */
export type CarouselStrategy = {
  /** The unmasked item size — what every item is measured at. */
  itemSize: number;
  focalCount: number;
  startState: KeylineState;
  defaultState: KeylineState;
  endState: KeylineState;
  startShift: number;
  endShift: number;
  maxScroll: number;
  contentSize: number;
  snap: CarouselSnap;
};

/**
 * Lays keylines out across the container.
 *
 * `sizes` are the in-container keylines and must sum to `containerSize`; the
 * anchor and gone keylines are added outside either edge.
 */
function buildState(
  sizes: number[],
  focalStart: number,
  focalEnd: number,
  containerSize: number
): KeylineState {
  const allSizes = [GONE, ANCHOR, ...sizes, ANCHOR, GONE];

  const centers: number[] = [-(ANCHOR + GONE / 2), -ANCHOR / 2];
  let edge = 0;
  for (const size of sizes) {
    centers.push(edge + size / 2);
    edge += size;
  }
  centers.push(containerSize + ANCHOR / 2);
  centers.push(containerSize + ANCHOR + GONE / 2);

  return {
    sizes: allSizes,
    centers,
    focalStart: focalStart + 2,
    focalEnd: focalEnd + 2,
  };
}

/**
 * Builds the default, start-shifted and end-shifted keyline states from one
 * in-container arrangement.
 *
 * The shifted states are permutations of the same sizes, so the three states
 * always have the same keyline count and can be interpolated pairwise. Items
 * move outward from the focal range in both directions, which is why the
 * leading keylines are reversed when they are moved behind it.
 */
function buildStates(
  sizes: number[],
  focalStart: number,
  focalEnd: number,
  containerSize: number,
  itemSize: number,
  itemCount: number,
  snap: CarouselSnap
): CarouselStrategy {
  const before = sizes.slice(0, focalStart);
  const focal = sizes.slice(focalStart, focalEnd + 1);
  const after = sizes.slice(focalEnd + 1);
  const outward = [...after, ...before.slice().reverse()];

  const defaultState = buildState(sizes, focalStart, focalEnd, containerSize);
  const startState = buildState(
    [...focal, ...outward],
    0,
    focal.length - 1,
    containerSize
  );
  const endState = buildState(
    [...outward.slice().reverse(), ...focal],
    outward.length,
    outward.length + focal.length - 1,
    containerSize
  );

  const focalCount = focal.length;
  // Scroll is measured on the unmasked axis, so shifting the focal range by one
  // keyline is worth exactly one item of scroll.
  const startShift =
    (defaultState.focalStart - startState.focalStart) * itemSize;
  const endShift = (endState.focalStart - defaultState.focalStart) * itemSize;
  const maxScroll = Math.max((itemCount - focalCount) * itemSize, 0);

  return {
    itemSize,
    focalCount,
    startState,
    defaultState,
    endState,
    startShift,
    endShift,
    maxScroll,
    contentSize: maxScroll + containerSize,
    snap,
  };
}

type Targets = {
  targetSmall: number;
  targetMedium: number;
  targetLarge: number;
};

type Arrangement = {
  smallCount: number;
  smallSize: number;
  mediumCount: number;
  mediumSize: number;
  largeCount: number;
  largeSize: number;
  cost: number;
};

/**
 * Fits one candidate arrangement to the container exactly.
 *
 * Small items flex first, inside their 40–56dp band; the large items then
 * absorb whatever is left. Because a medium item is defined as the mean of a
 * large and a small one, that second step has a closed form.
 */
function fitArrangement(
  available: number,
  { targetSmall, targetMedium, targetLarge }: Targets,
  smallCount: number,
  mediumCount: number,
  largeCount: number,
  priority: number
): Arrangement | null {
  if (largeCount < 1) {
    return null;
  }

  const naturalSpace =
    largeCount * targetLarge +
    mediumCount * targetMedium +
    smallCount * targetSmall;
  const delta = available - naturalSpace;

  const smallSize =
    smallCount > 0
      ? clamp(targetSmall + delta / smallCount, SMALL_MIN, SMALL_MAX)
      : 0;

  const largeSize =
    (available - smallSize * (smallCount + mediumCount / 2)) /
    (largeCount + mediumCount / 2);
  const mediumSize = mediumCount > 0 ? (largeSize + smallSize) / 2 : 0;

  if (largeSize <= 0) {
    return null;
  }
  if (smallCount > 0 && largeSize < smallSize) {
    return null;
  }
  if (mediumCount > 0 && mediumSize < smallSize) {
    return null;
  }

  return {
    smallCount,
    smallSize,
    mediumCount,
    mediumSize,
    largeCount,
    largeSize,
    cost: Math.abs(targetLarge - largeSize) * priority,
  };
}

/**
 * Picks the arrangement whose large items land closest to the requested size,
 * weighted by how far down the preference order the candidate sits.
 */
function findLowestCostArrangement(
  available: number,
  targets: Targets,
  smallCounts: number[],
  mediumCounts: number[],
  largeCounts: number[],
  itemCount: number
): Arrangement | null {
  let best: Arrangement | null = null;
  let priority = 1;

  for (const smallCount of smallCounts) {
    for (const mediumCount of mediumCounts) {
      for (const largeCount of largeCounts) {
        const candidate =
          smallCount + mediumCount + largeCount > itemCount
            ? null
            : fitArrangement(
                available,
                targets,
                smallCount,
                mediumCount,
                largeCount,
                priority
              );
        priority += 1;
        if (candidate && (best === null || candidate.cost < best.cost)) {
          best = candidate;
        }
      }
    }
  }

  return best;
}

function toSizes(arrangement: Arrangement): number[] {
  return [
    ...new Array<number>(arrangement.largeCount).fill(arrangement.largeSize),
    ...new Array<number>(arrangement.mediumCount).fill(arrangement.mediumSize),
    ...new Array<number>(arrangement.smallCount).fill(arrangement.smallSize),
  ];
}

function descendingRange(from: number, to: number): number[] {
  const values: number[] = [];
  for (let value = from; value >= to; value--) {
    values.push(value);
  }
  return values;
}

function multiBrowseSizes(
  available: number,
  preferredItemSize: number,
  itemCount: number
): { sizes: number[]; focalEnd: number } {
  const targetLarge = Math.min(preferredItemSize, available);
  const targetSmall = clamp(targetLarge / 3, SMALL_MIN, SMALL_MAX);
  const targets: Targets = {
    targetLarge,
    targetSmall,
    targetMedium: (targetLarge + targetSmall) / 2,
  };

  // Multi-browse always keeps a small item — it is what tells the reader the
  // strip continues — so the only reason to drop it is a container too narrow
  // to hold one. Letting the solver choose 0 smalls would win on large-size
  // cost and quietly turn the layout into a plain pager.
  const smallCounts = available < SMALL_MIN * 2 ? [0] : [1];
  const mediumCounts = [1, 0];
  const largeCounts = descendingRange(
    Math.max(1, Math.floor(available / targetLarge)),
    1
  );

  const arrangement =
    findLowestCostArrangement(
      available,
      targets,
      smallCounts,
      mediumCounts,
      largeCounts,
      itemCount
    ) ??
    // Nothing fit within the item count — fall back to filling the container
    // with as many large items as there are items to put in it.
    ({
      smallCount: 0,
      smallSize: 0,
      mediumCount: 0,
      mediumSize: 0,
      largeCount: Math.max(1, Math.min(itemCount, largeCounts[0])),
      largeSize: available / Math.max(1, Math.min(itemCount, largeCounts[0])),
      cost: 0,
    } satisfies Arrangement);

  return { sizes: toSizes(arrangement), focalEnd: arrangement.largeCount - 1 };
}

function heroSizes(
  available: number,
  containerHeight: number,
  itemCount: number,
  alignment: CarouselAlignment
): { sizes: number[]; focalStart: number; focalEnd: number } {
  const centred = alignment === 'center' && itemCount >= HERO_CENTRE_MIN_ITEMS;
  const smallCount = Math.min(centred ? 2 : 1, Math.max(itemCount - 1, 0));

  // A hero's small peeks saturate their band on any realistic container, but
  // resolve them through the same large/3 target the other layouts use.
  const provisionalLarge = Math.max(
    available - smallCount * SMALL_MAX,
    SMALL_MAX
  );
  const smallSize =
    smallCount > 0 ? clamp(provisionalLarge / 3, SMALL_MIN, SMALL_MAX) : 0;

  const spaceForLarge = available - smallCount * smallSize;
  const maxLargeWidth = HERO_MAX_ASPECT * containerHeight;
  const largeCount = clamp(
    Math.ceil(spaceForLarge / Math.max(maxLargeWidth, 1)),
    1,
    Math.min(HERO_LARGE_COUNT_MAX, Math.max(itemCount - smallCount, 1))
  );
  const largeSize = spaceForLarge / largeCount;

  const large = new Array<number>(largeCount).fill(largeSize);

  if (smallCount === 2) {
    return {
      sizes: [smallSize, ...large, smallSize],
      focalStart: 1,
      focalEnd: largeCount,
    };
  }

  return {
    sizes: [...large, ...new Array<number>(smallCount).fill(smallSize)],
    focalStart: 0,
    focalEnd: largeCount - 1,
  };
}

function uncontainedSizes(
  available: number,
  preferredItemSize: number,
  itemCount: number
): { sizes: number[]; focalEnd: number } {
  const requested = Math.min(preferredItemSize, available);
  const largeCount = Math.max(
    1,
    Math.min(Math.floor(available / requested), itemCount)
  );

  let largeSize = requested;
  let mediumSize = available - largeCount * largeSize;

  if (mediumSize / largeSize > UNCONTAINED_MEDIUM_THRESHOLD) {
    // The leftover strip is close enough to a full item that it stops reading
    // as a peek. Cap it and let the large items take up the slack — this is the
    // one case where uncontained does not hand items their requested size.
    mediumSize = largeSize * UNCONTAINED_MEDIUM_THRESHOLD;
    largeSize = (available - mediumSize) / largeCount;
  }

  if (mediumSize <= 0 || itemCount <= largeCount) {
    // No cut-off item, so the large items have to fill the container on their own.
    largeSize = available / largeCount;
    return {
      sizes: new Array<number>(largeCount).fill(largeSize),
      focalEnd: largeCount - 1,
    };
  }

  return {
    sizes: [...new Array<number>(largeCount).fill(largeSize), mediumSize],
    focalEnd: largeCount - 1,
  };
}

export type StrategyOptions = {
  layout: CarouselLayout;
  alignment: CarouselAlignment;
  /** Container width available to the carousel. */
  containerSize: number;
  containerHeight: number;
  /** Item size the caller asked for. Ignored by `full-screen`. */
  preferredItemSize: number;
  itemCount: number;
  snap?: CarouselSnap;
};

const DEFAULT_SNAP: Record<CarouselLayout, CarouselSnap> = {
  // Multi-browse lets momentum decay across several items before it settles.
  'multi-browse': 'multi',
  // Hero and full-screen advance by exactly one item per fling.
  hero: 'single',
  'full-screen': 'single',
  // Uncontained does not snap at all; that is what preserves aspect ratios.
  uncontained: 'none',
};

/**
 * Resolves a layout into the keyline states the carousel scrolls through.
 *
 * Returns `null` until the container has been measured.
 */
export function createStrategy({
  layout,
  alignment,
  containerSize,
  containerHeight,
  preferredItemSize,
  itemCount,
  snap,
}: StrategyOptions): CarouselStrategy | null {
  if (containerSize <= 0 || itemCount <= 0) {
    return null;
  }

  const resolvedSnap = snap ?? DEFAULT_SNAP[layout];

  if (layout === 'full-screen') {
    return buildStates(
      [containerSize],
      0,
      0,
      containerSize,
      containerSize,
      itemCount,
      resolvedSnap
    );
  }

  if (layout === 'hero') {
    const { sizes, focalStart, focalEnd } = heroSizes(
      containerSize,
      containerHeight,
      itemCount,
      alignment
    );
    return buildStates(
      sizes,
      focalStart,
      focalEnd,
      containerSize,
      sizes[focalStart],
      itemCount,
      resolvedSnap
    );
  }

  const { sizes, focalEnd } =
    layout === 'uncontained'
      ? uncontainedSizes(containerSize, preferredItemSize, itemCount)
      : multiBrowseSizes(containerSize, preferredItemSize, itemCount);

  return buildStates(
    sizes,
    0,
    focalEnd,
    containerSize,
    sizes[0],
    itemCount,
    resolvedSnap
  );
}
