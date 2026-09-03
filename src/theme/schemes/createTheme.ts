import { themeDefaults } from './base';
import { tokens } from '../tokens';
import { buildScheme } from '../tokens/sys/color';
import type { ContrastLevel, Theme } from '../types';

export type CreateThemeOptions = {
  dark?: boolean;
  contrast?: ContrastLevel;
};

/**
 * Builds a theme for a given color scheme and contrast level.
 *
 * Prefer the `contrast` prop on `PaperProvider` over calling this directly,
 * because passing a `theme` object turns off automatic system dark mode.
 */
export const createTheme = ({
  dark = false,
  contrast = 'standard',
}: CreateThemeOptions = {}): Theme => ({
  ...themeDefaults,
  dark,
  contrast,
  colors: buildScheme(tokens.md.ref.palette, {
    mode: dark ? 'dark' : 'light',
    contrast,
  }),
});
