import type { ViewStyle } from 'react-native';

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

type SegmentedButtonBorderStyles = {
  outline: ViewStyle;
  divider?: ViewStyle;
};

export const getSegmentedButtonBorderStyles = (
  segment: SegmentedButtonPosition
): SegmentedButtonBorderStyles => {
  const outlineWidth = SegmentedButtonTokens.outlineWidth;
  const outline = {
    borderTopWidth: outlineWidth,
    borderBottomWidth: outlineWidth,
    borderEndWidth: segment === 'last' ? outlineWidth : 0,
  };

  if (segment === 'first') {
    return {
      outline: { ...outline, borderStartWidth: outlineWidth },
    };
  }

  return { outline, divider: { borderStartWidth: outlineWidth } };
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

const resolveOutlineColors = (theme: InternalTheme, disabled: boolean) => {
  const colorToken = disabled
    ? SegmentedButtonTokens.disabledOutlineColor
    : SegmentedButtonTokens.outlineColor;

  return {
    color: theme.colors[colorToken],
    opacity: disabled ? SegmentedButtonTokens.disabledOutlineOpacity : 1,
  };
};

export const resolveColors = (
  theme: InternalTheme,
  options: SegmentedButtonColorOptions
) => {
  const { checked, disabled, contentColor, dividerDisabled } = options;

  return {
    container: checked
      ? theme.colors[SegmentedButtonTokens.selectedContainerColor]
      : 'transparent',
    content: resolveContentColors(theme, options, contentColor),
    outline: resolveOutlineColors(theme, disabled),
    divider: resolveOutlineColors(theme, dividerDisabled),
    focusIndicator: theme.colors[SegmentedButtonTokens.focusIndicatorColor],
  };
};
