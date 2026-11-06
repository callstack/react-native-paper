import type { ColorValue } from 'react-native';

import type { ElevationColors } from './elevation';

export type ColorRole = {
  [K in keyof ThemeColors]: ThemeColors[K] extends ColorValue ? K : never;
}[keyof ThemeColors];

export type ThemeColors = {
  primary: ColorValue;
  primaryContainer: ColorValue;
  secondary: ColorValue;
  secondaryContainer: ColorValue;
  tertiary: ColorValue;
  tertiaryContainer: ColorValue;
  surface: ColorValue;
  surfaceDim: ColorValue;
  surfaceBright: ColorValue;
  surfaceContainerLowest: ColorValue;
  surfaceContainerLow: ColorValue;
  surfaceContainer: ColorValue;
  surfaceContainerHigh: ColorValue;
  surfaceContainerHighest: ColorValue;
  surfaceVariant: ColorValue;
  background: ColorValue;
  error: ColorValue;
  errorContainer: ColorValue;
  onPrimary: ColorValue;
  onPrimaryContainer: ColorValue;
  onSecondary: ColorValue;
  onSecondaryContainer: ColorValue;
  onTertiary: ColorValue;
  onTertiaryContainer: ColorValue;
  onSurface: ColorValue;
  onSurfaceVariant: ColorValue;
  onError: ColorValue;
  onErrorContainer: ColorValue;
  onBackground: ColorValue;
  outline: ColorValue;
  outlineVariant: ColorValue;
  inverseSurface: ColorValue;
  inverseOnSurface: ColorValue;
  inversePrimary: ColorValue;
  primaryFixed: ColorValue;
  primaryFixedDim: ColorValue;
  onPrimaryFixed: ColorValue;
  onPrimaryFixedVariant: ColorValue;
  secondaryFixed: ColorValue;
  secondaryFixedDim: ColorValue;
  onSecondaryFixed: ColorValue;
  onSecondaryFixedVariant: ColorValue;
  tertiaryFixed: ColorValue;
  tertiaryFixedDim: ColorValue;
  onTertiaryFixed: ColorValue;
  onTertiaryFixedVariant: ColorValue;
  shadow: ColorValue;
  scrim: ColorValue;
  elevation: ElevationColors;
};
