import { createTheming } from '@callstack/react-theme-provider';
import LightTheme from '../styles/themes/v2/LightTheme';
import type { ThemeExtended } from '../types';

export const { ThemeProvider, withTheme, useTheme } =
  createTheming<ThemeExtended>(LightTheme as ThemeExtended);
