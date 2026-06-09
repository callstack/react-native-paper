import type { ButtonLabelVariant, ButtonSize } from './utils';

/**
 * Shape keys for the button container corners. `'full'` resolves to the
 * full-pill radius (`cornerFull`); every other key resolves against
 * `theme.shapes.corner[key]`. Mirrors MD3 `ShapeKeyTokens`.
 */
export type ButtonCornerKey =
  | 'full'
  | 'small'
  | 'medium'
  | 'large'
  | 'extraLarge';

/**
 * Per-size component tokens for the Material Design 3 (expressive) button
 * sizes, modelled on Jetpack Compose's `Button{Size}Tokens`. Centralising
 * these here keeps every size-specific metric in one place and references the
 * theme shape tokens instead of magic numbers for the corner radii.
 */
export type ButtonSizeTokens = {
  containerHeight: number;
  iconSize: number;
  iconLabelSpace: number;
  leadingSpace: number;
  trailingSpace: number;
  outlinedOutlineWidth: number;
  labelVariant: ButtonLabelVariant;
  containerShapeRound: ButtonCornerKey;
  containerShapeSquare: ButtonCornerKey;
  /** Corner the container morphs to while pressed (MD3: always `small`). */
  pressedContainerShape: ButtonCornerKey;
  selectedContainerShapeRound: ButtonCornerKey;
  selectedContainerShapeSquare: ButtonCornerKey;
};

export const buttonSizeTokens: Record<ButtonSize, ButtonSizeTokens> = {
  'extra-small': {
    containerHeight: 32,
    iconSize: 20,
    iconLabelSpace: 4,
    leadingSpace: 12,
    trailingSpace: 12,
    outlinedOutlineWidth: 1,
    labelVariant: 'labelLarge',
    containerShapeRound: 'full',
    containerShapeSquare: 'medium',
    pressedContainerShape: 'small',
    selectedContainerShapeRound: 'full',
    selectedContainerShapeSquare: 'medium',
  },
  small: {
    containerHeight: 40,
    iconSize: 20,
    iconLabelSpace: 8,
    leadingSpace: 16,
    trailingSpace: 16,
    outlinedOutlineWidth: 1,
    labelVariant: 'labelLarge',
    containerShapeRound: 'full',
    containerShapeSquare: 'medium',
    pressedContainerShape: 'small',
    selectedContainerShapeRound: 'full',
    selectedContainerShapeSquare: 'medium',
  },
  medium: {
    containerHeight: 56,
    iconSize: 24,
    iconLabelSpace: 8,
    leadingSpace: 24,
    trailingSpace: 24,
    outlinedOutlineWidth: 1,
    labelVariant: 'titleMedium',
    containerShapeRound: 'full',
    containerShapeSquare: 'large',
    pressedContainerShape: 'small',
    selectedContainerShapeRound: 'full',
    selectedContainerShapeSquare: 'large',
  },
  large: {
    containerHeight: 96,
    iconSize: 32,
    iconLabelSpace: 12,
    leadingSpace: 48,
    trailingSpace: 48,
    outlinedOutlineWidth: 1,
    labelVariant: 'headlineSmall',
    containerShapeRound: 'full',
    containerShapeSquare: 'extraLarge',
    pressedContainerShape: 'small',
    selectedContainerShapeRound: 'full',
    selectedContainerShapeSquare: 'extraLarge',
  },
  'extra-large': {
    containerHeight: 136,
    iconSize: 40,
    iconLabelSpace: 16,
    leadingSpace: 64,
    trailingSpace: 64,
    outlinedOutlineWidth: 1,
    labelVariant: 'headlineLarge',
    containerShapeRound: 'full',
    containerShapeSquare: 'extraLarge',
    pressedContainerShape: 'small',
    selectedContainerShapeRound: 'full',
    selectedContainerShapeSquare: 'extraLarge',
  },
};

/** Corner used by the legacy (no-`size`) button for each shape variant. */
export const legacyContainerShape: Record<'round' | 'square', ButtonCornerKey> =
  {
    round: 'full',
    square: 'medium',
  };
