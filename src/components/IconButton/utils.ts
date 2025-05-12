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
  const {
    colors: { surfaceDisabled, outline },
  } = theme;

  if (disabled) {
    return surfaceDisabled;
  }

  return outline;
};

const getBackgroundColor = ({
  theme,
  isMode,
  disabled,
  selected,
  customContainerColor,
}: BaseProps & { customContainerColor?: string }) => {
  const {
    colors: {
      surfaceDisabled,
      surfaceVariant,
      primary,
      secondaryContainer,
      inverseSurface,
    },
  } = theme;

  if (disabled) {
    if (isMode('contained') || isMode('contained-tonal')) {
      return surfaceDisabled;
    }
  }

  if (typeof customContainerColor !== 'undefined') {
    return customContainerColor;
  }

  if (isMode('contained')) {
    if (selected) {
      return primary;
    }
    return surfaceVariant;
  }

  if (isMode('contained-tonal')) {
    if (selected) {
      return secondaryContainer;
    }
    return surfaceVariant;
  }

  if (isMode('outlined')) {
    if (selected) {
      return inverseSurface;
    }
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
  const {
    colors: {
      onSurfaceDisabled,
      onPrimary,
      primary,
      onSecondaryContainer,
      onSurfaceVariant,
      inverseOnSurface,
    },
  } = theme;

  if (disabled) {
    return onSurfaceDisabled;
  }

  if (typeof customIconColor !== 'undefined') {
    return customIconColor;
  }

  if (isMode('contained')) {
    if (selected) {
      return onPrimary;
    }
    return primary;
  }

  if (isMode('contained-tonal')) {
    if (selected) {
      return onSecondaryContainer;
    }
    return onSurfaceVariant;
  }

  if (isMode('outlined')) {
    if (selected) {
      return inverseOnSurface;
    }
    return onSurfaceVariant;
  }

  if (selected) {
    return primary;
  }
  return onSurfaceVariant;
};

const getRippleColor = ({
  iconColor,
  customRippleColor,
}: {
  iconColor: string;
  customRippleColor?: ColorValue;
}) => {
  if (customRippleColor) {
    return customRippleColor;
  }
  return color(iconColor).alpha(0.12).rgb().string();
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
    rippleColor: getRippleColor({ iconColor, customRippleColor }),
    borderColor: getBorderColor({ theme, disabled }),
  };
};
