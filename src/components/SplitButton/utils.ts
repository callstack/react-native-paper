import type { ColorValue, ViewStyle } from 'react-native';

import color from 'color';

import {
  splitButtonColorTokens,
  splitButtonMinInteractiveSize,
  splitButtonSizeTokens,
  type SplitButtonMode,
  type SplitButtonSize,
} from './tokens';
import { tokens } from '../../theme/tokens';
import { resolveCornerRadius, type ShapeToken } from '../../theme/utils/shape';
import type { InternalTheme } from '../../types';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

const stateOpacity = tokens.md.sys.state.opacity;

export type { SplitButtonMode } from './tokens';

// `resolveCornerRadius`'s 'full' case returns a large sentinel radius
// (`cornerFull`) meant for shapes whose corners are all resolved the same
// way. Paired on the same edge with the smaller `innerRadius`, that
// sentinel triggers RN's corner-overlap correction and collapses the inner
// radius too — so the container shape is resolved on its own, relative to
// its own height, instead: 'full' means "fully rounded", i.e. a stadium
// whose radius is exactly half its height.
export const resolveSplitButtonContainerRadius = (
  theme: InternalTheme,
  shape: ShapeToken,
  containerHeight: number
) =>
  shape === 'full' ? containerHeight / 2 : resolveCornerRadius(theme, shape);

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
    containerRadius: resolveSplitButtonContainerRadius(
      theme,
      sizeTokens.containerShape,
      sizeTokens.containerHeight
    ),
    innerRadius: resolveCornerRadius(theme, sizeTokens.innerCornerShape),
  };
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
  const { colors } = theme;
  const colorTokens =
    splitButtonColorTokens[mode][disabled ? 'disabled' : 'enabled'];

  const containerColor =
    customButtonColor && !disabled
      ? customButtonColor
      : colorTokens.containerColor
        ? colors[colorTokens.containerColor]
        : 'transparent';
  const contentColor =
    customTextColor && !disabled
      ? customTextColor
      : colors[colorTokens.contentColor];

  return {
    containerColor,
    contentColor,
    borderColor: colorTokens.borderColor
      ? colors[colorTokens.borderColor]
      : 'transparent',
    borderWidth: colorTokens.borderColor ? 1 : 0,
    containerOpacity: colorTokens.containerOpacity,
    contentOpacity: colorTokens.contentOpacity,
    elevation: colorTokens.elevation,
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
