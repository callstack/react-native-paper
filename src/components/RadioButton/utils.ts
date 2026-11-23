import type { ColorValue, GestureResponderEvent } from 'react-native';

import { RadioButtonTokens } from './tokens';
import { tokens } from '../../theme/tokens';
import type { ColorRole, InternalTheme, StateLayer } from '../../theme/types';
import { getStateLayer } from '../../theme/utils/state';

const stateOpacity = tokens.md.sys.state.opacity;

export const handlePress = ({
  onPress,
  value,
  onValueChange,
  event,
}: {
  onPress?: (e: GestureResponderEvent) => void;
  value: string;
  onValueChange?: (value: string) => void;
  event: GestureResponderEvent;
}) => {
  if (onPress && onValueChange) {
    console.warn(
      `onPress in the scope of RadioButtonGroup will not be executed, use onValueChange instead`
    );
  }

  onValueChange ? onValueChange(value) : onPress?.(event);
};

export const isChecked = ({
  value,
  status,
  contextValue,
}: {
  value: string;
  status?: 'checked' | 'unchecked';
  contextValue?: string;
}) => {
  if (contextValue !== undefined && contextValue !== null) {
    return contextValue === value ? 'checked' : 'unchecked';
  } else {
    return status;
  }
};

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
      ? theme.colors[RadioButtonTokens.errorColor]
      : theme.colors[RadioButtonTokens.checkedColor];
  const uncheckedColor = customUncheckedColor
    ? customUncheckedColor
    : error
      ? theme.colors[RadioButtonTokens.errorColor]
      : theme.colors[RadioButtonTokens.uncheckedColor];
  const color = disabled
    ? theme.colors[RadioButtonTokens.disabledColor]
    : checked
      ? checkedColor
      : uncheckedColor;
  return { selectionControlColor: color, selectionControlOpacity: opacity };
};

export type RadioButtonInteraction = 'hovered' | 'focused' | 'pressed';

const stateLayerRoles: Record<
  RadioButtonInteraction,
  Record<'checked' | 'unchecked', ColorRole>
> = {
  hovered: {
    checked: RadioButtonTokens.checkedHoverStateLayerColor,
    unchecked: RadioButtonTokens.uncheckedHoverStateLayerColor,
  },
  focused: {
    checked: RadioButtonTokens.checkedFocusStateLayerColor,
    unchecked: RadioButtonTokens.uncheckedFocusStateLayerColor,
  },
  pressed: {
    checked: RadioButtonTokens.checkedPressedStateLayerColor,
    unchecked: RadioButtonTokens.uncheckedPressedStateLayerColor,
  },
};

export const getInteraction = ({
  pressed,
  focused,
  hovered,
}: {
  pressed: boolean;
  focused: boolean;
  hovered: boolean;
}): RadioButtonInteraction | null => {
  if (pressed) return 'pressed';
  if (focused) return 'focused';
  if (hovered) return 'hovered';
  return null;
};

export const getSelectionStateLayer = ({
  theme,
  checked,
  disabled,
  error,
  interaction,
  customColor,
  customUncheckedColor,
}: {
  theme: InternalTheme;
  checked: boolean;
  disabled?: boolean;
  error?: boolean;
  interaction: RadioButtonInteraction | null;
  customColor?: ColorValue;
  customUncheckedColor?: ColorValue;
}): StateLayer => {
  if (interaction === null || disabled) {
    return { color: 'transparent', opacity: 0 };
  }

  // press previews the state being moved to, so the layer takes the opposite selection's color
  const followsChecked = interaction === 'pressed' ? !checked : checked;
  const custom = followsChecked ? customColor : customUncheckedColor;

  if (custom) {
    return { color: custom, opacity: stateOpacity[interaction] };
  }

  if (error) {
    return getStateLayer(
      theme,
      RadioButtonTokens.errorStateLayerColor,
      interaction
    );
  }

  return getStateLayer(
    theme,
    stateLayerRoles[interaction][checked ? 'checked' : 'unchecked'],
    interaction
  );
};
