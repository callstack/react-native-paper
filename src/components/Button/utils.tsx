import type { ColorValue } from 'react-native';

import color from 'color';

import { Tokens } from './tokens';
import type { ButtonToggleMode } from './tokens';
import { black, white } from '../../theme/colors';
import { tokens } from '../../theme/tokens';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { InternalTheme } from '../../types';

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
  paddingStart: number;
  paddingEnd: number;
  iconSize: number;
  iconGap: number;
  outlineWidth: number;
  labelVariant: ButtonLabelVariant;
};

/**
 * Per-size metrics for the Material Design 3 (expressive) button sizes, read
 * from the component tokens.
 */
export const getButtonSizeStyle = (size: ButtonSize): ButtonSizeStyle => {
  const t = Tokens.sizes[size];
  return {
    minHeight: t.containerHeight,
    paddingStart: t.leadingSpace,
    paddingEnd: t.trailingSpace,
    iconSize: t.iconSize,
    iconGap: t.iconLabelSpace,
    outlineWidth: t.outlinedOutlineWidth,
    labelVariant: t.labelVariant,
  };
};

export type ButtonShape = 'round' | 'square';

/**
 * A selected toggle contrasts with its unselected state by flipping the shape,
 * so a selected `round` button renders square and vice versa.
 */
export const getEffectiveButtonShape = (
  shape: ButtonShape,
  selected?: boolean
): ButtonShape => {
  if (!selected) {
    return shape;
  }
  return shape === 'round' ? 'square' : 'round';
};

/**
 * Corner radius for the requested shape, read from the component tokens and
 * resolved against the theme shape tokens. `round` is the full-pill radius;
 * `square` uses a per-size smaller corner. A selected button resolves against
 * the `selectedContainerShape*` token pair, after the shape flip above.
 */
export const getButtonShapeRadius = ({
  size,
  shape,
  theme,
  selected,
}: {
  size: ButtonSize;
  shape: ButtonShape;
  theme: InternalTheme;
  selected?: boolean;
}): number => {
  const t = Tokens.sizes[size];
  const token =
    getEffectiveButtonShape(shape, selected) === 'round'
      ? selected
        ? t.selectedContainerShapeRound
        : t.containerShapeRound
      : selected
        ? t.selectedContainerShapeSquare
        : t.containerShapeSquare;
  return resolveCornerRadius(theme, token);
};

/** Corner the container morphs to while pressed. */
export const getButtonPressedRadius = ({
  size,
  theme,
}: {
  size: ButtonSize;
  theme: InternalTheme;
}): number =>
  resolveCornerRadius(theme, Tokens.sizes[size].pressedContainerShape);

type BaseProps = {
  isMode: (mode: ButtonMode) => boolean;
  theme: InternalTheme;
  disabled?: boolean;
  selected?: boolean;
};

type ToggleColors = (typeof Tokens.toggle)[ButtonToggleMode][
  | 'selected'
  | 'unselected'];

const isToggleMode = (mode: ButtonMode): mode is ButtonToggleMode =>
  mode !== 'text';

/**
 * The toggle colour pair for a mode, or `undefined` when the button is not a
 * toggle (`selected` omitted) or the mode has no toggle colours of its own
 * (`text`, which MD3 gives no toggle tokens).
 */
const getToggleColors = ({
  mode,
  selected,
}: {
  mode: ButtonMode;
  selected?: boolean;
}) => {
  if (!isToggleMode(mode) || selected === undefined) {
    return undefined;
  }
  return Tokens.toggle[mode][selected ? 'selected' : 'unselected'];
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
  toggleColors,
}: Omit<BaseProps, 'selected'> & {
  customButtonColor?: ColorValue;
  toggleColors?: ToggleColors;
}) => {
  const { colors } = theme;
  if (customButtonColor && !disabled) {
    return customButtonColor;
  }

  if (disabled) {
    if (isMode('outlined') || isMode('text')) {
      return 'transparent';
    }
    return colors.onSurface;
  }

  if (toggleColors) {
    const { container } = toggleColors;
    return container === 'transparent' ? 'transparent' : colors[container];
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
  toggleColors,
}: Omit<BaseProps, 'selected'> & {
  customLabelColor?: ColorValue;
  backgroundColor: ColorValue;
  dark?: boolean;
  toggleColors?: ToggleColors;
}) => {
  const { colors } = theme;
  if (customLabelColor && !disabled) {
    return customLabelColor;
  }

  if (disabled) {
    return theme.colors.onSurface;
  }

  if (toggleColors) {
    return colors[toggleColors.label];
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
  // A selected outlined toggle drops its outline (the filled inverse-surface
  // background takes over as the visual affordance).
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
  size,
}: Omit<BaseProps, 'disabled' | 'theme'> & { size: ButtonSize }) => {
  if (selected && isMode('outlined')) {
    return 0;
  }
  if (isMode('outlined')) {
    return Tokens.sizes[size].outlinedOutlineWidth;
  }

  return 0;
};

export const getButtonColors = ({
  theme,
  mode,
  size = 'small',
  customButtonColor,
  customLabelColor,
  disabled,
  dark,
  selected,
}: {
  theme: InternalTheme;
  mode: ButtonMode;
  size?: ButtonSize;
  customButtonColor?: ColorValue;
  customLabelColor?: ColorValue;
  disabled?: boolean;
  dark?: boolean;
  selected?: boolean;
}) => {
  const isMode = (modeToCompare: ButtonMode) => {
    return mode === modeToCompare;
  };

  const toggleColors = disabled
    ? undefined
    : getToggleColors({ mode, selected });

  const backgroundColor = getButtonBackgroundColor({
    isMode,
    theme,
    disabled,
    customButtonColor,
    toggleColors,
  });

  const labelColor = getButtonLabelColor({
    isMode,
    theme,
    disabled,
    customLabelColor,
    backgroundColor,
    dark,
    toggleColors,
  });

  const borderColor = getButtonBorderColor({ isMode, theme, selected });

  const borderWidth = getButtonBorderWidth({ isMode, selected, size });

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
