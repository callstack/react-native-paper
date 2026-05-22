import type { ColorValue } from 'react-native';

import { CheckboxTokens } from './tokens';
import { tokens } from '../../theme/tokens';
import type { ColorRole } from '../../theme/types';
import { getStateLayer } from '../../theme/utils/state';
import type { InternalTheme } from '../../types';

// MD3 Checkbox spec: https://m3.material.io/components/checkbox/specs

const stateOpacity = tokens.md.sys.state.opacity;

type StaticState = {
  theme: InternalTheme;
  selected: boolean;
  disabled?: boolean;
  error?: boolean;
  customColor?: ColorValue;
  customUncheckedColor?: ColorValue;
};

type SelectionState = StaticState & {
  hovered?: boolean;
  pressed?: boolean;
};

type SelectionVisualState = {
  containerColor: ColorValue;
  outlineColor: ColorValue;
  containerOpacity: number;
  iconColor: ColorValue;
  stateLayerColor: ColorValue;
  stateLayerOpacity: number;
};

const getContainerColor = ({
  theme,
  disabled,
  error,
  customColor,
}: StaticState): ColorValue => {
  if (disabled) {
    return theme.colors[CheckboxTokens.disabledContainerColor];
  }
  if (customColor) {
    return customColor;
  }
  if (error) {
    return theme.colors[CheckboxTokens.errorContainerColor];
  }
  return theme.colors[CheckboxTokens.containerColor];
};

const getOutlineColor = ({
  theme,
  disabled,
  error,
  customUncheckedColor,
}: StaticState): ColorValue => {
  if (disabled) {
    return theme.colors[CheckboxTokens.disabledOutlineColor];
  }
  if (customUncheckedColor) {
    return customUncheckedColor;
  }
  if (error) {
    return theme.colors[CheckboxTokens.errorOutlineColor];
  }
  return theme.colors[CheckboxTokens.outlineColor];
};

const getIconColor = ({
  theme,
  selected,
  disabled,
  error,
}: StaticState): ColorValue => {
  if (!selected) {
    return 'transparent';
  }
  if (disabled) {
    return theme.colors[CheckboxTokens.disabledIconColor];
  }
  if (error) {
    return theme.colors[CheckboxTokens.errorIconColor];
  }
  return theme.colors[CheckboxTokens.iconColor];
};

// The MD3 spec renders the focused state as an outline ring only (no
// state-layer fill), so `focused` is intentionally not handled here.
const resolveStateLayer = ({
  theme,
  selected,
  hovered,
  pressed,
  error,
}: Omit<SelectionState, 'customColor' | 'customUncheckedColor' | 'disabled'>): {
  color: ColorValue;
  opacity: number;
} => {
  const state = pressed ? 'pressed' : hovered ? 'hovered' : null;
  if (!state) return { color: 'transparent', opacity: 0 };

  // Pressed flips selected/unselected colors per the MD3 spec.
  const role: ColorRole = error
    ? CheckboxTokens.errorStateLayerColor
    : (pressed ? !selected : selected)
    ? CheckboxTokens.selectedStateLayerColor
    : CheckboxTokens.unselectedStateLayerColor;
  return getStateLayer(theme, role, state);
};

/**
 * Resolve the full color + opacity picture for the Checkbox renderer.
 *
 * Returns flat values so the renderer can pass them straight to its
 * `Animated.View` styles without re-deriving anything.
 */
export const getSelectionVisualState = ({
  theme,
  selected,
  disabled,
  hovered,
  pressed,
  error,
  customColor,
  customUncheckedColor,
}: SelectionState): SelectionVisualState => {
  const containerColor = getContainerColor({
    theme,
    selected,
    disabled,
    error,
    customColor,
    customUncheckedColor,
  });
  const outlineColor = getOutlineColor({
    theme,
    selected,
    disabled,
    error,
    customColor,
    customUncheckedColor,
  });
  const iconColor = getIconColor({
    theme,
    selected,
    disabled,
    error,
    customColor,
    customUncheckedColor,
  });
  const stateLayer = resolveStateLayer({
    theme,
    selected,
    hovered: hovered && !disabled,
    pressed: pressed && !disabled,
    error,
  });
  return {
    containerColor,
    outlineColor,
    containerOpacity: disabled ? stateOpacity.disabled : stateOpacity.enabled,
    iconColor,
    stateLayerColor: stateLayer.color,
    stateLayerOpacity: stateLayer.opacity,
  };
};

// Legacy helper consumed by `RadioButtonAndroid` (its color logic was
// historically shared with the pre-MD3 Checkbox). Kept here until
// RadioButton is modernized the same way Checkbox now is; at that point
// the radio variant will own its colors and this export can be deleted.
export const getSelectionControlColor = ({
  theme,
  disabled,
  checked,
  customColor,
  customUncheckedColor,
  error,
}: {
  theme: InternalTheme;
  checked: boolean;
  disabled?: boolean;
  customColor?: ColorValue;
  customUncheckedColor?: ColorValue;
  error?: boolean;
}): { selectionControlColor: ColorValue; selectionControlOpacity: number } => {
  const opacity = disabled ? stateOpacity.disabled : stateOpacity.enabled;
  const checkedColor = customColor
    ? customColor
    : error
    ? theme.colors.error
    : theme.colors.primary;
  const uncheckedColor = customUncheckedColor
    ? customUncheckedColor
    : error
    ? theme.colors.error
    : theme.colors.onSurfaceVariant;
  const color = disabled
    ? theme.colors.onSurface
    : checked
    ? checkedColor
    : uncheckedColor;
  return { selectionControlColor: color, selectionControlOpacity: opacity };
};
