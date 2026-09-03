import { createTheme } from './createTheme';
import type { ContrastLevel, Theme } from '../types';

export { DarkTheme as DynamicDarkTheme } from './DarkTheme';
export { LightTheme as DynamicLightTheme } from './LightTheme';

export const isDynamicColorSupported = false;

export const isDynamicColorSupportedAtContrast = (_contrast: ContrastLevel) =>
  false;

export const getDynamicTheme = (
  isDark: boolean,
  contrast: ContrastLevel = 'standard'
): Theme => createTheme({ dark: isDark, contrast });
