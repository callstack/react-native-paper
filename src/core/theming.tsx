import { createTheming } from '@callstack/react-theme-provider';
import LightTheme from '../styles/themes/v2/LightTheme';
import type { Theme } from '../types';

export const { ThemeProvider, withTheme, useTheme } = createTheming<Theme>(
  LightTheme as Theme
);
