import configureFonts from '../../fonts';
import type { ThemeBase } from '../../../types';
import { tokens } from './tokens';
import color from 'color';

const { palette, opacity } = tokens.md.ref;

const LightTheme: ThemeBase = {
  dark: false,
  roundness: 4,
  version: 3,
  isV3: true,
  colors: {
    primary: palette.primary40,
    primaryContainer: palette.primary90,
    secondary: palette.secondary40,
    secondaryContainer: palette.secondary90,
    tertiary: palette.tertiary40,
    tertiaryContainer: palette.tertiary90,
    surface: palette.neutral99,
    surfaceVariant: palette.neutralVariant90,
    surfaceDisabled: color(palette.neutral10)
      .alpha(opacity.level2)
      .rgb()
      .string(),
    background: palette.neutral99,
    error: palette.error40,
    errorContainer: palette.error90,
    onPrimary: palette.primary100,
    onPrimaryContainer: palette.primary10,
    onSecondary: palette.secondary100,
    onSecondaryContainer: palette.secondary10,
    onTertiary: palette.tertiary100,
    onTertiaryContainer: palette.tertiary10,
    onSurface: palette.neutral10,
    onSurfaceVariant: palette.neutralVariant30,
    onSurfaceDisabled: color(palette.neutral10)
      .alpha(opacity.level4)
      .rgb()
      .string(),
    onError: palette.error100,
    onErrorContainer: palette.error10,
    onBackground: palette.neutral10,
    outline: palette.neutralVariant50,
    shadow: palette.neutral0,
    inverseOnSurface: palette.neutral20,
    inverseSurface: palette.neutral95,
    inversePrimary: palette.primary80,
    elevation: {
      level0: palette.primary99,
      // Hard-coded values assuming palette.primary99 is used as background for colors with opacity
      // Opaque rgba values cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue
      //
      // level1: color(palette.primary40).alpha(0.05).rgb().string(),
      // level2: color(palette.primary40).alpha(0.08).rgb().string(),
      // level3: color(palette.primary40).alpha(0.11).rgb().string(),
      // level4: color(palette.primary40).alpha(0.12).rgb().string(),
      // level5: color(palette.primary40).alpha(0.14).rgb().string(),
      level1: 'rgb(247, 243, 249)',
      level2: 'rgb(243, 237, 246)',
      level3: 'rgb(238, 232, 244)',
      level4: 'rgb(236, 230, 243)',
      level5: 'rgb(233, 227, 241)',
    },
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};

export default LightTheme;
