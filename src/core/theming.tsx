import { createTheming } from '@callstack/react-theme-provider';
import DefaultTheme from '../styles/themes/v2/LightTheme';

export const { ThemeProvider, withTheme, useTheme } = createTheming<
  ReactNativePaper.Theme
>(DefaultTheme as ReactNativePaper.Theme);
