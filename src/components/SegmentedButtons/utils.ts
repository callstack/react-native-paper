import type { ViewStyle } from 'react-native';

import { SegmentedButtonTokens } from './tokens';
import type { SegmentedButtonInteractionState } from './tokens';
import type { InternalTheme } from '../../types';

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
  checked: boolean;
};

type SegmentedButtonProps = {
  checkedColor?: string;
  uncheckedColor?: string;
  previousDisabled?: boolean;
  interactionState?: SegmentedButtonInteractionState;
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

export const getSegmentedButtonOutlineStyle = (
  segment: SegmentedButtonPosition,
  outlineWidth: ViewStyle['borderWidth'] = SegmentedButtonTokens.outlineWidth
): ViewStyle => ({
  borderTopWidth: outlineWidth,
  borderBottomWidth: outlineWidth,
  borderStartWidth: outlineWidth,
  borderEndWidth: segment === 'last' ? outlineWidth : 0,
});

type SegmentedButtonBorderStyles = {
  outlineBorderStyle: ViewStyle;
  sharedBorderStyle?: ViewStyle;
};

export const getSegmentedButtonBorderStyles = ({
  segment,
  borderOverrides,
}: {
  segment: SegmentedButtonPosition;
  borderOverrides: ViewStyle;
}): SegmentedButtonBorderStyles => {
  const { borderWidth, ...explicitBorderOverrides } = borderOverrides;
  const resolvedBorderStyle = {
    ...getSegmentedButtonOutlineStyle(
      segment,
      borderWidth ?? SegmentedButtonTokens.outlineWidth
    ),
    ...explicitBorderOverrides,
  };

  if (segment === 'first') {
    return { outlineBorderStyle: resolvedBorderStyle };
  }

  const { borderStartWidth, borderStartColor, ...outlineBorderStyle } =
    resolvedBorderStyle;

  // The shared edge is separate so adjacent disabled items can style it once.
  const sharedBorderStyle: ViewStyle = {
    borderStartWidth,
    ...(resolvedBorderStyle.borderColor !== undefined
      ? { borderColor: resolvedBorderStyle.borderColor }
      : {}),
    ...(resolvedBorderStyle.borderStyle !== undefined
      ? { borderStyle: resolvedBorderStyle.borderStyle }
      : {}),
    ...(borderStartColor !== undefined ? { borderStartColor } : {}),
  };

  return { outlineBorderStyle, sharedBorderStyle };
};

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
    return SegmentedButtonTokens.stateLayerOpacity.pressed;
  }

  if (focused) {
    return SegmentedButtonTokens.stateLayerOpacity.focused;
  }

  if (hovered) {
    return SegmentedButtonTokens.stateLayerOpacity.hovered;
  }

  return 0;
};

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

export const getSegmentedButtonColors = ({
  theme,
  disabled,
  checked,
  checkedColor,
  uncheckedColor,
  previousDisabled,
  interactionState = 'enabled',
}: SegmentedButtonProps) => {
  const backgroundColor = checked
    ? theme.colors[SegmentedButtonTokens.selectedContainerColor]
    : 'transparent';

  const borderColor = disabled
    ? theme.colors[SegmentedButtonTokens.disabledOutlineColor]
    : theme.colors[SegmentedButtonTokens.outlineColor];

  const customContentColor = checked ? checkedColor : uncheckedColor;
  const textColor = disabled
    ? theme.colors[SegmentedButtonTokens.disabledLabelTextColor]
    : checked
      ? (customContentColor ??
        theme.colors[
          SegmentedButtonTokens.selectedLabelTextColor[interactionState]
        ])
      : (customContentColor ??
        theme.colors[
          SegmentedButtonTokens.unselectedLabelTextColor[interactionState]
        ]);

  const iconColor = disabled
    ? theme.colors[SegmentedButtonTokens.disabledIconColor]
    : checked
      ? (customContentColor ??
        theme.colors[SegmentedButtonTokens.selectedIconColor[interactionState]])
      : (customContentColor ??
        theme.colors[
          SegmentedButtonTokens.unselectedIconColor[interactionState]
        ]);

  const borderOpacity = disabled
    ? SegmentedButtonTokens.disabledOutlineOpacity
    : 1;

  const textOpacity = disabled
    ? SegmentedButtonTokens.disabledLabelTextOpacity
    : 1;

  const iconOpacity = disabled ? SegmentedButtonTokens.disabledIconOpacity : 1;

  const stateLayerColor =
    disabled || interactionState === 'enabled'
      ? 'transparent'
      : checked
        ? theme.colors[
            SegmentedButtonTokens.selectedStateLayerColor[interactionState]
          ]
        : theme.colors[
            SegmentedButtonTokens.unselectedStateLayerColor[interactionState]
          ];

  const sharedBorderDisabled = Boolean(disabled && previousDisabled);
  const sharedBorderColor = sharedBorderDisabled
    ? theme.colors[SegmentedButtonTokens.disabledOutlineColor]
    : theme.colors[SegmentedButtonTokens.outlineColor];
  const sharedBorderOpacity = sharedBorderDisabled
    ? SegmentedButtonTokens.disabledOutlineOpacity
    : 1;

  const focusIndicatorColor =
    theme.colors[SegmentedButtonTokens.focusIndicatorColor];

  return {
    backgroundColor,
    borderColor,
    borderOpacity,
    textColor,
    textOpacity,
    iconColor,
    iconOpacity,
    stateLayerColor,
    sharedBorderColor,
    sharedBorderOpacity,
    focusIndicatorColor,
  };
};
