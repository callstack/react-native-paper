import type { ColorRole } from '../../theme/types';

/**
 * Material Design 3 Slider tokens.
 * @see https://m3.material.io/components/sliders/specs
 */
const sizes = {
  /** Height of the track in resting state */
  trackHeight: 16,
  /** Corner radius for outer track ends */
  trackCornerRadius: 8,
  /** Corner radius for inside track ends near the thumb-track gap */
  trackInsideCornerRadius: 2,
  /** Width of the resting thumb bar */
  thumbWidth: 4,
  /** Height of the resting thumb bar */
  thumbHeight: 44,
  /** Corner radius of the thumb */
  thumbCornerRadius: 2,
  /** Width of the thumb when pressed/interacted */
  pressedThumbWidth: 6,
  /** Size of the gap between the thumb and the track */
  thumbTrackGapSize: 6,
  /** Diameter of stop indicators / tick marks */
  stopIndicatorSize: 4,
  /** Minimum touch target size for accessibility */
  minTouchTargetSize: 48,
  /** Size of the interaction state layer circle */
  stateLayerSize: 40,
  /** Height of the floating value indicator bubble */
  valueIndicatorHeight: 44,
  /** Minimum width of the floating value indicator bubble */
  valueIndicatorMinWidth: 48,
  /** Horizontal padding for the value indicator */
  valueIndicatorPaddingHorizontal: 12,
  /** Corner radius of the value indicator (fully rounded pill / stadium shape) */
  valueIndicatorCornerRadius: 22,
  /** Gap between handle and value indicator */
  valueIndicatorGap: 12,
  /** Default size for leading/trailing inset icons */
  iconSize: 24,
  /** Gap between leading/trailing icon and track */
  iconGap: 12,

  // Opacities for disabled state
  disabledActiveTrackOpacity: 0.38,
  disabledInactiveTrackOpacity: 0.12,
  disabledHandleOpacity: 0.38,
  disabledStopIndicatorOpacity: 0.38,
  disabledIconOpacity: 0.38,
} as const;

const colors = {
  activeTrackColor: 'primary',
  inactiveTrackColor: 'surfaceContainerHighest',
  handleColor: 'primary',
  stopIndicatorActiveColor: 'onPrimary',
  stopIndicatorInactiveColor: 'onSurfaceVariant',
  valueIndicatorContainerColor: 'inverseSurface',
  valueIndicatorTextColor: 'inverseOnSurface',
  stateLayerColor: 'primary',
  iconColor: 'onSurfaceVariant',

  // Disabled colors
  disabledActiveTrackColor: 'onSurface',
  disabledInactiveTrackColor: 'onSurface',
  disabledHandleColor: 'onSurface',
  disabledStopIndicatorColor: 'onSurface',
  disabledIconColor: 'onSurface',
} as const satisfies Record<string, ColorRole>;

export const SliderTokens = { ...sizes, ...colors };
