import type { ViewStyle } from 'react-native';

import { tokens } from '../../theme/tokens';
import type {
  ColorRole,
  Elevation,
  ThemeShapeCorners,
  TypescaleKey,
} from '../../theme/types';

export type Variant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'tonalPrimary'
  | 'tonalSecondary'
  | 'tonalTertiary';

export type Size = 'default' | 'medium' | 'large';

type SizeSpec = {
  container: number;
  icon: number;
  shape: keyof ThemeShapeCorners;
  leading: number;
  trailing: number;
  iconLabelGap: number;
  labelTypescale: TypescaleKey;
};

const sizes = {
  default: {
    container: 56,
    icon: 24,
    shape: 'large',
    leading: 16,
    trailing: 16,
    iconLabelGap: 8,
    labelTypescale: 'titleMedium',
  },
  medium: {
    container: 80,
    icon: 28,
    shape: 'largeIncreased',
    leading: 26,
    trailing: 26,
    iconLabelGap: 12,
    labelTypescale: 'titleLarge',
  },
  large: {
    container: 96,
    icon: 36,
    shape: 'extraLarge',
    // (container - icon) / 2 keeps the icon centered inside the visible
    // square when the Extended FAB collapses to icon-only width.
    leading: 30,
    trailing: 30,
    iconLabelGap: 16,
    labelTypescale: 'headlineSmall',
  },
} as const satisfies Record<Size, SizeSpec>;

const stateElevation = {
  enabled: 3,
  hover: 4,
  focus: 3,
  pressed: 3,
} as const satisfies Record<string, Elevation>;

const variants = {
  primary: {
    container: 'primary',
    content: 'onPrimary',
    stateLayer: 'onPrimary',
  },
  secondary: {
    container: 'secondary',
    content: 'onSecondary',
    stateLayer: 'onSecondary',
  },
  tertiary: {
    container: 'tertiary',
    content: 'onTertiary',
    stateLayer: 'onTertiary',
  },
  tonalPrimary: {
    container: 'primaryContainer',
    content: 'onPrimaryContainer',
    stateLayer: 'onPrimaryContainer',
  },
  tonalSecondary: {
    container: 'secondaryContainer',
    content: 'onSecondaryContainer',
    stateLayer: 'onSecondaryContainer',
  },
  tonalTertiary: {
    container: 'tertiaryContainer',
    content: 'onTertiaryContainer',
    stateLayer: 'onTertiaryContainer',
  },
} as const satisfies Record<
  Variant,
  { container: ColorRole; content: ColorRole; stateLayer: ColorRole }
>;

export const Tokens = {
  sizes,
  stateElevation,
  variants,
};

const closeButton = {
  container: 56,
  iconSize: 20,
  shape: 'full',
} as const;

const listItem = {
  height: 56,
  shape: 'full',
  iconSize: 24,
  leading: 24,
  trailing: 24,
  iconLabelGap: 8,
} as const;

const spacing = {
  betweenItems: 4,
  closeToLastItem: 8,
} as const;

export const MenuTokens = {
  closeButton,
  listItem,
  spacing,
};

const focusIndicator = tokens.md.sys.state.focusIndicator;
export const FOCUS_RING_THICKNESS = focusIndicator.thickness;
export const FOCUS_RING_OUTER_OFFSET = focusIndicator.outerOffset;
export const FOCUS_RING_INSET = FOCUS_RING_OUTER_OFFSET + FOCUS_RING_THICKNESS;

export const webNoOutline = { outline: 'none' } as unknown as ViewStyle;
