import type { ColorValue, GestureResponderEvent } from 'react-native';

import { tokens } from '../../theme/tokens';
import type { InternalTheme } from '../../types';

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
