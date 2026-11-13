import { themeDefaults } from './base';
import { tokens } from '../tokens';
import { buildScheme } from '../tokens/sys/color';
import type { Theme } from '../types';

export const LightTheme: Theme = {
  ...themeDefaults,
  dark: false,
  colors: buildScheme(tokens.md.ref.palette, { mode: 'light' }),
};

export const MediumContrastLightTheme: Theme = {
  ...themeDefaults,
  dark: false,
  colors: buildScheme(tokens.md.ref.palette, {
    mode: 'light',
    contrast: 'medium',
  }),
};

export const HighContrastLightTheme: Theme = {
  ...themeDefaults,
  dark: false,
  colors: buildScheme(tokens.md.ref.palette, {
    mode: 'light',
    contrast: 'high',
  }),
};
