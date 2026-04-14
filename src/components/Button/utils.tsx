import type { ViewStyle } from 'react-native';

import { black, white } from '../../styles/themes/v2/colors';
import { tokens } from '../../styles/themes/v3/tokens';
import type { InternalTheme, MD3Theme } from '../../types';
import { splitStyles } from '../../utils/splitStyles';

const { stateOpacity } = tokens.md.ref;

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
  const { colors } = theme as MD3Theme;
  if (customButtonColor && !disabled) {
    return customButtonColor;
  }

  if (disabled) {
    if (isMode('outlined') || isMode('text')) {
      return 'transparent';
    }
    return colors.onSurface;
  }

  if (isMode('elevated')) {
    return colors.surfaceContainerLow;
  }

  if (isMode('contained')) {
    return colors.primary;
  }

  if (isMode('contained-tonal')) {
    return colors.secondaryContainer;
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
  const { colors } = theme as MD3Theme;
  if (customTextColor && !disabled) {
    return customTextColor;
  }

  if (disabled) {
    return theme.colors.onSurface;
  }

  if (typeof dark === 'boolean') {
    if (
      isMode('contained') ||
      isMode('contained-tonal') ||
      isMode('elevated')
    ) {
      return isDark({ dark, backgroundColor }) ? white : black;
    }
  }

  if (isMode('outlined') || isMode('text') || isMode('elevated')) {
    return colors.primary;
  }

  if (isMode('contained')) {
    return colors.onPrimary;
  }

  if (isMode('contained-tonal')) {
    return colors.onSecondaryContainer;
  }

  return colors.primary;
};

const getButtonBorderColor = ({ isMode, theme }: BaseProps) => {
  if (isMode('outlined')) {
    return theme.colors.outlineVariant;
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

  const borderColor = getButtonBorderColor({ isMode, theme });

  const borderWidth = getButtonBorderWidth({ isMode, theme });

  const textOpacity = disabled ? stateOpacity.disabled : stateOpacity.enabled;

  const backgroundOpacity =
    disabled && !isMode('outlined') && !isMode('text')
      ? stateOpacity.pressed
      : stateOpacity.enabled;

  return {
    backgroundColor,
    borderColor,
    textColor,
    textOpacity,
    borderWidth,
    backgroundOpacity,
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
