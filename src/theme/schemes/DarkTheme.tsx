import { themeDefaults } from './base';
import { tokens } from '../tokens';
import { buildScheme } from '../tokens/sys/color';
import type { Theme } from '../types';

export const DarkTheme: Theme = {
  ...themeDefaults,
  dark: true,
  colors: buildScheme(tokens.md.ref.palette, { mode: 'dark' }),
};

export const MediumContrastDarkTheme: Theme = {
  ...themeDefaults,
  dark: true,
  colors: buildScheme(tokens.md.ref.palette, {
    mode: 'dark',
    contrast: 'medium',
  }),
};

export const HighContrastDarkTheme: Theme = {
  ...themeDefaults,
  dark: true,
  colors: buildScheme(tokens.md.ref.palette, {
    mode: 'dark',
    contrast: 'high',
  }),
};
