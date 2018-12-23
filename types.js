/**
 * This file is only for backwards compatibility
 * Import the Theme type from the main entry point instead
 *
 * @flow
 */

import type {
  Theme as _Theme,
  ThemeColors as _ThemeColors,
  ThemeFonts as _ThemeFonts,
} from './src/types';

export type Theme = _Theme;
export type ThemeColors = _ThemeColors;
export type ThemeFonts = _ThemeFonts;
