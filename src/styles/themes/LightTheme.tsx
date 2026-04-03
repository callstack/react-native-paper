import color from 'color';

import { tokens } from './tokens';
import type { MD3Theme } from '../../types';
import configureFonts from '../fonts';

const { palette, stateOpacity } = tokens.md.ref;

export const MD3LightTheme: MD3Theme = {
  dark: false,
  roundness: 4,
  colors: {
    primary: palette.primary40,
    primaryContainer: palette.primary90,
    secondary: palette.secondary40,
    secondaryContainer: palette.secondary90,
    tertiary: palette.tertiary40,
    tertiaryContainer: palette.tertiary90,
    surface: palette.neutral98,
    surfaceDim: palette.neutral87,
    surfaceBright: palette.neutral98,
    surfaceContainerLowest: palette.neutral100,
    surfaceContainerLow: palette.neutral96,
    surfaceContainer: palette.neutral94,
    surfaceContainerHigh: palette.neutral92,
    surfaceContainerHighest: palette.neutral90,
    surfaceVariant: palette.neutralVariant90,
    background: palette.neutral98,
    error: palette.error40,
    errorContainer: palette.error90,
    onPrimary: palette.primary100,
    onPrimaryContainer: palette.primary30,
    onSecondary: palette.secondary100,
    onSecondaryContainer: palette.secondary30,
    onTertiary: palette.tertiary100,
    onTertiaryContainer: palette.tertiary30,
    onSurface: palette.neutral10,
    onSurfaceVariant: palette.neutralVariant30,
    onError: palette.error100,
    onErrorContainer: palette.error30,
    onBackground: palette.neutral10,
    outline: palette.neutralVariant50,
    outlineVariant: palette.neutralVariant80,
    inverseSurface: palette.neutral20,
    inverseOnSurface: palette.neutral95,
    inversePrimary: palette.primary80,
    primaryFixed: palette.primary90,
    primaryFixedDim: palette.primary80,
    onPrimaryFixed: palette.primary10,
    onPrimaryFixedVariant: palette.primary30,
    secondaryFixed: palette.secondary90,
    secondaryFixedDim: palette.secondary80,
    onSecondaryFixed: palette.secondary10,
    onSecondaryFixedVariant: palette.secondary30,
    tertiaryFixed: palette.tertiary90,
    tertiaryFixedDim: palette.tertiary80,
    onTertiaryFixed: palette.tertiary10,
    onTertiaryFixedVariant: palette.tertiary30,
    shadow: palette.neutral0,
    scrim: palette.neutral0,
    stateLayerPressed: color(palette.neutral10)
      .alpha(stateOpacity.pressed)
      .rgb()
      .string(),
    elevation: {
      level0: 'transparent',
      level1: palette.neutral100,
      level2: palette.neutral96,
      level3: palette.neutral94,
      level4: palette.neutral92,
      level5: palette.neutral90,
    },
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};
