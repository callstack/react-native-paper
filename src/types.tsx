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
  fontStyle?: 'normal' | 'italic' | undefined;
};

export type Colors = {
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
  elevation: ElevationColors;
};

export type ThemeProp = $DeepPartial<InternalTheme>;

export type ThemeBase = {
  dark: boolean;
  roundness: number;
  animation: {
    scale: number;
    defaultAnimationDuration?: number;
  };
};

export type Theme = ThemeBase & {
  colors: Colors;
  fonts: Typescale;
};

export type InternalTheme = Theme;

export enum TypescaleKey {
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

export type TypescaleConfig = {
  fontFamily: string;
  letterSpacing: number;
  fontWeight: Font['fontWeight'];
  lineHeight: number;
  fontSize: number;
  fontStyle?: Font['fontStyle'];
};

export type Typescale =
  | {
      [key in TypescaleKey]: TypescaleConfig;
    } & {
      ['default']: Omit<TypescaleConfig, 'lineHeight' | 'fontSize'>;
    };

export type Elevation = 0 | 1 | 2 | 3 | 4 | 5;

export enum ElevationLevels {
  'level0',
  'level1',
  'level2',
  'level3',
  'level4',
  'level5',
}

export type ElevationColors = {
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
