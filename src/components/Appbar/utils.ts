import { I18nManager } from 'react-native';
import type { ColorValue } from 'react-native';

import { white } from '../../theme/colors';
import type { InternalTheme } from '../../theme/types';
import { MIN_INTERACTIVE_SIZE } from '../../utils/getMinInteractiveSizeHitSlop';

export type AppbarModes =
  | 'small'
  | 'medium'
  | 'large'
  | 'center-aligned'
  | 'medium-flexible'
  | 'large-flexible';

export const APPBAR_HORIZONTAL_PADDING = 4;

// Width of an icon button with its margin.
export const APPBAR_ACTION_WIDTH = 52;

// Height of the row with the controls of the `medium`, `large` and flexible modes.
export const APPBAR_CONTROLS_HEIGHT = 64;

// Space above the controls of these modes, which centers them in the row,
// at the same height as in the `small` mode.
export const APPBAR_CONTROLS_OFFSET =
  (APPBAR_CONTROLS_HEIGHT - APPBAR_ACTION_WIDTH) / 2;

// Top of the title in the `medium` and `large` modes: the bottom of the touch
// targets of the actions, which are centered in the row with the controls.
// A title that reaches higher would take the presses of the actions.
export const APPBAR_TITLE_TOP =
  (APPBAR_CONTROLS_HEIGHT + MIN_INTERACTIVE_SIZE) / 2;

export const isFlexibleMode = (mode: AppbarModes) =>
  mode === 'medium-flexible' || mode === 'large-flexible';

export const getAppbarBackgroundColor = (
  theme: InternalTheme,
  elevated: boolean,
  customBackground?: ColorValue
): ColorValue => {
  const { colors } = theme;
  if (customBackground) {
    return customBackground;
  }

  if (elevated) {
    return colors.surfaceContainer;
  }

  return colors.surface;
};

export const getAppbarColor = ({
  color,
  isDark,
}: {
  color?: ColorValue;
  isDark: boolean;
}): ColorValue | undefined => {
  if (typeof color !== 'undefined') {
    return color;
  }

  if (isDark) {
    return white;
  }

  return undefined;
};

export const DEFAULT_APPBAR_HEIGHT = 56;
const MD3_DEFAULT_APPBAR_HEIGHT = 64;

/**
 * Height of the content area of the Appbar, without the safe area insets.
 * The flexible modes use it as the minimum height.
 */
export const modeAppbarHeight = {
  small: MD3_DEFAULT_APPBAR_HEIGHT,
  medium: 112,
  large: 152,
  'center-aligned': MD3_DEFAULT_APPBAR_HEIGHT,
  'medium-flexible': 112,
  'large-flexible': 120,
};

export const modeTextVariant = {
  small: 'titleLarge',
  medium: 'headlineSmall',
  large: 'headlineMedium',
  'center-aligned': 'titleLarge',
  'medium-flexible': 'headlineMedium',
  'large-flexible': 'displaySmall',
} as const;

/**
 * Margins that center the title of the `center-aligned` Appbar,
 * from the width of the actions on each side of it. Wider actions on one side
 * than room for two actions leave the title off-center, as there is not
 * enough space to center it.
 */
export const getCenteringMargins = (
  sides: { left: number; right: number } | null
) => {
  if (!sides) {
    return { left: 0, right: 0 };
  }

  const { left, right } = sides;

  if (Math.max(left, right) > 2 * APPBAR_ACTION_WIDTH) {
    return { left: 0, right: 0 };
  }

  return { left: Math.max(0, right - left), right: Math.max(0, left - right) };
};

/**
 * Whether React Native swaps the left and right of the styles, which it does in RTL,
 * so they apply to the right and the left of the screen. The layout it reports
 * is not swapped.
 */
export const isLeftRightSwapped = () => {
  const constants = I18nManager.getConstants?.();

  return !!constants?.isRTL && !!constants.doLeftAndRightSwapInRTL;
};
