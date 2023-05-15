import type { ColorValue } from 'react-native';

import color from 'color';

import type { InternalTheme } from '../../types';

type IconButtonMode = 'outlined' | 'contained' | 'contained-tonal';

type BaseProps = {
  theme: InternalTheme;
  isMode: (mode: IconButtonMode) => boolean;
  disabled?: boolean;
  selected?: boolean;
};

const getBorderColor = ({
  theme,
  disabled,
}: {
  theme: InternalTheme;
  disabled?: boolean;
}) => {
  if (theme.isV3) {
    if (disabled) {
      return theme.colors.surfaceDisabled;
    }

    return theme.colors.outline;
  }

  return undefined;
};

const getBackgroundColor = ({
  theme,
  isMode,
  disabled,
  selected,
  customContainerColor,
}: BaseProps & { customContainerColor?: string }) => {
  if (theme.isV3) {
    if (disabled) {
      if (isMode('contained') || isMode('contained-tonal')) {
        return theme.colors.surfaceDisabled;
      }
    }

    if (typeof customContainerColor !== 'undefined') {
      return customContainerColor;
    }

    if (isMode('contained')) {
      if (selected) {
        return theme.colors.primary;
      }
      return theme.colors.surfaceVariant;
    }

    if (isMode('contained-tonal')) {
      if (selected) {
        return theme.colors.secondaryContainer;
      }
      return theme.colors.surfaceVariant;
    }

    if (isMode('outlined')) {
      if (selected) {
        return theme.colors.inverseSurface;
      }
    }
  }

  if (typeof customContainerColor !== 'undefined') {
    return customContainerColor;
  }

  return undefined;
};

const getIconColor = ({
  theme,
  isMode,
  disabled,
  selected,
  customIconColor,
}: BaseProps & { customIconColor?: string }) => {
  if (theme.isV3) {
    if (disabled) {
      return theme.colors.onSurfaceDisabled;
    }

    if (typeof customIconColor !== 'undefined') {
      return customIconColor;
    }

    if (isMode('contained')) {
      if (selected) {
        return theme.colors.onPrimary;
      }
      return theme.colors.primary;
    }

    if (isMode('contained-tonal')) {
      if (selected) {
        return theme.colors.onSecondaryContainer;
      }
      return theme.colors.onSurfaceVariant;
    }

    if (isMode('outlined')) {
      if (selected) {
        return theme.colors.inverseOnSurface;
      }
      return theme.colors.onSurfaceVariant;
    }

    if (selected) {
      return theme.colors.primary;
    }
    return theme.colors.onSurfaceVariant;
  }

  if (typeof customIconColor !== 'undefined') {
    return customIconColor;
  }

  return theme.colors.text;
};

const getRippleColor = ({
  theme,
  iconColor,
  customRippleColor,
}: {
  theme: InternalTheme;
  iconColor: string;
  customRippleColor?: ColorValue;
}) => {
  if (customRippleColor) {
    return customRippleColor;
  }
  if (theme.isV3) {
    return color(iconColor).alpha(0.12).rgb().string();
  }
  return color(iconColor).alpha(0.32).rgb().string();
};

export const getIconButtonColor = ({
  theme,
  disabled,
  mode,
  selected,
  customIconColor,
  customContainerColor,
  customRippleColor,
}: {
  theme: InternalTheme;
  disabled?: boolean;
  selected?: boolean;
  mode?: IconButtonMode;
  customIconColor?: string;
  customContainerColor?: string;
  customRippleColor?: ColorValue;
}) => {
  const isMode = (modeToCompare: IconButtonMode) => {
    return mode === modeToCompare;
  };

  const baseIconColorProps = {
    theme,
    isMode,
    disabled,
    selected,
  };

  const iconColor = getIconColor({
    ...baseIconColorProps,
    customIconColor,
  });

  return {
    iconColor,
    backgroundColor: getBackgroundColor({
      ...baseIconColorProps,
      customContainerColor,
    }),
    rippleColor: getRippleColor({ theme, iconColor, customRippleColor }),
    borderColor: getBorderColor({ theme, disabled }),
  };
};
