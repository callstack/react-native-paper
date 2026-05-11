import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import color from 'color';

import { tokens } from '../../styles/themes/tokens';
import type { InternalTheme, Theme } from '../../types';

const md3 = (theme: InternalTheme) => theme as Theme;

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
  const { colors } = md3(theme);

  if (!isOutlined) {
    // If the Chip mode is "flat", set border color to transparent
    return 'transparent';
  }

  if (disabled) {
    return colors.surfaceContainer;
  }

  if (isSelectedColor) {
    return color(selectedColor).alpha(0.29).rgb().string();
  }

  return colors.outlineVariant;
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
  const { colors } = md3(theme);
  if (disabled) {
    return colors.onSurface;
  }

  if (isSelectedColor) {
    return selectedColor;
  }

  if (isOutlined) {
    return colors.onSurfaceVariant;
  }

  return colors.onSecondaryContainer;
};

const getDefaultBackgroundColor = ({
  theme,
  isOutlined,
}: Omit<BaseProps, 'disabled' | 'selectedColor'>) => {
  const { colors } = md3(theme);
  if (isOutlined) {
    return colors.surface;
  }

  return colors.secondaryContainer;
};

const getBackgroundColor = ({
  theme,
  isOutlined,
  disabled,
  customBackgroundColor,
}: BaseProps & {
  customBackgroundColor?: ColorValue;
}) => {
  const { colors } = md3(theme);
  if (typeof customBackgroundColor === 'string') {
    return customBackgroundColor;
  }

  if (disabled) {
    if (isOutlined) {
      return 'transparent';
    }
    return colors.surfaceContainerLow;
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
  const { colors } = md3(theme);
  if (disabled) {
    return colors.onSurface;
  }

  if (isSelectedColor) {
    return selectedColor;
  }

  if (isOutlined) {
    return colors.onSurfaceVariant;
  }

  return colors.onSecondaryContainer;
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
