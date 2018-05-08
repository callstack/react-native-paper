/* @flow */

export type Theme = {
  dark: boolean,
  roundness: number,
  colors: {
    primary: string,
    background: string,
    paper: string,
    accent: string,
    error: string,
    text: string,
    disabled: string,
    placeholder: string,
  },
  fonts: {
    regular: string,
    medium: string,
    light: string,
    thin: string,
  },
};

export type ThemeShape = $Shape<{
  ...Theme,
  colors: $Shape<$PropertyType<Theme, 'colors'>>,
  fonts: $Shape<$PropertyType<Theme, 'fonts'>>,
}>;
