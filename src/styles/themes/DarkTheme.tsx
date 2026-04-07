import color from 'color';

import { LightTheme } from './LightTheme';
import { tokens } from './tokens';
import type { Theme } from '../../types';

const { palette, stateOpacity } = tokens.md.ref;

export const DarkTheme: Theme = {
  ...LightTheme,
  dark: true,
  colors: {
    primary: palette.primary80,
    primaryContainer: palette.primary30,
    secondary: palette.secondary80,
    secondaryContainer: palette.secondary30,
    tertiary: palette.tertiary80,
    tertiaryContainer: palette.tertiary30,
    surface: palette.neutral6,
    surfaceDim: palette.neutral6,
    surfaceBright: palette.neutral24,
    surfaceContainerLowest: palette.neutral4,
    surfaceContainerLow: palette.neutral10,
    surfaceContainer: palette.neutral12,
    surfaceContainerHigh: palette.neutral17,
    surfaceContainerHighest: palette.neutral22,
    surfaceVariant: palette.neutralVariant30,
    background: palette.neutral6,
    error: palette.error80,
    errorContainer: palette.error30,
    onPrimary: palette.primary20,
    onPrimaryContainer: palette.primary90,
    onSecondary: palette.secondary20,
    onSecondaryContainer: palette.secondary90,
    onTertiary: palette.tertiary20,
    onTertiaryContainer: palette.tertiary90,
    onSurface: palette.neutral90,
    onSurfaceVariant: palette.neutralVariant80,
    onError: palette.error20,
    onErrorContainer: palette.error90,
    onBackground: palette.neutral90,
    outline: palette.neutralVariant60,
    outlineVariant: palette.neutralVariant30,
    inverseSurface: palette.neutral90,
    inverseOnSurface: palette.neutral20,
    inversePrimary: palette.primary40,
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
    stateLayerPressed: color(palette.neutral90)
      .alpha(stateOpacity.pressed)
      .rgb()
      .string(),
    elevation: {
      level0: 'transparent',
      level1: palette.neutral4,
      level2: palette.neutral10,
      level3: palette.neutral12,
      level4: palette.neutral17,
      level5: palette.neutral22,
    },
  },
};
