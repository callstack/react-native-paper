import type { ButtonLabelVariant, ButtonMode, ButtonSize } from './utils';
import type { ColorRole } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

/**
 * Per-size component tokens for the Material Design 3 (expressive) button
 * sizes, modelled on Jetpack Compose's `Button{Size}Tokens`. Centralising
 * these here keeps every size-specific metric in one place and references the
 * theme shape tokens instead of magic numbers for the corner radii.
 */
type ButtonSizeTokens = {
  containerHeight: number;
  iconSize: number;
  iconLabelSpace: number;
  leadingSpace: number;
  trailingSpace: number;
  outlinedOutlineWidth: number;
  labelVariant: ButtonLabelVariant;
  containerShapeRound: ShapeToken;
  containerShapeSquare: ShapeToken;
  /**
   * Corner the container morphs to while pressed. Tightens with the size:
   * 8dp for XS/S, 12dp for M, 16dp for L/XL.
   */
  pressedContainerShape: ShapeToken;
  selectedContainerShapeRound: ShapeToken;
  selectedContainerShapeSquare: ShapeToken;
};

const sizes = {
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
    pressedContainerShape: 'medium',
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
    pressedContainerShape: 'large',
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
    pressedContainerShape: 'large',
    selectedContainerShapeRound: 'full',
    selectedContainerShapeSquare: 'extraLarge',
  },
} as const satisfies Record<ButtonSize, ButtonSizeTokens>;

/**
 * Modes that have a toggle variant. MD3 defines `ToggleButton`,
 * `ElevatedToggleButton`, `TonalToggleButton` and `OutlinedToggleButton` — there
 * is no text/plain toggle, so `text` keeps its plain colours when used as one.
 */
export type ButtonToggleMode = Exclude<ButtonMode, 'text'>;

type ToggleColorSpec = {
  /** `'transparent'` where the spec leaves the container unfilled. */
  container: ColorRole | 'transparent';
  label: ColorRole;
};

/**
 * Selected/unselected colour roles for the toggle variant, taken from the MD3
 * `{Filled,Elevated,Tonal,Outlined}ButtonTokens` `Unselected*` / `Selected*`
 * sets. A toggle's unselected colours differ from the same mode's plain
 * colours, which is why this table is separate from `getButtonColors`' defaults.
 */
const toggle = {
  filled: {
    unselected: { container: 'surfaceContainer', label: 'onSurfaceVariant' },
    selected: { container: 'primary', label: 'onPrimary' },
  },
  tonal: {
    unselected: {
      container: 'secondaryContainer',
      label: 'onSecondaryContainer',
    },
    selected: { container: 'secondary', label: 'onSecondary' },
  },
  elevated: {
    unselected: { container: 'surfaceContainerLow', label: 'primary' },
    selected: { container: 'primary', label: 'onPrimary' },
  },
  outlined: {
    unselected: { container: 'transparent', label: 'onSurfaceVariant' },
    selected: { container: 'inverseSurface', label: 'inverseOnSurface' },
  },
} as const satisfies Record<
  ButtonToggleMode,
  { unselected: ToggleColorSpec; selected: ToggleColorSpec }
>;

export const Tokens = { sizes, toggle };
