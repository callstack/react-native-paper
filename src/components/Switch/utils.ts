import type { ColorValue } from 'react-native';

import { SwitchTokens } from './tokens';
import type { InternalTheme } from '../../types';

export type SwitchColors = {
  // Enabled, base
  checkedHandleColor: ColorValue;
  checkedTrackColor: ColorValue;
  checkedBorderColor: ColorValue;
  checkedIconColor: ColorValue;
  uncheckedHandleColor: ColorValue;
  uncheckedTrackColor: ColorValue;
  uncheckedBorderColor: ColorValue;
  uncheckedIconColor: ColorValue;

  // Enabled, interacted handle (track stays constant per spec)
  checkedHoverHandleColor: ColorValue;
  checkedPressedHandleColor: ColorValue;
  uncheckedHoverHandleColor: ColorValue;
  uncheckedPressedHandleColor: ColorValue;

  // State layer tints
  checkedStateLayerColor: ColorValue;
  uncheckedStateLayerColor: ColorValue;

  // Focus indicator ring
  focusIndicatorColor: ColorValue;

  // Disabled
  disabledCheckedHandleColor: ColorValue;
  disabledCheckedTrackColor: ColorValue;
  disabledCheckedBorderColor: ColorValue;
  disabledCheckedIconColor: ColorValue;
  disabledUncheckedHandleColor: ColorValue;
  disabledUncheckedTrackColor: ColorValue;
  disabledUncheckedBorderColor: ColorValue;
  disabledUncheckedIconColor: ColorValue;
};

export function getDefaultSwitchColors(theme: InternalTheme): SwitchColors {
  const t = SwitchTokens;
  const c = theme.colors;
  return {
    checkedHandleColor: c[t.selectedHandleColor],
    checkedTrackColor: c[t.selectedTrackColor],
    checkedBorderColor: 'transparent',
    checkedIconColor: c[t.selectedIconColor],

    uncheckedHandleColor: c[t.unselectedHandleColor],
    uncheckedTrackColor: c[t.unselectedTrackColor],
    uncheckedBorderColor: c[t.unselectedTrackOutlineColor],
    uncheckedIconColor: c[t.unselectedIconColor],

    checkedHoverHandleColor: c[t.selectedHoverHandleColor],
    checkedPressedHandleColor: c[t.selectedPressedHandleColor],
    uncheckedHoverHandleColor: c[t.unselectedHoverHandleColor],
    uncheckedPressedHandleColor: c[t.unselectedPressedHandleColor],

    checkedStateLayerColor: c[t.selectedStateLayerColor],
    uncheckedStateLayerColor: c[t.unselectedStateLayerColor],

    focusIndicatorColor: c[t.focusIndicatorColor],

    disabledCheckedHandleColor: c[t.disabledSelectedHandleColor],
    disabledCheckedTrackColor: c[t.disabledSelectedTrackColor],
    disabledCheckedBorderColor: 'transparent',
    disabledCheckedIconColor: c[t.disabledSelectedIconColor],
    disabledUncheckedHandleColor: c[t.disabledUnselectedHandleColor],
    disabledUncheckedTrackColor: c[t.disabledUnselectedTrackColor],
    disabledUncheckedBorderColor: c[t.disabledUnselectedTrackOutlineColor],
    disabledUncheckedIconColor: c[t.disabledUnselectedIconColor],
  };
}

export type SwitchPaint = {
  track: ColorValue;
  border: ColorValue;
  icon: ColorValue;
};

/**
 * Resolve track / border / icon paint for the current state. Handle color is
 * interaction-dependent and animated on the UI thread; resolve it separately.
 */
export function resolveSwitchPaint(
  c: SwitchColors,
  isEnabled: boolean,
  checked: boolean
): SwitchPaint {
  if (!isEnabled) {
    return checked
      ? {
          track: c.disabledCheckedTrackColor,
          border: c.disabledCheckedBorderColor,
          icon: c.disabledCheckedIconColor,
        }
      : {
          track: c.disabledUncheckedTrackColor,
          border: c.disabledUncheckedBorderColor,
          icon: c.disabledUncheckedIconColor,
        };
  }
  return checked
    ? {
        track: c.checkedTrackColor,
        border: c.checkedBorderColor,
        icon: c.checkedIconColor,
      }
    : {
        track: c.uncheckedTrackColor,
        border: c.uncheckedBorderColor,
        icon: c.uncheckedIconColor,
      };
}
