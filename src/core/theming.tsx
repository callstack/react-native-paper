import { createTheming } from '@callstack/react-theme-provider';
import type { Theme } from '../types';
import LightTheme from '../styles/themes/v2/LightTheme';

export const { ThemeProvider, withTheme, useTheme } = createTheming<Theme>(
  LightTheme as Theme
);
