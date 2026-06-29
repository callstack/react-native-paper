import type { ColorRole } from '../../theme/types';

export type SliderSize = 'xs' | 's' | 'm' | 'l' | 'xl';

type SizeSpec = {
  trackThickness: number;
  handleHeight: number;
  handleWidth: number;
  handlePressWidth: number;
  activeLeadingRadius: number;
  inactiveTrailingRadius: number;
  iconSize: number;
  iconPadding: number;
};

export const SIZE_SPECS: Record<SliderSize, SizeSpec> = {
  xs: {
    trackThickness: 16,
    handleHeight: 44,
    handleWidth: 4,
    handlePressWidth: 2,
    activeLeadingRadius: 8,
    inactiveTrailingRadius: 8,
    iconSize: 0,
    iconPadding: 0,
  },
  s: {
    trackThickness: 24,
    handleHeight: 44,
    handleWidth: 4,
    handlePressWidth: 2,
    activeLeadingRadius: 8,
    inactiveTrailingRadius: 8,
    iconSize: 0,
    iconPadding: 0,
  },
  m: {
    trackThickness: 40,
    handleHeight: 44,
    handleWidth: 4,
    handlePressWidth: 2,
    activeLeadingRadius: 12,
    inactiveTrailingRadius: 6,
    iconSize: 24,
    iconPadding: 6,
  },
  l: {
    trackThickness: 56,
    handleHeight: 68,
    handleWidth: 4,
    handlePressWidth: 2,
    activeLeadingRadius: 16,
    inactiveTrailingRadius: 16,
    iconSize: 24,
    iconPadding: 6,
  },
  xl: {
    trackThickness: 96,
    handleHeight: 108,
    handleWidth: 4,
    handlePressWidth: 2,
    activeLeadingRadius: 28,
    inactiveTrailingRadius: 28,
    iconSize: 32,
    iconPadding: 8,
  },
} as const;

export const STOP_SIZE = 4;
export const BETWEEN_HANDLE_SPACE = 4;
export const INNER_CORNER_RADIUS = 2;
export const VALUE_INDICATOR_SIZE = 44;
export const VALUE_INDICATOR_BOTTOM_SPACE = 12;

export const DISABLED_CONTENT_OPACITY = 0.38;
export const DISABLED_INACTIVE_OPACITY = 0.12;

const colors = {
  activeTrack: 'primary',
  inactiveTrack: 'secondaryContainer',
  handle: 'primary',
  stopOnActive: 'onPrimary',
  stopOnInactive: 'onSecondaryContainer',
  valueIndicatorBg: 'inverseSurface',
  valueIndicatorText: 'inverseOnSurface',
  disabledContent: 'onSurface',
} as const satisfies Record<string, ColorRole>;

export const SliderTokens = { colors };
