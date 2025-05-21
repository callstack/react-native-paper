import color from 'color';

import type { InternalTheme } from '../../types';

const getAndroidCheckedColor = ({
  theme,
  customColor,
}: {
  theme: InternalTheme;
  customColor?: string;
}) => {
  const {
    colors: { primary },
  } = theme;

  if (customColor) {
    return customColor;
  }

  return primary;
};

const getAndroidUncheckedColor = ({
  theme,
  customUncheckedColor,
}: {
  theme: InternalTheme;
  customUncheckedColor?: string;
}) => {
  const {
    colors: { onSurfaceVariant },
  } = theme;

  if (customUncheckedColor) {
    return customUncheckedColor;
  }

  return onSurfaceVariant;
};

const getAndroidRippleColor = ({
  theme,
  checkedColor,
  disabled,
}: {
  theme: InternalTheme;
  checkedColor: string;
  disabled?: boolean;
}) => {
  const {
    colors: { onSurface },
  } = theme;

  if (disabled) {
    return color(onSurface).alpha(0.16).rgb().string();
  }

  return color(checkedColor).fade(0.32).rgb().string();
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
  const {
    colors: { onSurfaceDisabled },
  } = theme;

  if (disabled) {
    return onSurfaceDisabled;
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
  return {
    rippleColor: getAndroidRippleColor({ theme, checkedColor, disabled }),
    selectionControlColor: getAndroidControlColor({
      theme,
      disabled,
      checked,
      checkedColor,
      uncheckedColor,
    }),
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
  const {
    colors: { onSurfaceDisabled, primary },
  } = theme;

  if (disabled) {
    return onSurfaceDisabled;
  }

  if (customColor) {
    return customColor;
  }

  return primary;
};

const getIOSRippleColor = ({
  theme,
  checkedColor,
  disabled,
}: {
  theme: InternalTheme;
  checkedColor: string;
  disabled?: boolean;
}) => {
  const {
    colors: { onSurface },
  } = theme;

  if (disabled) {
    return color(onSurface).alpha(0.16).rgb().string();
  }
  return color(checkedColor).fade(0.32).rgb().string();
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
  return {
    checkedColor,
    rippleColor: getIOSRippleColor({
      theme,
      checkedColor,
      disabled,
    }),
  };
};
