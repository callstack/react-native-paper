import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import color from 'color';

import type { InternalTheme } from '../../types';

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
}: BaseProps & { selectedColor?: string }) => {
  const {
    colors: { onSurfaceVariant, outline },
  } = theme;

  const isSelectedColor = selectedColor !== undefined;

  if (!isOutlined) {
    // If the Chip mode is "flat", set border color to transparent
    return 'transparent';
  }

  if (disabled) {
    return color(onSurfaceVariant).alpha(0.12).rgb().string();
  }

  if (isSelectedColor) {
    return color(selectedColor).alpha(0.29).rgb().string();
  }

  return outline;
};

const getTextColor = ({
  theme,
  isOutlined,
  disabled,
  selectedColor,
}: BaseProps & {
  selectedColor?: string;
}) => {
  const {
    colors: { onSurfaceDisabled, onSurfaceVariant, onSecondaryContainer },
  } = theme;

  const isSelectedColor = selectedColor !== undefined;
  if (disabled) {
    return onSurfaceDisabled;
  }

  if (isSelectedColor) {
    return selectedColor;
  }

  if (isOutlined) {
    return onSurfaceVariant;
  }

  return onSecondaryContainer;
};

const getDefaultBackgroundColor = ({
  theme,
  isOutlined,
}: Omit<BaseProps, 'disabled' | 'selectedColor'>) => {
  const {
    colors: { surface, secondaryContainer },
  } = theme;

  if (isOutlined) {
    return surface;
  }

  return secondaryContainer;
};

const getBackgroundColor = ({
  theme,
  isOutlined,
  disabled,
  customBackgroundColor,
}: BaseProps & {
  customBackgroundColor?: ColorValue;
}) => {
  const {
    colors: { onSurfaceVariant },
  } = theme;

  if (typeof customBackgroundColor === 'string') {
    return customBackgroundColor;
  }

  if (disabled) {
    if (isOutlined) {
      return 'transparent';
    }
    return color(onSurfaceVariant).alpha(0.12).rgb().string();
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
  const {
    colors: { onSurfaceVariant, onSecondaryContainer },
  } = theme;

  const backgroundColor = getBackgroundColor({
    theme,
    disabled,
    isOutlined,
    customBackgroundColor,
  });

  if (isOutlined) {
    if (showSelectedOverlay) {
      return color(backgroundColor)
        .mix(color(onSurfaceVariant), 0.12)
        .rgb()
        .string();
    }
    return color(backgroundColor)
      .mix(color(onSurfaceVariant), 0)
      .rgb()
      .string();
  }

  if (showSelectedOverlay) {
    return color(backgroundColor)
      .mix(color(onSecondaryContainer), 0.12)
      .rgb()
      .string();
  }

  return color(backgroundColor)
    .mix(color(onSecondaryContainer), 0)
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
  const {
    colors: { onSurfaceDisabled, onSurfaceVariant, onSecondaryContainer },
  } = theme;

  const isSelectedColor = selectedColor !== undefined;
  if (disabled) {
    return onSurfaceDisabled;
  }

  if (isSelectedColor) {
    return selectedColor;
  }

  if (isOutlined) {
    return onSurfaceVariant;
  }

  return onSecondaryContainer;
};

const getRippleColor = ({
  theme,
  isOutlined,
  disabled,
  selectedColor,
  customRippleColor,
}: BaseProps & {
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
      customRippleColor,
    }),
    backgroundColor,
    selectedBackgroundColor,
  };
};
