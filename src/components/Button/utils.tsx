import type { ColorValue, ViewStyle } from 'react-native';

import color from 'color';

import { black, white } from '../../theme/colors';
import { tokens } from '../../theme/tokens';
import { cornerFull } from '../../theme/tokens/sys/shape';
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

export type ButtonSize =
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large';

export type ButtonLabelVariant =
  | 'labelLarge'
  | 'titleMedium'
  | 'headlineSmall'
  | 'headlineLarge';

export type ButtonSizeStyle = {
  minHeight: number;
  paddingHorizontal: number;
  iconSize: number;
  iconGap: number;
  labelVariant: ButtonLabelVariant;
};

/**
 * Per-size metrics for the Material Design 3 (expressive) button sizes.
 * Used when the `size` prop is explicitly set; if `size` is omitted, the
 * Button keeps its legacy visuals.
 */
const BUTTON_SIZE_STYLES: Record<ButtonSize, ButtonSizeStyle> = {
  'extra-small': {
    minHeight: 32,
    paddingHorizontal: 12,
    iconSize: 16,
    iconGap: 4,
    labelVariant: 'labelLarge',
  },
  small: {
    minHeight: 40,
    paddingHorizontal: 16,
    iconSize: 20,
    iconGap: 8,
    labelVariant: 'labelLarge',
  },
  medium: {
    minHeight: 56,
    paddingHorizontal: 24,
    iconSize: 24,
    iconGap: 8,
    labelVariant: 'titleMedium',
  },
  large: {
    minHeight: 96,
    paddingHorizontal: 48,
    iconSize: 32,
    iconGap: 12,
    labelVariant: 'headlineSmall',
  },
  'extra-large': {
    minHeight: 136,
    paddingHorizontal: 64,
    iconSize: 40,
    iconGap: 16,
    labelVariant: 'headlineLarge',
  },
};

export const getButtonSizeStyle = (size: ButtonSize): ButtonSizeStyle =>
  BUTTON_SIZE_STYLES[size];

export type ButtonShape = 'round' | 'square';

/**
 * Per-size corner radii for the Material Design 3 expressive shape variants.
 * `round` is always the full-pill radius; `square` uses a per-size smaller
 * corner. Used only when the `shape` prop is set on `Button`.
 */
const BUTTON_SHAPE_RADIUS: Record<ButtonSize, Record<ButtonShape, number>> = {
  'extra-small': { round: cornerFull, square: 12 },
  small: { round: cornerFull, square: 12 },
  medium: { round: cornerFull, square: 16 },
  large: { round: cornerFull, square: 28 },
  'extra-large': { round: cornerFull, square: 28 },
};

const DEFAULT_SHAPE_RADIUS: Record<ButtonShape, number> = {
  round: cornerFull,
  square: 12,
};

export const getButtonShapeRadius = ({
  size,
  shape,
}: {
  size?: ButtonSize;
  shape: ButtonShape;
}): number =>
  size ? BUTTON_SHAPE_RADIUS[size][shape] : DEFAULT_SHAPE_RADIUS[shape];

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
  selected?: boolean;
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
  selected,
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

  // Selected toggle (only outlined/text adopt a filled "tonal-selected" look;
  // contained / contained-tonal / elevated already render filled).
  if (selected && (isMode('outlined') || isMode('text'))) {
    return colors.secondaryContainer;
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

const getButtonLabelColor = ({
  isMode,
  theme,
  disabled,
  customLabelColor,
  backgroundColor,
  dark,
  selected,
}: BaseProps & {
  customLabelColor?: ColorValue;
  backgroundColor: ColorValue;
  dark?: boolean;
}) => {
  const { colors } = theme as Theme;
  if (customLabelColor && !disabled) {
    return customLabelColor;
  }

  if (disabled) {
    return theme.colors.onSurface;
  }

  // Selected toggle for outlined/text mirrors the contained-tonal label color.
  if (selected && (isMode('outlined') || isMode('text'))) {
    return colors.onSecondaryContainer;
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

const getButtonBorderColor = ({ isMode, theme, selected }: BaseProps) => {
  // A selected outlined toggle drops its outline (the filled background takes
  // over as the visual affordance).
  if (selected && isMode('outlined')) {
    return 'transparent';
  }
  if (isMode('outlined')) {
    return theme.colors.outlineVariant;
  }

  return 'transparent';
};

const getButtonBorderWidth = ({
  isMode,
  selected,
}: Omit<BaseProps, 'disabled' | 'theme'>) => {
  if (selected && isMode('outlined')) {
    return 0;
  }
  if (isMode('outlined')) {
    return 1;
  }

  return 0;
};

export const getButtonColors = ({
  theme,
  mode,
  customButtonColor,
  customLabelColor,
  disabled,
  dark,
  selected,
}: {
  theme: InternalTheme;
  mode: ButtonMode;
  customButtonColor?: ColorValue;
  customLabelColor?: ColorValue;
  disabled?: boolean;
  dark?: boolean;
  selected?: boolean;
}) => {
  const isMode = (modeToCompare: ButtonMode) => {
    return mode === modeToCompare;
  };

  const backgroundColor = getButtonBackgroundColor({
    isMode,
    theme,
    disabled,
    customButtonColor,
    selected,
  });

  const labelColor = getButtonLabelColor({
    isMode,
    theme,
    disabled,
    customLabelColor,
    backgroundColor,
    dark,
    selected,
  });

  const borderColor = getButtonBorderColor({ isMode, theme, selected });

  const borderWidth = getButtonBorderWidth({ isMode, selected });

  const labelOpacity = disabled ? stateOpacity.disabled : stateOpacity.enabled;

  const backgroundOpacity =
    disabled && !isMode('outlined') && !isMode('text')
      ? stateOpacity.pressed
      : stateOpacity.enabled;

  return {
    backgroundColor,
    borderColor,
    labelColor,
    labelOpacity,
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
  labelColor,
  customRippleColor,
}: {
  labelColor: ColorValue;
  customRippleColor?: ColorValue;
}): ColorValue | undefined => {
  if (customRippleColor) {
    return customRippleColor;
  }

  if (typeof labelColor !== 'string') {
    return undefined;
  }

  return color(labelColor).alpha(stateOpacity.pressed).rgb().string();
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
