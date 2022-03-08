import color from 'color';
import type { Theme } from '../../types';
import { black, white } from '../../styles/themes/v2/colors';
import type { ColorValue } from 'react-native';

export const getChipColors = ({
  selectedColor,
  customBackgroundColor,
  theme,
  isOutlined,
  disabled,
}: {
  selectedColor?: string;
  customBackgroundColor?: ColorValue;
  theme: Theme;
  isOutlined: boolean;
  disabled?: boolean;
}) => {
  let borderColor;
  let textColor;
  let iconColor;
  let underlayColor;
  let backgroundColor;
  let defaultBackgroundColor;

  const { isV3, dark } = theme;

  if (isV3) {
    defaultBackgroundColor = isOutlined
      ? theme.colors.surface
      : theme.colors.secondaryContainer;
  } else {
    defaultBackgroundColor = isOutlined
      ? theme.colors?.surface
      : dark
      ? '#383838'
      : '#ebebeb';
  }

  backgroundColor =
    typeof customBackgroundColor === 'string'
      ? customBackgroundColor
      : defaultBackgroundColor;

  const selectedBackgroundColor = (
    dark
      ? color(backgroundColor).lighten(isOutlined ? 0.2 : 0.4)
      : color(backgroundColor).darken(isOutlined ? 0.08 : 0.2)
  )
    .rgb()
    .string();

  if (isV3) {
    if (disabled) {
      const customDisabledColor = color(theme.colors.onSurfaceVariant)
        .alpha(0.12)
        .rgb()
        .string();
      borderColor = customDisabledColor;
      textColor = iconColor = theme.colors.onSurfaceDisabled;
      backgroundColor = isOutlined ? 'transparent' : customDisabledColor;
    } else {
      borderColor = theme.colors.outline;
      textColor = iconColor = isOutlined
        ? theme.colors.onSurfaceVariant
        : theme.colors.onSecondaryContainer;
      underlayColor = color(textColor).alpha(0.12).rgb().string();
    }
  } else {
    borderColor = isOutlined
      ? color(
          selectedColor !== undefined
            ? selectedColor
            : color(dark ? white : black)
        )
          .alpha(0.29)
          .rgb()
          .string()
      : backgroundColor;
    if (disabled) {
      textColor = theme.colors.disabled;
      iconColor = theme.colors.disabled;
    } else {
      const customTextColor =
        selectedColor !== undefined ? selectedColor : theme.colors.text;
      textColor = color(customTextColor).alpha(0.87).rgb().string();
      iconColor = color(customTextColor).alpha(0.54).rgb().string();
      underlayColor = selectedColor
        ? color(selectedColor).fade(0.5).rgb().string()
        : selectedBackgroundColor;
    }
  }

  return {
    borderColor,
    textColor,
    iconColor,
    underlayColor,
    backgroundColor,
    selectedBackgroundColor,
  };
};
