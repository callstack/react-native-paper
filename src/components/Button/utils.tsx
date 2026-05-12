import type { ColorValue, ViewStyle } from 'react-native';

import color from 'color';

import { black, white } from '../../theme/colors';
import { tokens } from '../../theme/tokens';
import type { InternalTheme, Theme } from '../../types';
import { splitStyles } from '../../utils/splitStyles';

const { stateOpacity } = tokens.md.ref;

export type ButtonMode =
  | 'text'
  | 'outlined'
  | 'contained'
  | 'elevated'
  | 'contained-tonal';

export type ButtonIconPosition = 'leading' | 'trailing';

/**
 * Returns the margins applied to the button's icon (or loading indicator)
 * depending on the button mode, density and the position of the icon relative
 * to the label.
 */
export const getButtonIconStyle = ({
  mode,
  compact,
  position,
}: {
  mode: ButtonMode;
  compact?: boolean;
  position: ButtonIconPosition;
}): Pick<ViewStyle, 'marginLeft' | 'marginRight'> => {
  const isTextMode = mode === 'text';

  if (position === 'trailing') {
    if (compact) {
      return { marginLeft: 0, marginRight: isTextMode ? 6 : 8 };
    }
    return isTextMode
      ? { marginLeft: -8, marginRight: 12 }
      : { marginLeft: -16, marginRight: 16 };
  }

  if (compact) {
    return { marginLeft: isTextMode ? 6 : 8, marginRight: 0 };
  }
  return isTextMode
    ? { marginLeft: 12, marginRight: -8 }
    : { marginLeft: 16, marginRight: -16 };
};

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
  backgroundColor?: ColorValue;
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
  customButtonColor?: ColorValue;
}) => {
  const { colors } = theme as Theme;
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
  customTextColor?: ColorValue;
  backgroundColor: ColorValue;
  dark?: boolean;
}) => {
  const { colors } = theme as Theme;
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
  customButtonColor?: ColorValue;
  customTextColor?: ColorValue;
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

/**
 * Returns the color used for the button's ripple / state layer. Defaults to
 * the label color at the pressed-state opacity (per Material Design 3), unless
 * a custom ripple color is provided.
 *
 * When the label color is not a plain string (e.g. an Android Material You
 * `PlatformColor`), `undefined` is returned so `TouchableRipple` falls back to
 * its own default state-layer color.
 */
export const getButtonRippleColor = ({
  textColor,
  customRippleColor,
}: {
  textColor: ColorValue;
  customRippleColor?: ColorValue;
}): ColorValue | undefined => {
  if (customRippleColor) {
    return customRippleColor;
  }

  if (typeof textColor !== 'string') {
    return undefined;
  }

  return color(textColor).alpha(stateOpacity.pressed).rgb().string();
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
