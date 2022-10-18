import type * as React from 'react';

import type { $DeepPartial } from '@callstack/react-theme-provider';

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
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;
  scrim: string;
  backdrop: string;
  elevation: MD3ElevationColors;
};

export type MD3AndroidColors = {
  primary: number;
  primaryContainer: number;
  secondary: number;
  secondaryContainer: number;
  tertiary: number;
  tertiaryContainer: number;
  surface: number;
  surfaceVariant: number;
  background: number;
  error: number;
  errorContainer: number;
  onPrimary: number;
  onPrimaryContainer: number;
  onSecondary: number;
  onSecondaryContainer: number;
  onTertiary: number;
  onTertiaryContainer: number;
  onSurface: number;
  onSurfaceVariant: number;
  onError: number;
  onErrorContainer: number;
  onBackground: number;
  outline: number;
  outlineVariant: number;
  inverseSurface: number;
  inverseOnSurface: number;
  inversePrimary: number;
  shadow: number;
  scrim: number;
};

export type MD3Palette = {};

export type ThemeProp = $DeepPartial<InternalTheme>;

export type ThemeBase = {
  dark: boolean;
  mode?: Mode;
  roundness: number;
  animation: {
    scale: number;
  };
};

export type MD3Theme = ThemeBase & {
  version: 3;
  isV3: true;
  colors: MD3Colors;
  fonts: MD3Typescale;
};

export type MD2Theme = ThemeBase & {
  version: 2;
  isV3: false;
  colors: MD2Colors;
  fonts: Fonts;
};

export type InternalTheme = MD2Theme | MD3Theme;

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
  fontFamily: string;
  letterSpacing: number;
  fontWeight: Font['fontWeight'];
  lineHeight: number;
  fontSize: number;
};

export type MD3Typescale = {
  [key in MD3TypescaleKey]: MD3Type;
};

export type MD3Elevation = 0 | 1 | 2 | 3 | 4 | 5;

export enum ElevationLevels {
  'level0',
  'level1',
  'level2',
  'level3',
  'level4',
  'level5',
}

export type MD3ElevationColors = {
  [key in keyof typeof ElevationLevels]: string;
};

export type $Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type $RemoveChildren<T extends React.ComponentType<any>> = $Omit<
  React.ComponentPropsWithoutRef<T>,
  'children'
>;

export type EllipsizeProp = 'head' | 'middle' | 'tail' | 'clip';

export type NavigationTheme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
};
