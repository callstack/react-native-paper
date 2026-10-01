import type { ColorRole } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

/**
 * MD3 Snackbar spec dimensions.
 * @see https://m3.material.io/components/snackbar/specs
 */
const sizes = {
  /** Corner radius of the container: `md.sys.shape.corner.extra-small`. */
  containerShape: 'extraSmall' as ShapeToken,
  /** Height of a single-line Snackbar, which is also its minimum height. */
  minHeight: 48,
  /** Gap between the container and the edges of the window. */
  screenMargin: 8,
  /** Widest the container gets, so that a message keeps a readable line length. */
  containerMaxWidth: 600,
  /** Gap between the message and the leading edge of the container. */
  messageSpacing: 16,
  /**
   * Gap between the message and the trailing edge of the container, which also
   * separates it from an action on the same line.
   */
  messageTrailingSpacing: 8,
  /** Top and bottom padding of the message, which yields the single-line height. */
  messageVerticalSpacing: 14,
  /**
   * Share of the container the message starts with. An action which doesn't fit
   * in what's left — a long action label on a narrow screen — moves onto its own
   * line below the message, as the "two lines with longer action" configuration
   * of the spec asks for.
   */
  messageInlineBasis: '60%' as const,
  /** Gap between the action area and the trailing edge of the container. */
  actionSpacing: 8,
  /** Size of the icon inside the trailing icon button. */
  iconSize: 24,
} as const;

/**
 * MD3 Snackbar color roles.
 * @see https://m3.material.io/components/snackbar/specs
 */
const colors = {
  containerColor: 'inverseSurface',
  messageColor: 'inverseOnSurface',
  actionColor: 'inversePrimary',
  iconColor: 'inverseOnSurface',
} as const satisfies Record<string, ColorRole>;

export const SnackbarTokens = { ...sizes, ...colors };
