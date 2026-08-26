import type { ViewStyle } from 'react-native';

import { SegmentedButtonTokens } from './tokens';
import { tokens } from '../../theme/tokens';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { InternalTheme } from '../../types';

const stateOpacity = tokens.md.sys.state.opacity;

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
  checked: boolean;
};

type SegmentedButtonProps = {
  checkedColor?: string;
  uncheckedColor?: string;
} & BaseProps;

export const getSegmentedButtonHeight = (
  density: 'regular' | 'small' | 'medium' | 'high' = 'regular'
) => SegmentedButtonTokens.containerHeight[density];

export const getSegmentedButtonBorderRadius = ({
  segment,
}: {
  segment?: 'first' | 'last';
}): ViewStyle => {
  if (segment === 'first') {
    return {
      borderTopStartRadius: cornerFull,
      borderBottomStartRadius: cornerFull,
      borderTopEndRadius: 0,
      borderBottomEndRadius: 0,
    };
  }

  if (segment === 'last') {
    return {
      borderTopStartRadius: 0,
      borderBottomStartRadius: 0,
      borderTopEndRadius: cornerFull,
      borderBottomEndRadius: cornerFull,
    };
  }

  return {
    borderRadius: 0,
  };
};

export const getSegmentedButtonOutlineStyle = (
  segment?: 'first' | 'last'
): ViewStyle => ({
  borderTopWidth: SegmentedButtonTokens.outlineWidth,
  borderBottomWidth: SegmentedButtonTokens.outlineWidth,
  borderStartWidth: SegmentedButtonTokens.outlineWidth,
  borderEndWidth: segment === 'last' ? SegmentedButtonTokens.outlineWidth : 0,
});

export const getSegmentedButtonStateLayerOpacity = ({
  disabled,
  pressed,
  focused,
  hovered,
}: {
  disabled?: boolean;
  pressed: boolean;
  focused: boolean;
  hovered: boolean;
}) => {
  if (disabled) {
    return 0;
  }

  if (pressed) {
    return stateOpacity.pressed;
  }

  if (focused) {
    return stateOpacity.focused;
  }

  if (hovered) {
    return stateOpacity.hovered;
  }

  return 0;
};

export const getSegmentedButtonColors = ({
  theme,
  disabled,
  checked,
  checkedColor,
  uncheckedColor,
}: SegmentedButtonProps) => {
  const backgroundColor = checked
    ? theme.colors[SegmentedButtonTokens.selectedContainerColor]
    : 'transparent';
  const borderColor = disabled
    ? theme.colors[SegmentedButtonTokens.disabledOutlineColor]
    : theme.colors[SegmentedButtonTokens.outlineColor];
  const textColor = disabled
    ? theme.colors[SegmentedButtonTokens.disabledContentColor]
    : checked
      ? (checkedColor ??
        theme.colors[SegmentedButtonTokens.selectedContentColor])
      : (uncheckedColor ??
        theme.colors[SegmentedButtonTokens.unselectedContentColor]);
  const borderOpacity = disabled
    ? SegmentedButtonTokens.disabledOutlineOpacity
    : stateOpacity.enabled;
  const textOpacity = disabled
    ? SegmentedButtonTokens.disabledContentOpacity
    : stateOpacity.enabled;
  const stateLayerColor = checked
    ? theme.colors[SegmentedButtonTokens.selectedStateLayerColor]
    : theme.colors[SegmentedButtonTokens.unselectedStateLayerColor];
  const focusIndicatorColor =
    theme.colors[SegmentedButtonTokens.focusIndicatorColor];

  return {
    backgroundColor,
    borderColor,
    borderOpacity,
    textColor,
    textOpacity,
    stateLayerColor,
    focusIndicatorColor,
  };
};
