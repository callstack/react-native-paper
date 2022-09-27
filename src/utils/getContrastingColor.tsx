import type { ColorValue } from 'react-native';

import color from 'color';

export default function getContrastingColor(
  input: ColorValue,
  light: string,
  dark: string
): string {
  if (typeof input === 'string') {
    return color(input).isLight() ? dark : light;
  }

  return light;
}
