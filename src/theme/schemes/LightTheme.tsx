import { baseTheme } from './base';
import { tokens } from '../tokens';
import { buildScheme } from '../tokens/sys/color/roles';
import { defaultState } from '../tokens/sys/state';
import type { Theme } from '../types';

export const LightTheme: Theme = {
  ...baseTheme,
  dark: false,
  colors: buildScheme(tokens.md.ref.palette, tokens.md.ref, { mode: 'light' }),
  state: defaultState,
};
