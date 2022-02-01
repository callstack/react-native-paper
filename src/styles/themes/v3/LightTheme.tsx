import configureFonts from '../../fonts';
import type { MD3ThemeBase } from '../../../types';
import { tokens } from './tokens';
import color from 'color';

const { palette } = tokens.md.ref;

const LightTheme: MD3ThemeBase = {
  dark: false,
  roundness: 4,
  version: 3,
  tokens: {
    ...tokens,
    md: {
      ...tokens.md,
      sys: {
        ...tokens.md.sys,
        color: {
          primary: palette.primary40,
          'primary-container': palette.primary90,
          secondary: palette.secondary40,
          'secondary-container': palette.secondary90,
          tertiary: palette.tertiary40,
          'tertiary-container': palette.tertiary90,
          surface: palette.neutral99,
          'surface-variant': palette['neutral-variant90'],
          'surface-disabled': color(palette.neutral10)
            .alpha(tokens.md.ref.opacity.level2)
            .rgb()
            .string(),
          background: palette.neutral99,
          error: palette.error40,
          'error-container': palette.error90,
          'on-primary': palette.primary100,
          'on-primary-container': palette.primary10,
          'on-secondary': palette.secondary100,
          'on-secondary-container': palette.secondary10,
          'on-tertiary': palette.tertiary100,
          'on-tertiary-container': palette.tertiary10,
          'on-surface': palette.neutral10,
          'on-surface-variant': palette['neutral-variant30'],
          'on-surface-disabled': color(palette.neutral10)
            .alpha(tokens.md.ref.opacity.level4)
            .rgb()
            .string(),
          'on-error': palette.error100,
          'on-error-container': palette.error10,
          'on-background': palette.neutral10,
          outline: palette['neutral-variant50'],
          shadow: palette.neutral0,
          'inverse-on-surface': palette.neutral20,
          'inverse-surface': palette.neutral95,
          'inverse-primary': palette.primary80,
        },
        elevation: [
          '0px 1px 3px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          '0px 2px 6px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px rgba(0, 0, 0, 0.15)',
          '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px rgba(0, 0, 0, 0.15)',
          '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px rgba(0, 0, 0, 0.15)',
        ],
      },
    },
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};

export default LightTheme;
