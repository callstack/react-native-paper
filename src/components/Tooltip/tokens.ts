import type {
  ColorRole,
  Elevation,
  ThemeShapeCorners,
  TypescaleKey,
} from '../../theme/types';

type ShapeKey = keyof ThemeShapeCorners;

/**
 * Plain tooltip — a single line of text on an inverse-surface container.
 * https://m3.material.io/components/tooltips/specs#1e6d4d8a
 */
const plain = {
  container: 'inverseSurface',
  content: 'inverseOnSurface',
  shape: 'extraSmall',
  height: 32,
  paddingHorizontal: 16,
  typescale: 'bodySmall',
} as const satisfies {
  container: ColorRole;
  content: ColorRole;
  shape: ShapeKey;
  height: number;
  paddingHorizontal: number;
  typescale: TypescaleKey;
};

/**
 * Rich tooltip — an optional subhead, supporting text and action buttons on a
 * surface-container container at elevation level 2.
 * https://m3.material.io/components/tooltips/specs#8e6cf915
 */
const rich = {
  container: 'surfaceContainer',
  title: 'onSurface',
  content: 'onSurfaceVariant',
  action: 'primary',
  shape: 'medium',
  elevation: 2,
  maxWidth: 312,
  paddingHorizontal: 16,
  paddingVertical: 12,
  titleTypescale: 'titleSmall',
  contentTypescale: 'bodyMedium',
  gap: 4,
} as const satisfies {
  container: ColorRole;
  title: ColorRole;
  content: ColorRole;
  action: ColorRole;
  shape: ShapeKey;
  elevation: Elevation;
  maxWidth: number;
  paddingHorizontal: number;
  paddingVertical: number;
  titleTypescale: TypescaleKey;
  contentTypescale: TypescaleKey;
  gap: number;
};

/**
 * Fade transition on show/hide. Keys are resolved against `theme.motion` at
 * runtime: enter decelerates in, exit accelerates out, per the M3 motion spec.
 */
const motion = {
  enter: { duration: 'short3', easing: 'standardDecelerate' },
  exit: { duration: 'short2', easing: 'standardAccelerate' },
} as const;

export const Tokens = { plain, rich, motion };
