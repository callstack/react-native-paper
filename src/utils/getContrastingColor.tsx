import color from 'color';

export default function getContrastingColor(
  input: string,
  light: string,
  dark: string
): string {
  return color(input).isLight() ? dark : light;
}
