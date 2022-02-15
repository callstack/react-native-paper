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
    elevation: {
      level0: palette.primary0,
      // Hard-coded values assuming palette.primary99 is used as background for colors with opacity
      // Opaque rgba values cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue
      //
      // level1: color(palette.primary80).alpha(0.05).rgb().string(),
      // level2: color(palette.primary80).alpha(0.08).rgb().string(),
      // level3: color(palette.primary80).alpha(0.11).rgb().string(),
      // level4: color(palette.primary80).alpha(0.12).rgb().string(),
      // level5: color(palette.primary80).alpha(0.14).rgb().string(),
      level1: 'rgb(37, 35, 42)',
      level2: 'rgb(44, 40, 49)',
      level3: 'rgb(49, 44, 56)',
      level4: 'rgb(51, 46, 58)',
      level5: 'rgb(52, 49, 63)',
    },
    elevationShadows: {
      level0: ['', ''],
      level1: [
        '0px 1px 2px rgba(0, 0, 0, 0.3)',
        '0px 1px 3px rgba(0, 0, 0, 0.15)',
      ],
      level2: [
        '0px 1px 2px rgba(0, 0, 0, 0.3)',
        '0px 2px 6px rgba(0, 0, 0, 0.15)',
      ],
      level3: [
        '0px 1px 3px rgba(0, 0, 0, 0.3)',
        '0px 4px 8px rgba(0, 0, 0, 0.15)',
      ],
      level4: [
        '0px 2px 3px rgba(0, 0, 0, 0.3)',
        '0px 6px 10px rgba(0, 0, 0, 0.15)',
      ],
      level5: [
        '0px 4px 4px rgba(0, 0, 0, 0.3)',
        '0px 8px 12px rgba(0, 0, 0, 0.15)',
      ],
    },
  },
};

export default DarkTheme;
