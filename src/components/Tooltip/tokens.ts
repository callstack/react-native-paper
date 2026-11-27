/**
 * Plain tooltip - short text on an inverse-surface container, wrapping onto
 * more lines past the max width.
 * https://m3.material.io/components/tooltips/specs#1e6d4d8a
 */
const plain = {
  container: 'inverseSurface',
  content: 'inverseOnSurface',
  shape: 'extraSmall',
  minHeight: 24,
  minWidth: 40,
  maxWidth: 320,
  // the 56dp max height at the default font size
  maxLines: 3,
  paddingHorizontal: 8,
  paddingVertical: 4,
  typescale: 'bodySmall',
} as const;

/**
 * Rich tooltip — an optional subhead, supporting text and action buttons on a
 * surface-container container at elevation level 2.
 * https://m3.material.io/components/tooltips/specs#8e6cf915
 */
const rich = {
  container: 'surfaceContainer',
  title: 'onSurfaceVariant',
  content: 'onSurfaceVariant',
  shape: 'medium',
  elevation: 2,
  maxWidth: 320,
  paddingHorizontal: 16,
  paddingTop: 12,
  paddingBottom: 8,
  titleTypescale: 'titleSmall',
  contentTypescale: 'bodyMedium',
  gap: 4,
  actionsTopSpace: 12,
} as const;

/**
 * Fade transition on show/hide. Keys are resolved against `theme.motion` at
 * runtime: enter decelerates in, exit accelerates out, per the M3 motion spec.
 */
const motion = {
  enter: { duration: 'short3', easing: 'standardDecelerate' },
  exit: { duration: 'short2', easing: 'standardAccelerate' },
} as const;

export const Tokens = { plain, rich, motion };
