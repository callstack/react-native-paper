import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import { ChipTokens } from './tokens';
import type { InternalTheme } from '../../types';

export type ChipAvatarProps = {
  style?: StyleProp<ViewStyle>;
};

type BaseProps = {
  theme: InternalTheme;
  isOutlined: boolean;
  selected?: boolean;
  disabled?: boolean;
  elevated?: boolean;
  focused?: boolean;
};

const getContainerColor = ({
  theme,
  isOutlined,
  selected,
  disabled,
  elevated,
  customBackgroundColor,
}: BaseProps & {
  customBackgroundColor?: ColorValue;
}) => {
  if (disabled) {
    // A disabled selected chip keeps its filled look (no outline); only a
    // disabled unselected outlined chip stays unfilled.
    return isOutlined && !selected
      ? 'transparent'
      : theme.colors.stateLayerPressed;
  }

  if (customBackgroundColor !== undefined) {
    return customBackgroundColor;
  }

  if (selected) {
    return theme.colors[ChipTokens.selectedContainerColor];
  }

  if (isOutlined) {
    return theme.colors[ChipTokens.outlinedContainerColor];
  }

  return elevated
    ? theme.colors[ChipTokens.elevatedContainerColor]
    : theme.colors[ChipTokens.flatContainerColor];
};

const getBorderColor = ({
  theme,
  isOutlined,
  selected,
  disabled,
  focused,
  selectedColor,
}: BaseProps & {
  selectedColor?: ColorValue;
}) => {
  if (!isOutlined || selected) {
    return 'transparent';
  }

  if (disabled) {
    return theme.colors.outlineVariant;
  }

  if (selectedColor !== undefined) {
    return selectedColor;
  }

  if (focused) {
    return theme.colors[ChipTokens.focusOutlineColor];
  }

  return theme.colors[ChipTokens.outlineColor];
};

const getLabelColor = ({
  theme,
  selected,
  disabled,
  selectedColor,
}: BaseProps & {
  selectedColor?: ColorValue;
}) => {
  if (disabled) {
    return theme.colors[ChipTokens.disabledColor];
  }

  if (selectedColor !== undefined) {
    return selectedColor;
  }

  if (selected) {
    return theme.colors[ChipTokens.selectedLabelColor];
  }

  return theme.colors[ChipTokens.labelColor];
};

const getLeadingIconColor = ({
  theme,
  selected,
  disabled,
  selectedColor,
}: BaseProps & {
  selectedColor?: ColorValue;
}) => {
  if (disabled) {
    return theme.colors[ChipTokens.disabledColor];
  }

  if (selectedColor !== undefined) {
    return selectedColor;
  }

  if (selected) {
    return theme.colors[ChipTokens.selectedIconColor];
  }

  return theme.colors[ChipTokens.leadingIconColor];
};

const getTrailingIconColor = ({
  theme,
  selected,
  disabled,
  selectedColor,
}: BaseProps & {
  selectedColor?: ColorValue;
}) => {
  if (disabled) {
    return theme.colors[ChipTokens.disabledColor];
  }

  if (selectedColor !== undefined) {
    return selectedColor;
  }

  if (selected) {
    return theme.colors[ChipTokens.selectedTrailingIconColor];
  }

  return theme.colors[ChipTokens.trailingIconColor];
};

export const getChipColors = ({
  isOutlined,
  theme,
  selected,
  selectedColor,
  customBackgroundColor,
  disabled,
  elevated,
  focused,
}: BaseProps & {
  customBackgroundColor?: ColorValue;
  disabled?: boolean;
  selectedColor?: ColorValue;
}) => {
  const baseChipColorProps = {
    theme,
    isOutlined,
    selected,
    disabled,
    elevated,
    focused,
  };

  const contentOpacity = disabled ? ChipTokens.disabledContentOpacity : 1;

  return {
    borderColor: getBorderColor({
      ...baseChipColorProps,
      selectedColor,
    }),
    textColor: getLabelColor({
      ...baseChipColorProps,
      selectedColor,
    }),
    iconColor: getLeadingIconColor({
      ...baseChipColorProps,
      selectedColor,
    }),
    trailingIconColor: getTrailingIconColor({
      ...baseChipColorProps,
      selectedColor,
    }),
    contentOpacity,
    backgroundColor: getContainerColor({
      ...baseChipColorProps,
      customBackgroundColor,
    }),
    selectedBackgroundColor: getContainerColor({
      ...baseChipColorProps,
      selected: true,
      customBackgroundColor,
    }),
    rippleColor: theme.colors.stateLayerPressed,
    avatarOverlayColor: theme.colors.stateLayerPressed,
  };
};
