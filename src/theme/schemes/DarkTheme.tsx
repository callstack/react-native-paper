import { themeDefaults } from './base';
import { tokens } from '../tokens';
import { buildScheme } from '../tokens/sys/color/roles';
import { defaultShapes } from '../tokens/sys/shape';
import type { Theme } from '../types';

export const DarkTheme: Theme = {
  ...themeDefaults,
  dark: true,
  colors: buildScheme(tokens.md.ref.palette, tokens.md.ref, { mode: 'dark' }),
  shapes: defaultShapes,
};
