import { type ViewStyle } from 'react-native';

import color from 'color';

import { MD3Colors } from '../../styles/themes/v3/tokens';
import type { InternalTheme } from '../../types';
import { splitStyles } from '../../utils/splitStyles';

export type ButtonMode =
  | 'text'
  | 'outlined'
  | 'contained'
  | 'elevated'
  | 'contained-tonal';

type BaseProps = {
  isMode: (mode: ButtonMode) => boolean;
  theme: InternalTheme;
  disabled?: boolean;
};

const isDark = ({
  dark,
  backgroundColor,
}: {
  dark?: boolean;
  backgroundColor?: string;
}) => {
  if (typeof dark === 'boolean') {
    return dark;
  }

  if (backgroundColor === 'transparent') {
    return false;
  }

  if (backgroundColor !== 'transparent') {
    return !color(backgroundColor).isLight();
  }

  return false;
};

const getButtonBackgroundColor = ({
  isMode,
  theme,
  disabled,
  customButtonColor,
}: BaseProps & {
  customButtonColor?: string;
}) => {
  const {
    colors: { surfaceDisabled, elevation, primary, secondaryContainer },
  } = theme;

  if (customButtonColor && !disabled) {
    return customButtonColor;
  }

  if (disabled) {
    if (isMode('outlined') || isMode('text')) {
      return 'transparent';
    }

    return surfaceDisabled;
  }

  if (isMode('elevated')) {
    return elevation.level1;
  }

  if (isMode('contained')) {
    return primary;
  }

  if (isMode('contained-tonal')) {
    return secondaryContainer;
  }

  return 'transparent';
};

const getButtonTextColor = ({
  isMode,
  theme,
  disabled,
  customTextColor,
  backgroundColor,
  dark,
}: BaseProps & {
  customTextColor?: string;
  backgroundColor: string;
  dark?: boolean;
}) => {
  const {
    colors: { onSurfaceDisabled, primary, onPrimary, onSecondaryContainer },
  } = theme;
  if (customTextColor && !disabled) {
    return customTextColor;
  }

  if (disabled) {
    return onSurfaceDisabled;
  }

  if (typeof dark === 'boolean') {
    if (
      isMode('contained') ||
      isMode('contained-tonal') ||
      isMode('elevated')
    ) {
      return isDark({ dark, backgroundColor })
        ? MD3Colors.primary100
        : MD3Colors.primary0;
    }
  }

  if (isMode('outlined') || isMode('text') || isMode('elevated')) {
    return primary;
  }

  if (isMode('contained')) {
    return onPrimary;
  }

  if (isMode('contained-tonal')) {
    return onSecondaryContainer;
  }

  return primary;
};

const getButtonBorderColor = ({ isMode, disabled, theme }: BaseProps) => {
  const {
    colors: { surfaceDisabled, outline },
  } = theme;

  if (disabled && isMode('outlined')) {
    return surfaceDisabled;
  }

  if (isMode('outlined')) {
    return outline;
  }

  return 'transparent';
};

const getButtonBorderWidth = ({ isMode }: Omit<BaseProps, 'disabled'>) => {
  if (isMode('outlined')) {
    return 1;
  }

  return 0;
};

export const getButtonColors = ({
  theme,
  mode,
  customButtonColor,
  customTextColor,
  disabled,
  dark,
}: {
  theme: InternalTheme;
  mode: ButtonMode;
  customButtonColor?: string;
  customTextColor?: string;
  disabled?: boolean;
  dark?: boolean;
}) => {
  const isMode = (modeToCompare: ButtonMode) => {
    return mode === modeToCompare;
  };

  const backgroundColor = getButtonBackgroundColor({
    isMode,
    theme,
    disabled,
    customButtonColor,
  });

  const textColor = getButtonTextColor({
    isMode,
    theme,
    disabled,
    customTextColor,
    backgroundColor,
    dark,
  });

  const borderColor = getButtonBorderColor({ isMode, theme, disabled });

  const borderWidth = getButtonBorderWidth({ isMode, theme });

  return {
    backgroundColor,
    borderColor,
    textColor,
    borderWidth,
  };
};

type ViewStyleBorderRadiusStyles = Partial<
  Pick<
    ViewStyle,
    | 'borderBottomEndRadius'
    | 'borderBottomLeftRadius'
    | 'borderBottomRightRadius'
    | 'borderBottomStartRadius'
    | 'borderTopEndRadius'
    | 'borderTopLeftRadius'
    | 'borderTopRightRadius'
    | 'borderTopStartRadius'
    | 'borderRadius'
  >
>;
export const getButtonTouchableRippleStyle = (
  style?: ViewStyle,
  borderWidth: number = 0
): ViewStyleBorderRadiusStyles => {
  if (!style) return {};
  const touchableRippleStyle: ViewStyleBorderRadiusStyles = {};

  const [, borderRadiusStyles] = splitStyles(
    style,
    (style) => style.startsWith('border') && style.endsWith('Radius')
  );

  (
    Object.keys(borderRadiusStyles) as Array<keyof ViewStyleBorderRadiusStyles>
  ).forEach((key) => {
    const value = style[key as keyof ViewStyleBorderRadiusStyles];
    if (typeof value === 'number') {
      // Only subtract borderWidth if value is greater than 0
      const radius = value > 0 ? value - borderWidth : 0;
      touchableRippleStyle[key as keyof ViewStyleBorderRadiusStyles] = radius;
    }
  });
  return touchableRippleStyle;
};
