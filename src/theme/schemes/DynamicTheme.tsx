import type { ThemeColors } from '../types/color';

export { DarkTheme as DynamicDarkTheme } from './DarkTheme';
export { LightTheme as DynamicLightTheme } from './LightTheme';

export const isDynamicColorSupported = false;
export const lightDynamicColors: Partial<ThemeColors> = {};
export const darkDynamicColors: Partial<ThemeColors> = {};
