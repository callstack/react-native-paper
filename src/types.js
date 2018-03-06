/* @flow */

export type Theme = {
  dark: boolean,
  roundness: number,
  colors: {
    primary: string,
    background: string,
    paper: string,
    accent: string,
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
