/* @flow */

import * as React from 'react';

export type ThemeColors = {
  primary: string,
  background: string,
  surface: string,
  accent: string,
  error: string,
  text: string,
  disabled: string,
  placeholder: string,
  backdrop: string,
};

export type ThemeFonts = {
  regular: string,
  medium: string,
  light: string,
  thin: string,
};

export type Theme = {
  dark: boolean,
  roundness: number,
  colors: ThemeColors,
  fonts: ThemeFonts,
};

export type ThemeShape = $Shape<{
  ...Theme,
  colors: $Shape<$PropertyType<Theme, 'colors'>>,
  fonts: $Shape<$PropertyType<Theme, 'fonts'>>,
}>;

export type $RemoveChildren<T> = $Diff<
  React.ElementConfig<T>,
  { children: any }
>;
