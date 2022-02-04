import LightTheme from './LightTheme';
import type { MD3ThemeBase } from '../../../types';
import { tokens } from './tokens';
import color from 'color';

const { palette } = tokens.md.ref;

const DarkTheme: MD3ThemeBase = {
  ...LightTheme,
  dark: true,
  mode: 'adaptive',
  version: 3,
  colors: {
    primary: palette.primary80,
    'primary-container': palette.primary30,
    secondary: palette.secondary80,
    'secondary-container': palette.secondary30,
    tertiary: palette.tertiary80,
    'tertiary-container': palette.tertiary30,
    surface: palette.neutral10,
    'surface-variant': palette['neutral-variant30'],
    'surface-disabled': color(palette.neutral90)
      .alpha(tokens.md.ref.opacity.level2)
      .rgb()
      .string(),
    background: palette.neutral10,
    error: palette.error80,
    'error-container': palette.error30,
    'on-primary': palette.primary20,
    'on-primary-container': palette.primary90,
    'on-secondary': palette.secondary20,
    'on-secondary-container': palette.secondary90,
    'on-tertiary': palette.tertiary20,
    'on-tertiary-container': palette.tertiary90,
    'on-surface': palette.neutral90,
    'on-surface-variant': palette['neutral-variant80'],
    'on-surface-disabled': palette.neutral90,
    'on-error': palette.error20,
    'on-error-container': palette.error80,
    'on-background': palette.neutral90,
    outline: palette['neutral-variant60'],
    shadow: palette.neutral0,
    'inverse-on-surface': palette.neutral90,
    'inverse-surface': palette.neutral20,
    'inverse-primary': palette.primary40,
  },
};

export default DarkTheme;
