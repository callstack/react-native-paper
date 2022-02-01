import LightTheme from './LightTheme';
import type { MD3ThemeBase } from '../../../types';
import { tokens } from './tokens';

const { palette } = tokens.md.ref;

const DarkTheme: MD3ThemeBase = {
  ...LightTheme,
  dark: true,
  mode: 'adaptive',
  version: 3,
  tokens: {
    ...tokens,
    md: {
      ...tokens.md,
      sys: {
        ...tokens.md.sys,
        color: {
          primary: palette.primary80,
          'primary-container': palette.primary30,
          secondary: palette.secondary80,
          'secondary-container': palette.secondary30,
          tertiary: palette.tertiary80,
          'tertiary-container': palette.tertiary30,
          surface: palette.neutral10,
          'surface-variant': palette['neutral-variant30'],
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
          'on-error': palette.error20,
          'on-error-container': palette.error80,
          'on-background': palette.neutral90,
          outline: palette['neutral-variant60'],
          shadow: palette.neutral0,
          'inverse-on-surface': palette.neutral90,
          'inverse-surface': palette.neutral20,
          'inverse-primary': palette.primary40,
        },

        elevation: [
          '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.15)',
          '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px rgba(0, 0, 0, 0.15)',
          '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px rgba(0, 0, 0, 0.15)',
          '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px rgba(0, 0, 0, 0.15)',
          '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px rgba(0, 0, 0, 0.15)',
        ],
      },
    },
  },
};

export default DarkTheme;
