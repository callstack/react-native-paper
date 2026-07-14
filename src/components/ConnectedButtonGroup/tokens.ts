import type { ThemeShapeCorners, TypescaleKey } from '../../theme/types';

export type ConnectedButtonGroupSize =
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large';

export type ConnectedButtonShapeKey = keyof ThemeShapeCorners | 'full';

export type ConnectedButtonSizeTokens = {
  /**
   * Height of every button in the group.
   */
  containerHeight: number;
  /**
   * Gap rendered between adjacent buttons.
   */
  betweenSpace: number;
  /**
   * Corner shape applied to the outer edges of the group (leading corners of
   * the first button, trailing corners of the last button) and to any
   * selected button.
   */
  outerShape: ConnectedButtonShapeKey;
  /**
   * Corner shape applied to the connected (inner) edges of unselected buttons.
   */
  innerShape: ConnectedButtonShapeKey;
  /**
   * Corner shape the connected edges morph to while a button is pressed.
   */
  pressedShape: ConnectedButtonShapeKey;
  /**
   * Icon size for both the leading icon and the selected-state check icon.
   */
  iconSize: number;
  /**
   * Leading (start) horizontal padding of a button's content.
   */
  leadingSpace: number;
  /**
   * Trailing (end) horizontal padding of a button's content.
   */
  trailingSpace: number;
  /**
   * Gap between the icon and the label.
   */
  iconLabelGap: number;
  /**
   * Minimum width of a single button.
   */
  minWidth: number;
  /**
   * Typescale variant used for the label.
   */
  labelVariant: TypescaleKey;
};

/**
 * Per-size specs for the connected button group, following the Material Design 3
 * button-group sizing scale (extra-small → extra-large).
 * @see https://m3.material.io/components/button-groups/specs
 */
export const connectedButtonSizeTokens: Record<
  ConnectedButtonGroupSize,
  ConnectedButtonSizeTokens
> = {
  'extra-small': {
    containerHeight: 32,
    betweenSpace: 2,
    outerShape: 'full',
    innerShape: 'extraSmall',
    pressedShape: 'extraSmall',
    iconSize: 20,
    leadingSpace: 12,
    trailingSpace: 12,
    iconLabelGap: 8,
    minWidth: 48,
    labelVariant: 'labelLarge',
  },
  small: {
    containerHeight: 40,
    betweenSpace: 2,
    outerShape: 'full',
    innerShape: 'small',
    pressedShape: 'extraSmall',
    iconSize: 20,
    leadingSpace: 16,
    trailingSpace: 16,
    iconLabelGap: 8,
    minWidth: 48,
    labelVariant: 'labelLarge',
  },
  medium: {
    containerHeight: 56,
    betweenSpace: 2,
    outerShape: 'full',
    innerShape: 'small',
    pressedShape: 'extraSmall',
    iconSize: 24,
    leadingSpace: 24,
    trailingSpace: 24,
    iconLabelGap: 8,
    minWidth: 56,
    labelVariant: 'titleMedium',
  },
  large: {
    containerHeight: 96,
    betweenSpace: 2,
    outerShape: 'full',
    innerShape: 'large',
    pressedShape: 'medium',
    iconSize: 32,
    leadingSpace: 48,
    trailingSpace: 48,
    iconLabelGap: 12,
    minWidth: 96,
    labelVariant: 'headlineSmall',
  },
  'extra-large': {
    containerHeight: 136,
    betweenSpace: 2,
    outerShape: 'full',
    innerShape: 'largeIncreased',
    pressedShape: 'large',
    iconSize: 40,
    leadingSpace: 64,
    trailingSpace: 64,
    iconLabelGap: 16,
    minWidth: 136,
    labelVariant: 'headlineLarge',
  },
};

/**
 * Minimum interactive size guaranteed via `hitSlop` for the smaller button
 * sizes, per WCAG / MD3 touch-target guidance.
 */
export const connectedButtonMinInteractiveSize = 48;
