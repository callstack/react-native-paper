import type { ColorValue } from 'react-native';

import { tokens } from '../../theme/tokens';
import type { InternalTheme } from '../../types';

const { stateOpacity } = tokens.md.ref;

const getCheckedColor = ({
  theme,
  customColor,
  error,
}: {
  theme: InternalTheme;
  customColor?: ColorValue;
  error?: boolean;
}) => {
  if (customColor) {
    return customColor;
  }

  if (error) {
    return theme.colors.error;
  }

  return theme.colors.primary;
};

const getUncheckedColor = ({
  theme,
  customUncheckedColor,
  error,
}: {
  theme: InternalTheme;
  customUncheckedColor?: ColorValue;
  error?: boolean;
}) => {
  if (customUncheckedColor) {
    return customUncheckedColor;
  }

  if (error) {
    return theme.colors.error;
  }

  return theme.colors.onSurfaceVariant;
};

const getControlColor = ({
  theme,
  checked,
  disabled,
  checkedColor,
  uncheckedColor,
}: {
  theme: InternalTheme;
  checked: boolean;
  checkedColor: ColorValue;
  uncheckedColor: ColorValue;
  disabled?: boolean;
}) => {
  if (disabled) {
    return theme.colors.onSurface;
  }

  if (checked) {
    return checkedColor;
  }
  return uncheckedColor;
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
}) => {
  const checkedColor = getCheckedColor({ theme, customColor, error });
  const uncheckedColor = getUncheckedColor({
    theme,
    customUncheckedColor,
    error,
  });
  const selectionControlOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;

  return {
    selectionControlColor: getControlColor({
      theme,
      disabled,
      checked,
      checkedColor,
      uncheckedColor,
    }),
    selectionControlOpacity,
  };
};
