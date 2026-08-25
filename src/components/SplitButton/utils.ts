import type { ColorValue, ViewStyle } from 'react-native';

import color from 'color';

import {
  splitButtonDisabledOutlineOpacity,
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
  mode: SplitButtonMode;
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
  mode: SplitButtonMode;
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
  const containerColor = getSplitButtonContainerColor({
    mode,
    theme,
    disabled,
    customButtonColor,
  });
  const contentColor = getSplitButtonContentColor({
    mode,
    theme,
    disabled,
    customTextColor,
  });
  const isOutlined = mode === 'outlined';
  const disabledBorderColor =
    typeof theme.colors.onSurface === 'string'
      ? color(theme.colors.onSurface)
          .alpha(splitButtonDisabledOutlineOpacity)
          .rgb()
          .string()
      : theme.colors.outlineVariant;

  return {
    containerColor,
    contentColor,
    borderColor: isOutlined
      ? disabled
        ? disabledBorderColor
        : theme.colors.outlineVariant
      : 'transparent',
    borderWidth: isOutlined ? 1 : 0,
    containerOpacity:
      disabled && mode !== 'outlined'
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

  return {
    ...hitSlop,
    top: hitSlop?.top ?? verticalSlop,
    bottom: hitSlop?.bottom ?? verticalSlop,
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
