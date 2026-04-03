import { tokens } from '../../styles/themes/tokens';
import type { InternalTheme } from '../../types';

const { stateOpacity } = tokens.md.ref;

const getAndroidCheckedColor = ({
  theme,
  customColor,
}: {
  theme: InternalTheme;
  customColor?: string;
}) => {
  if (customColor) {
    return customColor;
  }

  return theme.colors.primary;
};

const getAndroidUncheckedColor = ({
  theme,
  customUncheckedColor,
}: {
  theme: InternalTheme;
  customUncheckedColor?: string;
}) => {
  if (customUncheckedColor) {
    return customUncheckedColor;
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
  checkedColor: string;
  uncheckedColor: string;
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
}: {
  theme: InternalTheme;
  checked: boolean;
  disabled?: boolean;
  customColor?: string;
  customUncheckedColor?: string;
}) => {
  const checkedColor = getAndroidCheckedColor({ theme, customColor });
  const uncheckedColor = getAndroidUncheckedColor({
    theme,
    customUncheckedColor,
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
}: {
  theme: InternalTheme;
  customColor?: string;
  disabled?: boolean;
}) => {
  if (disabled) {
    return theme.colors.primary;
  }

  if (customColor) {
    return customColor;
  }

  return theme.colors.primary;
};

export const getSelectionControlIOSColor = ({
  theme,
  disabled,
  customColor,
}: {
  theme: InternalTheme;
  disabled?: boolean;
  customColor?: string;
}) => {
  const checkedColor = getIOSCheckedColor({ theme, disabled, customColor });
  const checkedColorOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;

  return {
    checkedColor,
    checkedColorOpacity,
  };
};
