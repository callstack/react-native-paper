import type { ColorRole } from '../../theme/types';

const sizes = {
  trackWidth: 52,
  trackHeight: 32,
  trackOutlineWidth: 2,
  stateLayerSize: 40,

  selectedHandleSize: 24,
  unselectedHandleSize: 16,
  iconHandleSize: 24,
  pressedHandleSize: 28,
  selectedIconSize: 16,
  unselectedIconSize: 16,

  disabledSelectedHandleOpacity: 1.0,
  disabledUnselectedHandleOpacity: 0.38,
  disabledSelectedIconOpacity: 0.38,
  disabledUnselectedIconOpacity: 0.38,
  disabledTrackOpacity: 0.12,
} as const;

const colors = {
  selectedHandleColor: 'onPrimary',
  selectedHoverHandleColor: 'primaryContainer',
  selectedPressedHandleColor: 'primaryContainer',

  unselectedHandleColor: 'outline',
  unselectedHoverHandleColor: 'onSurfaceVariant',
  unselectedPressedHandleColor: 'onSurfaceVariant',

  selectedIconColor: 'primary',
  unselectedIconColor: 'surfaceContainerHighest',

  selectedTrackColor: 'primary',
  unselectedTrackColor: 'surfaceContainerHighest',
  unselectedTrackOutlineColor: 'outline',

  disabledSelectedHandleColor: 'surface',
  disabledSelectedIconColor: 'onSurface',
  disabledSelectedTrackColor: 'onSurface',
  disabledUnselectedHandleColor: 'onSurface',
  disabledUnselectedIconColor: 'surfaceContainerHighest',
  disabledUnselectedTrackColor: 'surfaceContainerHighest',
  disabledUnselectedTrackOutlineColor: 'onSurface',

  selectedStateLayerColor: 'primary',
  unselectedStateLayerColor: 'onSurface',

  focusIndicatorColor: 'secondary',
} as const satisfies Record<string, ColorRole>;

export const SwitchTokens = { ...sizes, ...colors };
