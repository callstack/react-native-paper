import type { ColorRole } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

/**
 * MD3 Snackbar spec dimensions.
 * @see https://m3.material.io/components/snackbar/specs
 * @see https://www.figma.com/design/2Q84OViMCVDu4UBaJv38Eq/Material-3-Design-Kit--Community-?node-id=55141-14256
 */
const sizes = {
  /** Corner radius of the container: `md.sys.shape.corner.extra-small`. */
  containerShape: 'extraSmall' satisfies ShapeToken,
  /** Height of a single-line Snackbar, which is also its minimum height. */
  minHeight: 48,
  /** Gap between the container and the edges of the window. */
  screenMargin: 8,
  /** Widest the container gets, so that a message keeps a readable line length. */
  containerMaxWidth: 600,
  /** Gap between the message and the leading edge of the container. */
  messageSpacing: 16,
  /**
   * Gap between the message and the trailing edge when the Snackbar has no
   * action or close icon.
   */
  messageTrailingSpacing: 16,
  /** Top and bottom padding of the message, which yields the single-line height. */
  messageVerticalSpacing: 14,
  /** Gap between the message and the action when they share a line. */
  messageActionGap: 4,
  /**
   * Widest an action may be before a multiline message forces it onto its own
   * line. Matches Material Components Android's `design_snackbar_action_inline_max_width`.
   */
  maxInlineActionWidth: 128,
  /** Longest the supporting text may grow, matching the Figma two-line layouts. */
  messageMaxLines: 2,
  /** Gap between the action area and the trailing edge of the container. */
  actionSpacing: 8,
  /**
   * Bottom padding of a stacked action row. Keeps the text button from growing
   * the container past the Figma longer-action height.
   */
  actionBottomSpacing: 4,
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
