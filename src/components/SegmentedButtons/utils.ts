import { StyleSheet, ViewStyle } from 'react-native';

import color from 'color';

import { black, white } from '../../styles/themes/v2/colors';
import type { Theme } from '../../types';

type BaseProps = {
  theme: Theme;
  disabled?: boolean;
  checked: boolean;
};

const DEFAULT_PADDING = 9;

export const getSegmentedButtonDensityPadding = ({
  density,
}: {
  density?: 'regular' | 'small' | 'medium' | 'high';
}) => {
  let padding = DEFAULT_PADDING;

  switch (density) {
    case 'small':
      return padding - 2;
    case 'medium':
      return padding - 4;
    case 'high':
      return padding - 8;
    default:
      return padding;
  }
};

export const getDisabledSegmentedButtonStyle = ({
  theme,
  index,
  buttons,
}: {
  theme: Theme;
  buttons: { disabled?: boolean }[];
  index: number;
}): ViewStyle => {
  const width = getSegmentedButtonBorderWidth({ theme });
  const isDisabled = buttons[index]?.disabled;
  const isNextDisabled = buttons[index + 1]?.disabled;

  if (!isDisabled && isNextDisabled) {
    return {
      borderRightWidth: width,
    };
  }
  return {};
};

export const getSegmentedButtonBorderRadius = ({
  segment,
  theme,
}: {
  theme: Theme;
  segment?: 'first' | 'last';
}): ViewStyle => {
  if (segment === 'first') {
    return {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      ...(theme.isV3 && { borderRightWidth: 0 }),
    };
  } else if (segment === 'last') {
    return {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    };
  } else {
    return {
      borderRadius: 0,
      ...(theme.isV3 && { borderRightWidth: 0 }),
    };
  }
};

const getSegmentedButtonBackgroundColor = ({ checked, theme }: BaseProps) => {
  if (checked) {
    if (theme.isV3) {
      return theme.colors.secondaryContainer;
    } else {
      return color(theme.colors.primary).alpha(0.12).rgb().string();
    }
  }
  return 'transparent';
};

const getSegmentedButtonBorderColor = ({
  theme,
  disabled,
  checked,
}: BaseProps) => {
  if (theme.isV3) {
    if (disabled) {
      return theme.colors.surfaceDisabled;
    }
    return theme.colors.outline;
  }
  if (checked) {
    return theme.colors.primary;
  }

  return color(theme.dark ? white : black)
    .alpha(0.29)
    .rgb()
    .string();
};

const getSegmentedButtonBorderWidth = ({
  theme,
}: Omit<BaseProps, 'disabled' | 'checked'>) => {
  if (theme.isV3) {
    return 1;
  }

  return StyleSheet.hairlineWidth;
};

const getSegmentedButtonTextColor = ({
  theme,
  disabled,
}: Omit<BaseProps, 'checked'>) => {
  if (theme.isV3) {
    if (disabled) {
      return theme.colors.onSurfaceDisabled;
    }
    return theme.colors.onSurface;
  } else {
    if (disabled) {
      return theme.colors.disabled;
    }
    return theme.colors.primary;
  }
};

export const getSegmentedButtonColors = ({
  theme,
  disabled,
  checked,
}: BaseProps) => {
  const backgroundColor = getSegmentedButtonBackgroundColor({
    theme,
    checked,
  });
  const borderColor = getSegmentedButtonBorderColor({
    theme,
    disabled,
    checked,
  });
  const textColor = getSegmentedButtonTextColor({ theme, disabled });
  const borderWidth = getSegmentedButtonBorderWidth({ theme });

  return { backgroundColor, borderColor, textColor, borderWidth };
};
