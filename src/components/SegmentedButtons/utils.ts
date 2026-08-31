import type { ViewStyle } from 'react-native';

import { SegmentedButtonTokens } from './tokens';
import type { SegmentedButtonInteractionState } from './tokens';
import type { InternalTheme } from '../../types';

type SegmentedButtonColorState = {
  checked: boolean;
  disabled: boolean;
  interactionState: SegmentedButtonInteractionState;
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

export const getSegmentedButtonStateLayerOpacity = (
  interactionState: SegmentedButtonInteractionState,
  disabled?: boolean
) =>
  disabled || interactionState === 'enabled'
    ? 0
    : SegmentedButtonTokens.stateLayerOpacity[interactionState];

export const getSegmentedButtonInteractionState = ({
  pressed,
  focused,
  hovered,
}: {
  pressed: boolean;
  focused: boolean;
  hovered: boolean;
}): SegmentedButtonInteractionState => {
  if (pressed) {
    return 'pressed';
  }

  if (focused) {
    return 'focused';
  }

  if (hovered) {
    return 'hovered';
  }

  return 'enabled';
};

const resolveContentColors = (
  theme: InternalTheme,
  { checked, disabled, interactionState }: SegmentedButtonColorState,
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

  const labelColorsByState = checked
    ? SegmentedButtonTokens.selectedLabelTextColor
    : SegmentedButtonTokens.unselectedLabelTextColor;
  const iconColorsByState = checked
    ? SegmentedButtonTokens.selectedIconColor
    : SegmentedButtonTokens.unselectedIconColor;

  return {
    labelColor:
      contentColor ?? theme.colors[labelColorsByState[interactionState]],
    labelOpacity: 1,
    iconColor:
      contentColor ?? theme.colors[iconColorsByState[interactionState]],
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

const resolveStateLayerColor = (
  theme: InternalTheme,
  { checked, disabled, interactionState }: SegmentedButtonColorState
) => {
  if (disabled || interactionState === 'enabled') {
    return 'transparent';
  }

  const colorsByState = checked
    ? SegmentedButtonTokens.selectedStateLayerColor
    : SegmentedButtonTokens.unselectedStateLayerColor;

  return theme.colors[colorsByState[interactionState]];
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
    stateLayer: resolveStateLayerColor(theme, options),
    focusIndicator: theme.colors[SegmentedButtonTokens.focusIndicatorColor],
  };
};
