import type { ViewStyle } from 'react-native';

import { tokens } from '../../theme/tokens';
import type { ColorRole } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

export type Size = 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';

export type Width = 'narrow' | 'default' | 'wide';

export type Shape = 'round' | 'square';

export type Mode = 'standard' | 'filled' | 'tonal' | 'outlined';

type WidthSpec = {
  leading: number;
  trailing: number;
};

type SizeSpec = {
  containerHeight: number;
  icon: number;
  outlineWidth: number;
  squareShape: ShapeToken;
  pressedShape: ShapeToken;
  widths: Record<Width, WidthSpec>;
};

export type ColorSet = {
  container?: ColorRole;
  icon: ColorRole;
  outline?: ColorRole;
};

/**
 * MD3 Expressive Icon Button size scale.
 * @see https://m3.material.io/components/icon-buttons/specs
 * @see androidx `{XSmall|Small|Medium|Large|XLarge}IconButtonTokens` 14_1_0
 */
const sizes = {
  extraSmall: {
    containerHeight: 32,
    icon: 20,
    outlineWidth: 1,
    squareShape: 'medium',
    pressedShape: 'small',
    widths: {
      narrow: { leading: 4, trailing: 4 },
      default: { leading: 6, trailing: 6 },
      wide: { leading: 10, trailing: 10 },
    },
  },
  small: {
    containerHeight: 40,
    icon: 24,
    outlineWidth: 1,
    squareShape: 'medium',
    pressedShape: 'small',
    widths: {
      narrow: { leading: 4, trailing: 4 },
      default: { leading: 8, trailing: 8 },
      wide: { leading: 14, trailing: 14 },
    },
  },
  medium: {
    containerHeight: 56,
    icon: 24,
    outlineWidth: 1,
    squareShape: 'large',
    pressedShape: 'medium',
    widths: {
      narrow: { leading: 12, trailing: 12 },
      default: { leading: 16, trailing: 16 },
      wide: { leading: 24, trailing: 24 },
    },
  },
  large: {
    containerHeight: 96,
    icon: 32,
    outlineWidth: 2,
    squareShape: 'extraLarge',
    pressedShape: 'large',
    widths: {
      narrow: { leading: 16, trailing: 16 },
      default: { leading: 32, trailing: 32 },
      wide: { leading: 48, trailing: 48 },
    },
  },
  extraLarge: {
    containerHeight: 136,
    icon: 40,
    outlineWidth: 3,
    squareShape: 'extraLarge',
    pressedShape: 'large',
    widths: {
      narrow: { leading: 32, trailing: 32 },
      default: { leading: 48, trailing: 48 },
      wide: { leading: 72, trailing: 72 },
    },
  },
} as const satisfies Record<Size, SizeSpec>;

/**
 * Default (non-toggle) vs toggle selected/unselected color roles.
 * Filled default uses `primary`; toggle-OFF uses `surfaceContainer`.
 * @see androidx `FilledIconButtonTokens` / `FilledTonalIconButtonTokens` /
 *   `OutlinedIconButtonTokens` / `StandardIconButtonTokens` 14_1_0
 */
const modes = {
  filled: {
    default: { container: 'primary', icon: 'onPrimary' },
    selected: { container: 'primary', icon: 'onPrimary' },
    unselected: { container: 'surfaceContainer', icon: 'onSurfaceVariant' },
  },
  tonal: {
    default: { container: 'secondaryContainer', icon: 'onSecondaryContainer' },
    selected: { container: 'secondary', icon: 'onSecondary' },
    unselected: {
      container: 'secondaryContainer',
      icon: 'onSecondaryContainer',
    },
  },
  outlined: {
    default: { icon: 'onSurfaceVariant', outline: 'outlineVariant' },
    selected: { container: 'inverseSurface', icon: 'inverseOnSurface' },
    unselected: { icon: 'onSurfaceVariant', outline: 'outlineVariant' },
  },
  standard: {
    default: { icon: 'onSurfaceVariant' },
    selected: { icon: 'primary' },
    unselected: { icon: 'onSurfaceVariant' },
  },
} satisfies Record<
  Mode,
  { default: ColorSet; selected: ColorSet; unselected: ColorSet }
>;

const disabled = {
  container: 'onSurface',
  icon: 'onSurface',
  outline: 'outlineVariant',
  /** Filled/tonal (and outlined-selected) disabled container opacity. */
  containerOpacity: 0.1,
} as const satisfies {
  container: ColorRole;
  icon: ColorRole;
  outline: ColorRole;
  containerOpacity: number;
};

/** Extra-small and small icon buttons must meet a 48dp touch target. */
const minTouchTarget = 48;

const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;
export const FOCUS_RING_THICKNESS = thickness;
export const FOCUS_RING_OUTER_OFFSET = outerOffset;
export const FOCUS_RING_INSET = outerOffset + thickness;

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

export const IconButtonTokens = {
  sizes,
  modes,
  disabled,
  minTouchTarget,
};
