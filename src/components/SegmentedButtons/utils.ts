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
  previousDisabled?: boolean;
} & BaseProps;

export type SegmentedButtonPosition = 'first' | 'last' | 'middle';

export const getSegmentedButtonHeight = (
  density: 'regular' | 'small' | 'medium' | 'high' = 'regular'
) => SegmentedButtonTokens.containerHeight[density];

export const getSegmentedButtonBorderRadius = ({
  segment,
}: {
  segment: SegmentedButtonPosition;
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
  segment: SegmentedButtonPosition,
  outlineWidth: ViewStyle['borderWidth'] = SegmentedButtonTokens.outlineWidth
): ViewStyle => ({
  borderTopWidth: outlineWidth,
  borderBottomWidth: outlineWidth,
  borderStartWidth: outlineWidth,
  borderEndWidth: segment === 'last' ? outlineWidth : 0,
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
  previousDisabled,
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

  const sharedBorderDisabled = Boolean(disabled && previousDisabled);
  const sharedBorderColor = sharedBorderDisabled
    ? theme.colors[SegmentedButtonTokens.disabledOutlineColor]
    : theme.colors[SegmentedButtonTokens.outlineColor];
  const sharedBorderOpacity = sharedBorderDisabled
    ? SegmentedButtonTokens.disabledOutlineOpacity
    : stateOpacity.enabled;

  const focusIndicatorColor =
    theme.colors[SegmentedButtonTokens.focusIndicatorColor];

  return {
    backgroundColor,
    borderColor,
    borderOpacity,
    textColor,
    textOpacity,
    stateLayerColor,
    sharedBorderColor,
    sharedBorderOpacity,
    focusIndicatorColor,
  };
};
