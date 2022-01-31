import { createTheming } from '@callstack/react-theme-provider';
import LightTheme from '../styles/themes/v2/LightTheme';

export const { ThemeProvider, withTheme, useTheme } =
  createTheming<ReactNativePaper.Theme>(LightTheme as ReactNativePaper.Theme);
