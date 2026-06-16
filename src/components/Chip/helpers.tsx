import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import {
  CHIP_DISABLED_COLOR,
  CHIP_DISABLED_CONTENT_OPACITY,
  CHIP_ELEVATED_CONTAINER_COLOR,
  CHIP_FLAT_CONTAINER_COLOR,
  CHIP_LABEL_COLOR,
  CHIP_LEADING_ICON_COLOR,
  CHIP_OUTLINE_COLOR,
  CHIP_OUTLINED_CONTAINER_COLOR,
  CHIP_SELECTED_CONTAINER_COLOR,
  CHIP_SELECTED_ICON_COLOR,
  CHIP_SELECTED_LABEL_COLOR,
  CHIP_SELECTED_TRAILING_ICON_COLOR,
  CHIP_TRAILING_ICON_COLOR,
} from './tokens';
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
    return isOutlined ? 'transparent' : theme.colors.stateLayerPressed;
  }

  if (customBackgroundColor !== undefined) {
    return customBackgroundColor;
  }

  if (selected) {
    return theme.colors[CHIP_SELECTED_CONTAINER_COLOR];
  }

  if (isOutlined) {
    return theme.colors[CHIP_OUTLINED_CONTAINER_COLOR];
  }

  return elevated
    ? theme.colors[CHIP_ELEVATED_CONTAINER_COLOR]
    : theme.colors[CHIP_FLAT_CONTAINER_COLOR];
};

const getBorderColor = ({
  theme,
  isOutlined,
  selected,
  disabled,
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

  return theme.colors[CHIP_OUTLINE_COLOR];
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
    return theme.colors[CHIP_DISABLED_COLOR];
  }

  if (selectedColor !== undefined) {
    return selectedColor;
  }

  if (selected) {
    return theme.colors[CHIP_SELECTED_LABEL_COLOR];
  }

  return theme.colors[CHIP_LABEL_COLOR];
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
    return theme.colors[CHIP_DISABLED_COLOR];
  }

  if (selectedColor !== undefined) {
    return selectedColor;
  }

  if (selected) {
    return theme.colors[CHIP_SELECTED_ICON_COLOR];
  }

  return theme.colors[CHIP_LEADING_ICON_COLOR];
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
    return theme.colors[CHIP_DISABLED_COLOR];
  }

  if (selectedColor !== undefined) {
    return selectedColor;
  }

  if (selected) {
    return theme.colors[CHIP_SELECTED_TRAILING_ICON_COLOR];
  }

  return theme.colors[CHIP_TRAILING_ICON_COLOR];
};

export const getChipColors = ({
  isOutlined,
  theme,
  selected,
  selectedColor,
  customBackgroundColor,
  disabled,
  elevated,
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
  };

  const contentOpacity = disabled ? CHIP_DISABLED_CONTENT_OPACITY : 1;

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
    closeIconColor: getTrailingIconColor({
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
