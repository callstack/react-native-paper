import type { ColorValue } from 'react-native';

import {
  connectedButtonSizeTokens,
  type ConnectedButtonGroupSize,
} from './tokens';
import { tokens } from '../../theme/tokens';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { InternalTheme } from '../../types';

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
    outerRadius: resolveCornerRadius(theme, sizeTokens.outerShape),
    innerRadius: resolveCornerRadius(theme, sizeTokens.innerShape),
    pressedRadius: resolveCornerRadius(theme, sizeTokens.pressedShape),
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
