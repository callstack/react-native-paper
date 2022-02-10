import configureFonts from '../../fonts';
import type { ThemeBase } from '../../../types';
import { tokens } from './tokens';
import color from 'color';

const { palette } = tokens.md.ref;

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
      .alpha(tokens.md.ref.opacity.level2)
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
      .alpha(tokens.md.ref.opacity.level4)
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
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};

export default LightTheme;
