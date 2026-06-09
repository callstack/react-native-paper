import type { ColorValue, ViewStyle } from 'react-native';

import color from 'color';

import {
  buttonSizeTokens,
  legacyContainerShape,
  type ButtonCornerKey,
} from './tokens';
import { black, white } from '../../theme/colors';
import { tokens } from '../../theme/tokens';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { InternalTheme, Theme } from '../../types';
import { splitStyles } from '../../utils/splitStyles';

const stateOpacity = tokens.md.sys.state.opacity;

export type ButtonMode = 'text' | 'outlined' | 'filled' | 'elevated' | 'tonal';

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
 * Per-size metrics for the Material Design 3 (expressive) button sizes, read
 * from the component tokens. Used when the `size` prop is explicitly set; if
 * `size` is omitted, the Button keeps its legacy visuals.
 */
export const getButtonSizeStyle = (size: ButtonSize): ButtonSizeStyle => {
  const t = buttonSizeTokens[size];
  return {
    minHeight: t.containerHeight,
    paddingHorizontal: t.leadingSpace,
    iconSize: t.iconSize,
    iconGap: t.iconLabelSpace,
    labelVariant: t.labelVariant,
  };
};

export type ButtonShape = 'round' | 'square';

/**
 * Resolves a shape key against the theme: `'full'` is the full-pill radius;
 * every other key maps to `theme.shapes.corner[key]`.
 */
export const resolveButtonCorner = (
  theme: InternalTheme,
  key: ButtonCornerKey
): number =>
  key === 'full' ? cornerFull : (theme as Theme).shapes.corner[key];

/**
 * Corner radius for the requested shape, read from the component tokens and
 * resolved against the theme shape tokens. `round` is the full-pill radius;
 * `square` uses a per-size smaller corner. When `size` is omitted the legacy
 * shape mapping is used.
 */
export const getButtonShapeRadius = ({
  size,
  shape,
  theme,
}: {
  size?: ButtonSize;
  shape: ButtonShape;
  theme: InternalTheme;
}): number => {
  const key = size
    ? shape === 'round'
      ? buttonSizeTokens[size].containerShapeRound
      : buttonSizeTokens[size].containerShapeSquare
    : legacyContainerShape[shape];
  return resolveButtonCorner(theme, key);
};

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
      : { marginLeft: -8, marginRight: 16 };
  }

  if (compact) {
    return { marginLeft: isTextMode ? 6 : 8, marginRight: 0 };
  }
  return isTextMode
    ? { marginLeft: 12, marginRight: -8 }
    : { marginLeft: 16, marginRight: -8 };
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
  // filled / tonal / elevated already render filled).
  if (selected && (isMode('outlined') || isMode('text'))) {
    return colors.secondaryContainer;
  }

  if (isMode('elevated')) {
    return colors.surfaceContainerLow;
  }

  if (isMode('filled')) {
    return colors.primary;
  }

  if (isMode('tonal')) {
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

  // Selected toggle for outlined/text mirrors the tonal label color.
  if (selected && (isMode('outlined') || isMode('text'))) {
    return colors.onSecondaryContainer;
  }

  if (typeof dark === 'boolean') {
    if (isMode('filled') || isMode('tonal') || isMode('elevated')) {
      return isDark({ dark, backgroundColor }) ? white : black;
    }
  }

  // Outlined uses the neutral on-surface-variant label per MD3 spec; text and
  // elevated keep the primary accent.
  if (isMode('outlined')) {
    return colors.onSurfaceVariant;
  }

  if (isMode('text') || isMode('elevated')) {
    return colors.primary;
  }

  if (isMode('filled')) {
    return colors.onPrimary;
  }

  if (isMode('tonal')) {
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
    return theme.colors.outline;
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
