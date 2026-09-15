import type { ColorValue } from 'react-native';

import color from 'color';

import { NavigationBarTokens } from './tokens';
import { tokens } from '../../theme/tokens';
import type { InternalTheme } from '../../theme/types';

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

  return theme.colors[NavigationBarTokens.colors.activeIcon];
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

  return theme.colors[NavigationBarTokens.colors.inactiveIcon];
};

export const getLabelColor = ({
  tintColor,
  hasColor,
  focused,
  onIndicator,
  theme,
}: {
  tintColor: ColorValue;
  hasColor: boolean;
  focused: boolean;
  onIndicator?: boolean;
  theme: InternalTheme;
}) => {
  const { colors } = theme;
  if (hasColor) {
    return tintColor;
  }

  if (focused) {
    return onIndicator
      ? colors[NavigationBarTokens.colors.activeLabelOnIndicator]
      : colors[NavigationBarTokens.colors.activeLabel];
  }
  return colors[NavigationBarTokens.colors.inactiveLabel];
};

export const getItemRippleColor = ({
  focused,
  theme,
}: {
  focused: boolean;
  theme: InternalTheme;
}) => {
  const role = focused
    ? theme.colors[NavigationBarTokens.colors.activeStateLayer]
    : theme.colors[NavigationBarTokens.colors.inactiveStateLayer];

  return color(role).alpha(tokens.md.sys.state.opacity.pressed).rgb().string();
};

export const resolveItemLayout = ({
  itemLayout,
  width,
}: {
  itemLayout: 'vertical' | 'horizontal' | 'auto';
  width: number;
}): 'vertical' | 'horizontal' => {
  if (itemLayout !== 'auto') {
    return itemLayout;
  }

  return width >= NavigationBarTokens.mediumWindowMinWidth
    ? 'horizontal'
    : 'vertical';
};
