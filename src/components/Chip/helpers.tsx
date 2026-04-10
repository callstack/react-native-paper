import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import color from 'color';

import type { InternalTheme, MD3Theme } from '../../types';

const md3 = (theme: InternalTheme) => theme as MD3Theme;

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
  backgroundColor: _backgroundColor,
}: BaseProps & { backgroundColor: string; selectedColor?: string }) => {
  const isSelectedColor = selectedColor !== undefined;
  const { colors } = md3(theme);

  if (!isOutlined) {
    // If the Chip mode is "flat", set border color to transparent
    return 'transparent';
  }

  if (disabled) {
    return color(colors.onSurfaceVariant).alpha(0.12).rgb().string();
  }

  if (isSelectedColor) {
    return color(selectedColor).alpha(0.29).rgb().string();
  }

  return colors.outline;
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
    return colors.onSurfaceDisabled;
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
    return color(colors.onSurfaceVariant).alpha(0.12).rgb().string();
  }

  return getDefaultBackgroundColor({ theme, isOutlined });
};

const getSelectedBackgroundColor = ({
  theme,
  isOutlined,
  disabled,
  customBackgroundColor,
  showSelectedOverlay,
}: BaseProps & {
  customBackgroundColor?: ColorValue;
  showSelectedOverlay?: boolean;
}) => {
  const { colors } = md3(theme);
  const backgroundColor = getBackgroundColor({
    theme,
    disabled,
    isOutlined,
    customBackgroundColor,
  });

  if (isOutlined) {
    if (showSelectedOverlay) {
      return color(backgroundColor)
        .mix(color(colors.onSurfaceVariant), 0.12)
        .rgb()
        .string();
    }
    return color(backgroundColor)
      .mix(color(colors.onSurfaceVariant), 0)
      .rgb()
      .string();
  }

  if (showSelectedOverlay) {
    return color(backgroundColor)
      .mix(color(colors.onSecondaryContainer), 0.12)
      .rgb()
      .string();
  }

  return color(backgroundColor)
    .mix(color(colors.onSecondaryContainer), 0)
    .rgb()
    .string();
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
    return colors.onSurfaceDisabled;
  }

  if (isSelectedColor) {
    return selectedColor;
  }

  if (isOutlined) {
    return colors.onSurfaceVariant;
  }

  return colors.onSecondaryContainer;
};

const getRippleColor = ({
  theme,
  isOutlined,
  disabled,
  selectedColor,
  selectedBackgroundColor: _selectedBackgroundColor,
  customRippleColor,
}: BaseProps & {
  selectedBackgroundColor: string;
  selectedColor?: string;
  customRippleColor?: ColorValue;
}) => {
  if (customRippleColor) {
    return customRippleColor;
  }

  const isSelectedColor = selectedColor !== undefined;
  const textColor = getTextColor({
    theme,
    disabled,
    selectedColor,
    isOutlined,
  });

  if (isSelectedColor) {
    return color(selectedColor).alpha(0.12).rgb().string();
  }

  return color(textColor).alpha(0.12).rgb().string();
};

export const getChipColors = ({
  isOutlined,
  theme,
  selectedColor,
  showSelectedOverlay,
  customBackgroundColor,
  disabled,
  customRippleColor,
}: BaseProps & {
  customBackgroundColor?: ColorValue;
  disabled?: boolean;
  showSelectedOverlay?: boolean;
  selectedColor?: string;
  customRippleColor?: ColorValue;
}) => {
  const baseChipColorProps = { theme, isOutlined, disabled };

  const backgroundColor = getBackgroundColor({
    ...baseChipColorProps,
    customBackgroundColor,
  });

  const selectedBackgroundColor = getSelectedBackgroundColor({
    ...baseChipColorProps,
    customBackgroundColor,
    showSelectedOverlay,
  });

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
    rippleColor: getRippleColor({
      ...baseChipColorProps,
      selectedColor,
      selectedBackgroundColor,
      customRippleColor,
    }),
    backgroundColor,
    selectedBackgroundColor,
  };
};
