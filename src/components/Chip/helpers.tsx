import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import color from 'color';

import { tokens } from '../../styles/themes/tokens';
import type { InternalTheme } from '../../types';

const { stateOpacity } = tokens.md.ref;

export type ChipAvatarProps = {
  style?: StyleProp<ViewStyle>;
};

type BaseProps = {
  theme: InternalTheme;
  isOutlined: boolean;
  disabled?: boolean;
};

const getBorderColor = ({
  theme,
  isOutlined,
  disabled,
  selectedColor,
}: BaseProps & { backgroundColor: string; selectedColor?: string }) => {
  const isSelectedColor = selectedColor !== undefined;

  if (!isOutlined) {
    // If the Chip mode is "flat", set border color to transparent
    return 'transparent';
  }

  if (disabled) {
    return theme.colors.surfaceContainer;
  }

  if (isSelectedColor) {
    return color(selectedColor).alpha(0.29).rgb().string();
  }

  return theme.colors.outlineVariant;
};

const getTextColor = ({
  theme,
  isOutlined,
  disabled,
  selectedColor,
}: BaseProps & {
  selectedColor?: string;
}) => {
  const isSelectedColor = selectedColor !== undefined;

  if (disabled) {
    return theme.colors.onSurface;
  }

  if (isSelectedColor) {
    return selectedColor;
  }

  if (isOutlined) {
    return theme.colors.onSurfaceVariant;
  }

  return theme.colors.onSecondaryContainer;
};

const getDefaultBackgroundColor = ({
  theme,
  isOutlined,
}: Omit<BaseProps, 'disabled' | 'selectedColor'>) => {
  if (isOutlined) {
    return theme.colors.surface;
  }

  return theme.colors.secondaryContainer;
};

const getBackgroundColor = ({
  theme,
  isOutlined,
  disabled,
  customBackgroundColor,
}: BaseProps & {
  customBackgroundColor?: ColorValue;
}) => {
  if (typeof customBackgroundColor === 'string') {
    return customBackgroundColor;
  }

  if (disabled) {
    if (isOutlined) {
      return 'transparent';
    }
    return theme.colors.surfaceContainerLow;
  }

  return getDefaultBackgroundColor({ theme, isOutlined });
};

const getSelectedBackgroundColor = ({
  theme,
  isOutlined,
  disabled,
  customBackgroundColor,
}: BaseProps & {
  customBackgroundColor?: ColorValue;
}) => {
  return getBackgroundColor({
    theme,
    disabled,
    isOutlined,
    customBackgroundColor,
  });
};

const getIconColor = ({
  theme,
  isOutlined,
  disabled,
  selectedColor,
}: BaseProps & {
  selectedColor?: string;
}) => {
  const isSelectedColor = selectedColor !== undefined;

  if (disabled) {
    return theme.colors.onSurface;
  }

  if (isSelectedColor) {
    return selectedColor;
  }

  if (isOutlined) {
    return theme.colors.onSurfaceVariant;
  }

  return theme.colors.onSecondaryContainer;
};

export const getChipColors = ({
  isOutlined,
  theme,
  selectedColor,
  customBackgroundColor,
  disabled,
}: BaseProps & {
  customBackgroundColor?: ColorValue;
  disabled?: boolean;
  selectedColor?: string;
}) => {
  const baseChipColorProps = { theme, isOutlined, disabled };

  const backgroundColor = getBackgroundColor({
    ...baseChipColorProps,
    customBackgroundColor,
  });

  const selectedBackgroundColor = getSelectedBackgroundColor({
    ...baseChipColorProps,
    customBackgroundColor,
  });

  const contentOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;

  return {
    borderColor: getBorderColor({
      ...baseChipColorProps,
      selectedColor,
      backgroundColor,
    }),
    textColor: getTextColor({
      ...baseChipColorProps,
      selectedColor,
    }),
    iconColor: getIconColor({
      ...baseChipColorProps,
      selectedColor,
    }),
    contentOpacity,
    backgroundColor,
    selectedBackgroundColor,
  };
};
