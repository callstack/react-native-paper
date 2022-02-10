import type { $DeepPartial } from '@callstack/react-theme-provider';
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

export type MD2Colors = {
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

export type MD3Colors = {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  surface: string;
  surfaceVariant: string;
  surfaceDisabled: string;
  background: string;
  error: string;
  errorContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  onTertiary: string;
  onTertiaryContainer: string;
  onSurface: string;
  onSurfaceVariant: string;
  onSurfaceDisabled: string;
  onError: string;
  onErrorContainer: string;
  onBackground: string;
  outline: string;
  shadow: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
};

export type MD3Palette = {};

export type ThemeProp = $DeepPartial<Theme>;

export type ThemeBase = {
  dark: boolean;
  mode?: Mode;
  roundness: number;
  fonts: Fonts;
  animation: {
    scale: number;
  };
} & (
  | { version: 2; colors: MD2Colors; isV3: false }
  | { version: 3; colors: MD3Colors; isV3: true }
);

export type Theme = ThemeBase & {
  typescale: MD3Typescale;
};

// MD3 types
export enum MD3TypescaleKey {
  displayLarge = 'displayLarge',
  displayMedium = 'displayMedium',
  displaySmall = 'displaySmall',

  headlineLarge = 'headlineLarge',
  headlineMedium = 'headlineMedium',
  headlineSmall = 'headlineSmall',

  titleLarge = 'titleLarge',
  titleMedium = 'titleMedium',
  titleSmall = 'titleSmall',

  labelLarge = 'labelLarge',
  labelMedium = 'labelMedium',
  labelSmall = 'labelSmall',

  bodyLarge = 'bodyLarge',
  bodyMedium = 'bodyMedium',
  bodySmall = 'bodySmall',
}

export type MD3Type = {
  font: string;
  tracking: number;
  weight: Font['fontWeight'];
  lineHeight: number;
  size: number;
};

export type MD3Typescale = {
  [key in MD3TypescaleKey]: MD3Type;
};

export type MD3Tokens = {
  md: {
    sys: {
      color: MD3Colors;
      typescale: MD3Typescale;
    };
    ref: {
      palette: MD3Palette;
      typeface: {
        brandRegular: Font['fontFamily'];
        weightRegular: Font['fontWeight'];
        plainMedium: Font['fontFamily'];
        weightMedium: Font['fontWeight'];
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
