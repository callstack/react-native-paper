import type { ColorValue } from 'react-native';

import type { ElevationColors } from './elevation';

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
  /** Pre-computed state layer color at press opacity (0.10).
   *  Used for ripple effects. Avoids runtime alpha manipulation
   *  which is incompatible with PlatformColor on Android.
   *  TODO: revisit after https://github.com/facebook/react-native/pull/56395
   *  @see https://m3.material.io/foundations/interaction/states/state-layers */
  stateLayerPressed: ColorValue;
  elevation: ElevationColors;
};
