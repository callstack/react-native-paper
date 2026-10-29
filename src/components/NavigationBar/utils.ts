import type { ColorValue } from 'react-native';

import { colorRoles } from './tokens';
import type { InternalTheme, StateOpacityKey } from '../../theme/types';
import { getStateLayer } from '../../theme/utils/state';

export const getActiveTintColor = ({
  activeColor,
  theme,
}: {
  activeColor: ColorValue | undefined;
  theme: InternalTheme;
}) => {
  if (activeColor != null) {
    return activeColor;
  }

  return theme.colors[colorRoles.activeIcon];
};

export const getInactiveTintColor = ({
  inactiveColor,
  theme,
}: {
  inactiveColor: ColorValue | undefined;
  theme: InternalTheme;
}) => {
  if (inactiveColor != null) {
    return inactiveColor;
  }

  return theme.colors[colorRoles.inactiveIcon];
};

export const getLabelColor = ({
  tintColor,
  hasColor,
  focused,
  theme,
}: {
  tintColor: ColorValue;
  hasColor: boolean;
  focused: boolean;
  theme: InternalTheme;
}) => {
  const { colors } = theme;
  if (hasColor) {
    return tintColor;
  }

  return colors[focused ? colorRoles.activeLabel : colorRoles.inactiveLabel];
};

/**
 * MD3 state layer for navigation bar item: 10% on press & focus, 8% on
 * hover. Active & inactive items both use on-secondary-container role
 */
export const getStateLayerColor = ({
  theme,
  pressed,
  keyboardFocused,
  hovered,
}: {
  theme: InternalTheme;
  pressed: boolean;
  keyboardFocused: boolean;
  hovered: boolean;
}) => {
  const interactionsByPriority: [StateOpacityKey, boolean][] = [
    ['pressed', pressed],
    ['focused', keyboardFocused],
    ['hovered', hovered],
  ];

  const state = interactionsByPriority.find(([, isActive]) => isActive)?.[0];

  if (!state) return null;

  const { color, opacity } = getStateLayer(theme, colorRoles.stateLayer, state);

  return { backgroundColor: color, opacity };
};
