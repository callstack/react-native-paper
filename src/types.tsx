import type * as React from 'react';

export type Font = {
  fontFamily: string;
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
    | '900';
};

export type Fonts = {
  regular: Font;
  medium: Font;
  light: Font;
  thin: Font;
};

type Mode = 'adaptive' | 'exact';

export type Material2Colors = {
  primary: string;
  background: string;
  surface: string;
  accent: string;
  error: string;
  text: string;
  onSurface: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
  notification: string;
};

export type MD3Color = {
  primary: string;
  'primary-container': string;
  secondary: string;
  'secondary-container': string;
  tertiary: string;
  'tertiary-container': string;
  surface: string;
  'surface-variant': string;
  background: string;
  error: string;
  'error-container': string;
  'on-primary': string;
  'on-primary-container': string;
  'on-secondary': string;
  'on-secondary-container': string;
  'on-tertiary': string;
  'on-tertiary-container': string;
  'on-surface': string;
  'on-surface-variant': string;
  'on-error': string;
  'on-error-container': string;
  'on-background': string;
  outline: string;
  shadow: string;
  'inverse-surface': string;
  'inverse-on-surface': string;
  'inverse-primary': string;
};

export type MD3Palette = {};

type SharedTheme = {
  dark: boolean;
  mode?: Mode;
  roundness: number;
  version?: 2 | 3;
  isV3?: boolean;
  fonts: Fonts;
  userDefinedThemeProperty: string;
  animation: {
    scale: number;
  };
};

export type Theme = AllXOR<[MD2Theme, MD3Theme]>;

export type MD2Theme = SharedTheme & {
  colors: Material2Colors;
};

export type MD3Theme = SharedTheme & {
  tokens: {
    md: {
      sys: {
        color: MD3Color;
        elevation: string[];
      };
      ref: {
        palette: MD3Palette;
        typeface: {
          'brand-regular': Font['fontFamily'];
          'weight-regular': Font['fontWeight'];
          'plain-medium': Font['fontFamily'];
          'weight-medium': Font['fontWeight'];
        };
        opacity: number[];
      };
    };
  };
  md?(tokenKey: MD3Token): string | number | object;
};

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type AllXOR<T extends any[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
  ? AllXOR<[XOR<A, B>, ...Rest]>
  : never;

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof Array<any>>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

export type MD3Token = Path<MD3Theme['tokens']>;

export type $Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type $RemoveChildren<T extends React.ComponentType<any>> = $Omit<
  React.ComponentPropsWithoutRef<T>,
  'children'
>;

export type EllipsizeProp = 'head' | 'middle' | 'tail' | 'clip';

declare global {
  namespace ReactNativePaper {
    interface ThemeFont {
      fontFamily: string;
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
        | '900';
    }
    interface ThemeFonts {
      regular: ThemeFont;
      medium: ThemeFont;
      light: ThemeFont;
      thin: ThemeFont;
    }
    interface ThemeColors {
      primary: string;
      background: string;
      surface: string;
      accent: string;
      error: string;
      text: string;
      onSurface: string;
      disabled: string;
      placeholder: string;
      backdrop: string;
      notification: string;
    }

    interface ThemeAnimation {
      scale: number;
    }
  }
}
