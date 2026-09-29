import type { ColorValue } from 'react-native';

import { cubicBezier } from 'react-native-reanimated';
import type { CSSTransitionProperties } from 'react-native-reanimated';

import { NavigationRailTokens } from './tokens';
import type { EasingConfig, InternalTheme } from '../../theme/types';

const { rail, colors } = NavigationRailTokens;

export type ItemColors = {
  icon: ColorValue;
  label: ColorValue;
  expandedLabel: ColorValue;
  indicator: ColorValue;
  stateLayer: ColorValue;
  focusIndicator: ColorValue;
};

/**
 * Resolve item colors for the current selection state. The active label uses
 * `secondary` in the collapsed rail and matches the icon in the expanded rail.
 */
export const resolveItemColors = ({
  theme,
  active = false,
}: {
  theme: InternalTheme;
  active?: boolean;
}): ItemColors => {
  const c = theme.colors;
  return {
    icon: c[active ? colors.activeIcon : colors.inactiveIcon],
    label: c[active ? colors.activeLabel : colors.inactiveLabel],
    expandedLabel:
      c[active ? colors.activeExpandedLabel : colors.inactiveLabel],
    indicator: c[colors.activeIndicator],
    stateLayer: c[colors.stateLayer],
    focusIndicator: c[colors.focusIndicator],
  };
};

/**
 * Clamp a requested expanded width to the spec range (220–360dp).
 */
export const clampExpandedWidth = (width: number): number =>
  Math.min(Math.max(width, rail.expandedMinWidth), rail.expandedMaxWidth);

/**
 * Rail motion as a CSS transition. Defaults to the 300ms emphasized curve used
 * for expanding; the modal rail passes MD3 enter/exit durations and easings.
 */
export const getTransition = (
  theme: InternalTheme,
  properties: CSSTransitionProperties['transitionProperty'],
  {
    duration = theme.motion.duration.medium2,
    easing = theme.motion.easing.emphasized,
    instant = false,
  }: { duration?: number; easing?: EasingConfig; instant?: boolean } = {}
): CSSTransitionProperties => ({
  transitionProperty: properties,
  transitionDuration: instant ? 0 : duration,
  transitionTimingFunction: cubicBezier(...easing),
});
