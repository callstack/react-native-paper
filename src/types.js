/* @flow */

import * as React from 'react';

export type Font = {
  fontFamily: string,
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900',
};

export type Theme = {
  dark: boolean,
  roundness: number,
  colors: {
    primary: string,
    background: string,
    surface: string,
    accent: string,
    error: string,
    text: string,
    disabled: string,
    placeholder: string,
    backdrop: string,
    notification: string,
  },
  fonts: {
    regular: Font,
    medium: Font,
    light: Font,
    thin: Font,
  },
  animation: {
    scale: number,
  },
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
