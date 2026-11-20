import type { Elevation } from '../../theme/types';
import type { ColorRole } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

/**
 * `md.comp.carousel-item.*` — the carousel's entire spec surface.
 *
 * There is no `md.comp.carousel.*` group, no plural and no `.expressive.`
 * variant, so baseline and Expressive resolve to the same values. The table is
 * colour / shape / state only: it carries no geometry at all, which is why
 * every size lives in `CarouselGeometry` below and is sourced from the
 * MDC-Android and Compose implementations instead.
 */
const shape = {
  containerShape: 'extraLarge',
} as const satisfies Record<string, ShapeToken>;

/**
 * Two groups from the spec table have no consumer on this side and are
 * deliberately not mirrored here:
 *
 * - `label-text.*`. MDC draws an item's label itself; in Paper the item's
 *   content — text included — is rendered by the caller, so there is nothing
 *   for a label colour to paint. `Text` already resolves to `onSurface`, the
 *   value the token carries, and the disabled state dims the content as a
 *   whole through `disabledContainerOpacity` rather than per-run.
 * - `dragged.*`. A drag on a carousel item scrolls the strip, and React Native
 *   hands the responder to the scroll view, which ends the item's press. There
 *   is no interaction left for a dragged state to describe.
 */
const colors = {
  containerColor: 'surfaceContainerHigh',
  outlineColor: 'outlineVariant',
  focusIndicatorColor: 'secondary',
  hoverStateLayerColor: 'onSurface',
  focusStateLayerColor: 'onSurface',
  pressedStateLayerColor: 'onSurface',
} as const satisfies Record<string, ColorRole>;

/** Hover is the only state that lifts an item off the surface. */
const elevations = {
  containerElevation: 0,
  hoverContainerElevation: 1,
  focusContainerElevation: 0,
  pressedContainerElevation: 0,
} as const satisfies Record<string, Elevation>;

const dimensions = {
  outlineWidth: 1,
  disabledContainerOpacity: 0.38,
} as const;

export const CarouselTokens = {
  ...shape,
  ...colors,
  ...elevations,
  ...dimensions,
};

/**
 * Geometry the token table does not define. Values come from the MDC-Android
 * and Compose carousel implementations.
 */
export const CarouselGeometry = {
  /** Smallest an item may be laid out at while still counted as a small item. */
  smallSizeMin: 40,
  /** Largest a small item may grow to before it reads as a medium item. */
  smallSizeMax: 56,
  /** Size an item shrinks to at the container edge, just before it goes. */
  anchorSize: 10,
  /** Size of the off-screen keyline an item disappears into. */
  goneSize: 1,
  /** A hero's large item is at most this many times its own height. */
  heroLargeMaxAspectRatio: 2,
  /** Centre-aligned hero falls back to start-aligned below this many items. */
  heroCentreAlignedMinItemCount: 3,
  /** Hero shows at most this many large items, however wide the container is. */
  heroLargeCountMax: 2,
  /**
   * Above this fraction of the large size, an uncontained carousel's trailing
   * cut-off item reads as a second full item rather than a peek.
   */
  uncontainedMediumThreshold: 0.85,
} as const;
