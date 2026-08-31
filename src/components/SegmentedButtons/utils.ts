import type { ColorValue, ViewStyle } from 'react-native';

import color from 'color';

import { SegmentedButtonTokens } from './tokens';
import type { InternalTheme } from '../../types';

type SegmentedButtonColorState = {
  checked: boolean;
  disabled: boolean;
};

type SegmentedButtonColorOptions = SegmentedButtonColorState & {
  contentColor?: string;
  dividerDisabled: boolean;
};

export type SegmentedButtonPosition = 'first' | 'last' | 'middle';

export const getSegmentedButtonBorderRadius = (
  segment: SegmentedButtonPosition
): ViewStyle => {
  if (segment === 'first') {
    return {
      borderTopStartRadius: SegmentedButtonTokens.containerShape,
      borderBottomStartRadius: SegmentedButtonTokens.containerShape,
      borderTopEndRadius: 0,
      borderBottomEndRadius: 0,
    };
  }

  if (segment === 'last') {
    return {
      borderTopStartRadius: 0,
      borderBottomStartRadius: 0,
      borderTopEndRadius: SegmentedButtonTokens.containerShape,
      borderBottomEndRadius: SegmentedButtonTokens.containerShape,
    };
  }

  return {
    borderRadius: 0,
  };
};

type SegmentedButtonBorderColors = {
  outline: ColorValue;
  divider: ColorValue;
};

export const getSegmentedButtonBorderStyles = (
  segment: SegmentedButtonPosition,
  { outline, divider }: SegmentedButtonBorderColors
): ViewStyle => {
  const outlineWidth = SegmentedButtonTokens.outlineWidth;

  return {
    borderColor: outline,
    borderStartColor: segment === 'first' ? outline : divider,
    borderTopWidth: outlineWidth,
    borderBottomWidth: outlineWidth,
    borderStartWidth: outlineWidth,
    borderEndWidth: segment === 'last' ? outlineWidth : 0,
  };
};

const resolveContentColors = (
  theme: InternalTheme,
  { checked, disabled }: SegmentedButtonColorState,
  contentColor?: string
) => {
  if (disabled) {
    return {
      labelColor: theme.colors[SegmentedButtonTokens.disabledLabelTextColor],
      labelOpacity: SegmentedButtonTokens.disabledLabelTextOpacity,
      iconColor: theme.colors[SegmentedButtonTokens.disabledIconColor],
      iconOpacity: SegmentedButtonTokens.disabledIconOpacity,
    };
  }

  const labelColor = checked
    ? SegmentedButtonTokens.selectedLabelTextColor
    : SegmentedButtonTokens.unselectedLabelTextColor;
  const iconColor = checked
    ? SegmentedButtonTokens.selectedIconColor
    : SegmentedButtonTokens.unselectedIconColor;

  return {
    labelColor: contentColor ?? theme.colors[labelColor],
    labelOpacity: 1,
    iconColor: contentColor ?? theme.colors[iconColor],
    iconOpacity: 1,
  };
};

const applyOpacity = (value: ColorValue, opacity: number): ColorValue => {
  if (opacity === 1 || typeof value !== 'string') {
    return value;
  }

  return color(value)
    .fade(1 - opacity)
    .rgb()
    .string();
};

const resolveOutlineColor = (theme: InternalTheme, disabled: boolean) => {
  const colorToken = disabled
    ? SegmentedButtonTokens.disabledOutlineColor
    : SegmentedButtonTokens.outlineColor;
  const opacity = disabled ? SegmentedButtonTokens.disabledOutlineOpacity : 1;

  return applyOpacity(theme.colors[colorToken], opacity);
};

export const resolveColors = (
  theme: InternalTheme,
  options: SegmentedButtonColorOptions
) => {
  const { checked, disabled, contentColor, dividerDisabled } = options;

  return {
    wrapper: checked
      ? theme.colors[SegmentedButtonTokens.selectedContainerColor]
      : 'transparent',
    content: resolveContentColors(theme, options, contentColor),
    outline: resolveOutlineColor(theme, disabled),
    divider: resolveOutlineColor(theme, dividerDisabled),
    focusIndicator: theme.colors[SegmentedButtonTokens.focusIndicatorColor],
  };
};
