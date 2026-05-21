import type { ColorValue } from 'react-native';

import { tokens } from '../../theme/tokens';
import type { InternalTheme } from '../../types';

const { stateOpacity } = tokens.md.ref;

const getAndroidCheckedColor = ({
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

const getAndroidUncheckedColor = ({
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

const getAndroidControlColor = ({
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

export const getAndroidSelectionControlColor = ({
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
  const checkedColor = getAndroidCheckedColor({ theme, customColor, error });
  const uncheckedColor = getAndroidUncheckedColor({
    theme,
    customUncheckedColor,
    error,
  });
  const selectionControlOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;

  return {
    selectionControlColor: getAndroidControlColor({
      theme,
      disabled,
      checked,
      checkedColor,
      uncheckedColor,
    }),
    selectionControlOpacity,
  };
};

const getIOSCheckedColor = ({
  theme,
  disabled,
  customColor,
  error,
}: {
  theme: InternalTheme;
  customColor?: ColorValue;
  disabled?: boolean;
  error?: boolean;
}) => {
  if (disabled) {
    return theme.colors.primary;
  }

  if (customColor) {
    return customColor;
  }

  if (error) {
    return theme.colors.error;
  }

  return theme.colors.primary;
};

export const getSelectionControlIOSColor = ({
  theme,
  disabled,
  customColor,
  error,
}: {
  theme: InternalTheme;
  disabled?: boolean;
  customColor?: ColorValue;
  error?: boolean;
}) => {
  const checkedColor = getIOSCheckedColor({
    theme,
    disabled,
    customColor,
    error,
  });
  const checkedColorOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;

  return {
    checkedColor,
    checkedColorOpacity,
  };
};
