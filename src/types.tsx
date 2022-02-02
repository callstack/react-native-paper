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

  [key: string]: string;
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
  'surface-disabled': string;
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
  'on-surface-disabled': string;
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
  fonts: Fonts;
  animation: {
    scale: number;
  };
};

export type Theme = ThemeBase & ThemeExtended;

export type ThemeBase = AllXOR<[MD2ThemeBase, MD3ThemeBase]>;

export type ThemeExtended = AllXOR<[MD2ThemeExtended, MD3ThemeExtended]>;

// MD2 types
export type MD2ThemeBase = SharedTheme & {
  version: 2;
  colors: Material2Colors;
};

export type MD2ThemeExtended = MD2ThemeBase & {
  isV3: false;
  md(): void;
};

// MD3 types
export enum MD3TypescaleKey {
  'display-large' = 'display-large',
  'display-medium' = 'display-medium',
  'display-small' = 'display-small',

  'headline-large' = 'headline-large',
  'headline-medium' = 'headline-medium',
  'headline-small' = 'headline-small',

  'title-large' = 'title-large',
  'title-medium' = 'title-medium',
  'title-small' = 'title-small',

  'label-large' = 'label-large',
  'label-medium' = 'label-medium',
  'label-small' = 'label-small',

  'body-large' = 'body-large',
  'body-medium' = 'body-medium',
  'body-small' = 'body-small',
}

export type MD3Typescale = {
  font: string;
  tracking: number;
  weight: Font['fontWeight'];
  'line-height': number;
  size: number;
};

export type MD3ThemeBase = SharedTheme & {
  version: 3;
  tokens: {
    md: {
      sys: {
        color: MD3Color;
        elevation: string[];
        typescale: {
          [key in MD3TypescaleKey]: MD3Typescale;
        };
      };
      ref: {
        palette: MD3Palette;
        typeface: {
          'brand-regular': Font['fontFamily'];
          'weight-regular': Font['fontWeight'];
          'plain-medium': Font['fontFamily'];
          'weight-medium': Font['fontWeight'];
        };
        opacity: {
          level1: number;
          level2: number;
          level3: number;
          level4: number;
        };
      };
    };
  };
};

export type MD3ThemeExtended = MD3ThemeBase & {
  isV3: true;
  md(tokenKey: MD3Token): string | number | object;
};

export type MD3Token = Path<MD3ThemeBase['tokens']>;

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
