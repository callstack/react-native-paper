import { StyleSheet, ViewStyle } from 'react-native';
import color from 'color';
import type { Theme } from '../../types';
import { black, white } from '../../styles/themes/v2/colors';

type BaseProps = {
  theme: Theme;
  disabled?: boolean;
  checked: boolean;
};

export const getDisabledSegmentedButtonStyle = ({
  theme,
  index,
  children,
}: {
  theme: Theme;
  children: React.ReactElement<{ disabled?: boolean }>[];
  index: number;
}): ViewStyle => {
  const width = getSegmentedButtonBorderWidth({ theme });
  const isDisabled = children[index]?.props.disabled;
  const isNextDisabled = children[index + 1]?.props.disabled;

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
