import { Platform } from 'react-native';

import setColor from 'color';

import {
  grey400,
  grey800,
  grey50,
  grey700,
  white,
  black,
} from '../../styles/themes/v2/colors';
import type { InternalTheme } from '../../types';

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
  value?: boolean;
};

const getCheckedColor = ({
  theme,
  color,
}: {
  theme: InternalTheme;
  color?: string;
}) => {
  if (color) {
    return color;
  }

  if (theme.isV3) {
    return theme.colors.primary;
  }

  return theme.colors.accent;
};

const getThumbTintColor = ({
  theme,
  disabled,
  value,
  checkedColor,
}: BaseProps & { checkedColor: string }) => {
  const isIOS = Platform.OS === 'ios';

  if (isIOS) {
    return undefined;
  }

  if (disabled) {
    if (theme.dark) {
      return grey800;
    }
    return grey400;
  }

  if (value) {
    return checkedColor;
  }

  if (theme.dark) {
    return grey400;
  }
  return grey50;
};

const getOnTintColor = ({
  theme,
  disabled,
  value,
  checkedColor,
}: BaseProps & { checkedColor: string }) => {
  const isIOS = Platform.OS === 'ios';

  if (isIOS) {
    return checkedColor;
  }

  if (disabled) {
    if (theme.dark) {
      if (theme.isV3) {
        return setColor(white).alpha(0.06).rgb().string();
      }
      return setColor(white).alpha(0.1).rgb().string();
    }
    return setColor(black).alpha(0.12).rgb().string();
  }

  if (value) {
    return setColor(checkedColor).alpha(0.5).rgb().string();
  }

  if (theme.dark) {
    return grey700;
  }
  return 'rgb(178, 175, 177)';
};

export const getSwitchColor = ({
  theme,
  disabled,
  value,
  color,
}: BaseProps & { color?: string }) => {
  const checkedColor = getCheckedColor({ theme, color });

  return {
    onTintColor: getOnTintColor({ theme, disabled, value, checkedColor }),
    thumbTintColor: getThumbTintColor({ theme, disabled, value, checkedColor }),
    checkedColor,
  };
};
