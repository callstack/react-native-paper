import type { ColorValue, Insets } from 'react-native';

import color from 'color';

import {
  connectedButtonMinInteractiveSize,
  connectedButtonSizeTokens,
  type ConnectedButtonGroupSize,
  type ConnectedButtonShapeKey,
} from './tokens';
import { tokens } from '../../theme/tokens';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { InternalTheme } from '../../types';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

const stateOpacity = tokens.md.sys.state.opacity;

/**
 * The MD3 disabled container is `onSurface` composited at 12% opacity.
 * @see https://m3.material.io/foundations/interaction/states/state-layers
 */
const DISABLED_CONTAINER_OPACITY = 0.12;

/**
 * Position of a button within the connected group. Determines which corners
 * stay pinned to the outer (fully-rounded) radius and which morph.
 */
export type ConnectedButtonPosition = 'first' | 'middle' | 'last' | 'single';

export const getConnectedButtonPosition = (
  index: number,
  count: number
): ConnectedButtonPosition => {
  if (count <= 1) {
    return 'single';
  }
  if (index === 0) {
    return 'first';
  }
  if (index === count - 1) {
    return 'last';
  }
  return 'middle';
};

export const resolveConnectedButtonCorner = (
  theme: InternalTheme,
  key: ConnectedButtonShapeKey
): number => (key === 'full' ? cornerFull : theme.shapes.corner[key]);

export const getConnectedButtonSizeStyle = ({
  size,
  theme,
}: {
  size: ConnectedButtonGroupSize;
  theme: InternalTheme;
}) => {
  const sizeTokens = connectedButtonSizeTokens[size];

  return {
    ...sizeTokens,
    outerRadius: resolveConnectedButtonCorner(theme, sizeTokens.outerShape),
    innerRadius: resolveConnectedButtonCorner(theme, sizeTokens.innerShape),
    pressedRadius: resolveConnectedButtonCorner(theme, sizeTokens.pressedShape),
  };
};

const getContainerColor = ({
  theme,
  selected,
  disabled,
}: {
  theme: InternalTheme;
  selected: boolean;
  disabled?: boolean;
}): ColorValue => {
  const { colors } = theme;

  if (disabled) {
    return colors.onSurface;
  }

  return selected ? colors.secondaryContainer : colors.surfaceContainer;
};

const getContentColor = ({
  theme,
  selected,
  disabled,
  checkedColor,
  uncheckedColor,
}: {
  theme: InternalTheme;
  selected: boolean;
  disabled?: boolean;
  checkedColor?: string;
  uncheckedColor?: string;
}): ColorValue => {
  const { colors } = theme;

  if (disabled) {
    return colors.onSurface;
  }
  if (selected) {
    return checkedColor ?? colors.onSecondaryContainer;
  }
  return uncheckedColor ?? colors.onSurfaceVariant;
};

export const getConnectedButtonColors = ({
  theme,
  selected,
  disabled,
  checkedColor,
  uncheckedColor,
}: {
  theme: InternalTheme;
  selected: boolean;
  disabled?: boolean;
  checkedColor?: string;
  uncheckedColor?: string;
}) => {
  const containerColor = getContainerColor({ theme, selected, disabled });
  const contentColor = getContentColor({
    theme,
    selected,
    disabled,
    checkedColor,
    uncheckedColor,
  });
  // Opacity is applied as a style instead of blending it into the color so
  // that PlatformColor values (Android dynamic themes) keep working.
  const containerOpacity = disabled
    ? DISABLED_CONTAINER_OPACITY
    : stateOpacity.enabled;
  const contentOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;

  return { containerColor, containerOpacity, contentColor, contentOpacity };
};

export const getConnectedButtonRippleColor = ({
  contentColor,
  customRippleColor,
}: {
  contentColor: ColorValue;
  customRippleColor?: ColorValue;
}): ColorValue | undefined => {
  if (customRippleColor) {
    return customRippleColor;
  }
  if (typeof contentColor !== 'string') {
    return undefined;
  }
  return color(contentColor).alpha(stateOpacity.pressed).rgb().string();
};

/**
 * Expands the touch target of shorter buttons to the minimum interactive size
 * (48dp) without changing their visual height.
 */
export const getConnectedButtonHitSlop = ({
  size,
  hitSlop,
}: {
  size: ConnectedButtonGroupSize;
  hitSlop?: TouchableRippleProps['hitSlop'];
}): TouchableRippleProps['hitSlop'] => {
  if (typeof hitSlop === 'number') {
    return hitSlop;
  }

  const height = connectedButtonSizeTokens[size].containerHeight;
  const verticalSlop = Math.max(
    0,
    (connectedButtonMinInteractiveSize - height) / 2
  );

  if (verticalSlop === 0) {
    return hitSlop;
  }

  const insetHitSlop = (hitSlop || {}) as Insets;

  return {
    ...insetHitSlop,
    top: insetHitSlop.top ?? verticalSlop,
    bottom: insetHitSlop.bottom ?? verticalSlop,
  };
};
