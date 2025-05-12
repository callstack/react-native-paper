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
  const {
    colors: { primary },
  } = theme;

  if (color) {
    return color;
  }

  return primary;
};

const getThumbTintColor = ({
  theme,
  disabled,
  value,
  checkedColor,
}: BaseProps & { checkedColor: string }) => {
  const { dark } = theme;
  const isIOS = Platform.OS === 'ios';

  if (isIOS) {
    return undefined;
  }

  if (disabled) {
    if (dark) {
      return grey800;
    }
    return grey400;
  }

  if (value) {
    return checkedColor;
  }

  if (dark) {
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
  const { dark } = theme;

  const isIOS = Platform.OS === 'ios';

  if (isIOS) {
    return checkedColor;
  }

  if (disabled) {
    if (dark) {
      return setColor(white).alpha(0.06).rgb().string();
    }
    return setColor(black).alpha(0.12).rgb().string();
  }

  if (value) {
    return setColor(checkedColor).alpha(0.5).rgb().string();
  }

  if (dark) {
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
