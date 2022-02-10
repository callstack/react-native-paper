import LightTheme from './LightTheme';
import type { ThemeBase } from '../../../types';
import { tokens } from './tokens';
import color from 'color';

const { palette } = tokens.md.ref;

const DarkTheme: ThemeBase = {
  ...LightTheme,
  dark: true,
  mode: 'adaptive',
  version: 3,
  isV3: true,
  colors: {
    primary: palette.primary80,
    primaryContainer: palette.primary30,
    secondary: palette.secondary80,
    secondaryContainer: palette.secondary30,
    tertiary: palette.tertiary80,
    tertiaryContainer: palette.tertiary30,
    surface: palette.neutral10,
    surfaceVariant: palette.neutralVariant30,
    surfaceDisabled: color(palette.neutral90)
      .alpha(tokens.md.ref.opacity.level2)
      .rgb()
      .string(),
    background: palette.neutral10,
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
    onSurfaceDisabled: palette.neutral90,
    onError: palette.error20,
    onErrorContainer: palette.error80,
    onBackground: palette.neutral90,
    outline: palette.neutralVariant60,
    shadow: palette.neutral0,
    inverseOnSurface: palette.neutral90,
    inverseSurface: palette.neutral20,
    inversePrimary: palette.primary40,
  },
};

export default DarkTheme;
