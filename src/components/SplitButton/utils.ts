import type { ColorValue, Insets, ViewStyle } from 'react-native';

import color from 'color';

import {
  splitButtonMinInteractiveSize,
  splitButtonSizeTokens,
  type SplitButtonShapeKey,
  type SplitButtonSize,
} from './tokens';
import { tokens } from '../../theme/tokens';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { InternalTheme } from '../../types';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

const stateOpacity = tokens.md.sys.state.opacity;

export type SplitButtonMode = 'filled' | 'tonal' | 'elevated' | 'outlined';

export type SplitButtonNormalizedMode =
  | 'filled'
  | 'tonal'
  | 'elevated'
  | 'outlined';

export const normalizeSplitButtonMode = (
  mode: SplitButtonMode
): SplitButtonNormalizedMode => {
  return mode;
};

export const resolveSplitButtonCorner = (
  theme: InternalTheme,
  key: SplitButtonShapeKey
) => (key === 'full' ? cornerFull : theme.shapes.corner[key]);

export const getSplitButtonSizeStyle = ({
  size,
  theme,
}: {
  size: SplitButtonSize;
  theme: InternalTheme;
}) => {
  const sizeTokens = splitButtonSizeTokens[size];

  return {
    ...sizeTokens,
    containerRadius: resolveSplitButtonCorner(theme, sizeTokens.containerShape),
    innerRadius: resolveSplitButtonCorner(theme, sizeTokens.innerCornerShape),
    innerPressedRadius: resolveSplitButtonCorner(
      theme,
      sizeTokens.innerPressedCornerShape
    ),
  };
};

const getSplitButtonContainerColor = ({
  mode,
  theme,
  disabled,
  customButtonColor,
}: {
  mode: SplitButtonNormalizedMode;
  theme: InternalTheme;
  disabled?: boolean;
  customButtonColor?: ColorValue;
}) => {
  const { colors } = theme;

  if (customButtonColor && !disabled) {
    return customButtonColor;
  }

  if (disabled) {
    return mode === 'outlined' ? 'transparent' : colors.onSurface;
  }

  if (mode === 'filled') {
    return colors.primary;
  }

  if (mode === 'tonal') {
    return colors.secondaryContainer;
  }

  if (mode === 'elevated') {
    return colors.surfaceContainerLow;
  }

  return 'transparent';
};

const getSplitButtonContentColor = ({
  mode,
  theme,
  disabled,
  customTextColor,
}: {
  mode: SplitButtonNormalizedMode;
  theme: InternalTheme;
  disabled?: boolean;
  customTextColor?: ColorValue;
}) => {
  const { colors } = theme;

  if (customTextColor && !disabled) {
    return customTextColor;
  }

  if (disabled) {
    return colors.onSurface;
  }

  if (mode === 'filled') {
    return colors.onPrimary;
  }

  if (mode === 'tonal') {
    return colors.onSecondaryContainer;
  }

  if (mode === 'outlined') {
    return colors.onSurfaceVariant;
  }

  return colors.primary;
};

export const getSplitButtonColors = ({
  theme,
  mode,
  disabled,
  customButtonColor,
  customTextColor,
}: {
  theme: InternalTheme;
  mode: SplitButtonMode;
  disabled?: boolean;
  customButtonColor?: ColorValue;
  customTextColor?: ColorValue;
}) => {
  const normalizedMode = normalizeSplitButtonMode(mode);
  const containerColor = getSplitButtonContainerColor({
    mode: normalizedMode,
    theme,
    disabled,
    customButtonColor,
  });
  const contentColor = getSplitButtonContentColor({
    mode: normalizedMode,
    theme,
    disabled,
    customTextColor,
  });
  const isOutlined = normalizedMode === 'outlined';

  return {
    containerColor,
    contentColor,
    borderColor: isOutlined ? theme.colors.outlineVariant : 'transparent',
    borderWidth: isOutlined ? 1 : 0,
    containerOpacity:
      disabled && normalizedMode !== 'outlined'
        ? stateOpacity.pressed
        : stateOpacity.enabled,
    contentOpacity: disabled ? stateOpacity.disabled : stateOpacity.enabled,
  };
};

export const getSplitButtonRippleColor = ({
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

export const getSplitButtonHitSlop = ({
  size,
  hitSlop,
}: {
  size: SplitButtonSize;
  hitSlop?: TouchableRippleProps['hitSlop'];
}): TouchableRippleProps['hitSlop'] => {
  if (typeof hitSlop === 'number') {
    return hitSlop;
  }

  const height = splitButtonSizeTokens[size].containerHeight;
  const verticalSlop = Math.max(
    0,
    (splitButtonMinInteractiveSize - height) / 2
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

export const getSplitButtonLeadingShape = ({
  containerRadius,
  innerRadius,
}: {
  containerRadius: number;
  innerRadius: number;
}): ViewStyle => ({
  borderTopStartRadius: containerRadius,
  borderBottomStartRadius: containerRadius,
  borderTopEndRadius: innerRadius,
  borderBottomEndRadius: innerRadius,
});

export const getSplitButtonTrailingShape = ({
  containerRadius,
  innerRadius,
}: {
  containerRadius: number;
  innerRadius: number;
}): ViewStyle => ({
  borderTopStartRadius: innerRadius,
  borderBottomStartRadius: innerRadius,
  borderTopEndRadius: containerRadius,
  borderBottomEndRadius: containerRadius,
});
