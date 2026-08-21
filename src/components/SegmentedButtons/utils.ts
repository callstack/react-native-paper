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

export const getSegmentedButtonDensityPadding = ({
  density,
}: {
  density?: 'regular' | 'small' | 'medium' | 'high';
}) => {
  return (
    (getSegmentedButtonHeight(density) -
      tokens.md.sys.typescale.labelLarge.lineHeight -
      SegmentedButtonTokens.outlineWidth * 2) /
    2
  );
};

export const getDisabledSegmentedButtonStyle = ({
  theme,
  index,
  buttons,
}: {
  theme: InternalTheme;
  buttons: { disabled?: boolean }[];
  index: number;
}): ViewStyle => {
  const width = getSegmentedButtonBorderWidth({ theme });
  const isDisabled = buttons[index]?.disabled;
  const isNextDisabled = buttons[index + 1]?.disabled;

  if (!isDisabled && isNextDisabled) {
    return {
      borderRightWidth: width,
    };
  }
  return {};
};

export const getSegmentedButtonBorderRadius = ({
  segment,
}: {
  theme: InternalTheme;
  segment?: 'first' | 'last';
}): ViewStyle => {
  if (segment === 'first') {
    return {
      borderTopStartRadius: cornerFull,
      borderBottomStartRadius: cornerFull,
      borderTopEndRadius: 0,
      borderBottomEndRadius: 0,
    };
  } else if (segment === 'last') {
    return {
      borderTopStartRadius: 0,
      borderBottomStartRadius: 0,
      borderTopEndRadius: cornerFull,
      borderBottomEndRadius: cornerFull,
    };
  } else {
    return {
      borderRadius: 0,
    };
  }
};

export const getSegmentedButtonOutlineStyle = (
  segment?: 'first' | 'last'
): ViewStyle => ({
  borderTopWidth: SegmentedButtonTokens.outlineWidth,
  borderBottomWidth: SegmentedButtonTokens.outlineWidth,
  borderStartWidth: SegmentedButtonTokens.outlineWidth,
  borderEndWidth: segment === 'last' ? SegmentedButtonTokens.outlineWidth : 0,
});

const getSegmentedButtonBackgroundColor = ({ checked, theme }: BaseProps) => {
  if (checked) {
    return theme.colors[SegmentedButtonTokens.selectedContainerColor];
  }
  return 'transparent';
};

const getSegmentedButtonBorderColor = ({ theme, disabled }: BaseProps) => {
  if (disabled) {
    return theme.colors[SegmentedButtonTokens.disabledOutlineColor];
  }
  return theme.colors[SegmentedButtonTokens.outlineColor];
};

const getSegmentedButtonBorderWidth = ({
  theme: _t,
}: Omit<BaseProps, 'disabled' | 'checked'>) => {
  return SegmentedButtonTokens.outlineWidth;
};

const getSegmentedButtonTextColor = ({
  theme,
  disabled,
  checked,
  checkedColor,
  uncheckedColor,
}: SegmentedButtonProps) => {
  if (disabled) {
    return theme.colors[SegmentedButtonTokens.disabledContentColor];
  }
  if (checked) {
    return (
      checkedColor ?? theme.colors[SegmentedButtonTokens.selectedContentColor]
    );
  }
  return (
    uncheckedColor ?? theme.colors[SegmentedButtonTokens.unselectedContentColor]
  );
};

export const getSegmentedButtonColors = ({
  theme,
  disabled,
  checked,
  checkedColor,
  uncheckedColor,
}: SegmentedButtonProps) => {
  const backgroundColor = getSegmentedButtonBackgroundColor({
    theme,
    checked,
  });
  const borderColor = getSegmentedButtonBorderColor({
    theme,
    disabled,
    checked,
  });
  const textColor = getSegmentedButtonTextColor({
    theme,
    disabled,
    checked,
    checkedColor,
    uncheckedColor,
  });
  const borderWidth = getSegmentedButtonBorderWidth({ theme });
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
    borderWidth,
    stateLayerColor,
    focusIndicatorColor,
  };
};
