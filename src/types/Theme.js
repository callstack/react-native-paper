/* @flow */

export type Theme = {
  roundness: number;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    text: string;
    secondaryText: string;
    disabled: string;
    placeholder: string;
    icon: string;
  };
  fonts: {
    regular: string;
    medium: string;
    light: string;
    thin: string;
  }
};
