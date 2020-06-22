import * as React from 'react';

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

type Colors = {
  primary: string;
  background: string;
  surface: string;
  accent: string;
  error: string;
  text: string;
  onSurface: string;
  onBackground: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
  notification: string;
};

type Mode = 'adaptive' | 'exact';

type Animation = {
  scale: number;
};

export type Theme = {
  dark: boolean;
  mode?: Mode;
  roundness: number;
  colors: Colors;
  fonts: Fonts;
  animation: Animation;
};

export type $Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type $RemoveChildren<T extends React.ComponentType<any>> = $Omit<
  React.ComponentPropsWithoutRef<T>,
  'children'
>;

export type EllipsizeProp = 'head' | 'middle' | 'tail' | 'clip';

declare global {
  namespace ReactNativePaper {
    interface Theme {
      dark: boolean;
      mode?: Mode;
      roundness: number;
      colors: Colors;
      fonts: Fonts;
      animation: Animation;
    }
  }
}
