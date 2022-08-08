import { createTheming } from '@callstack/react-theme-provider';
import type { Theme } from 'src/types';
import {
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from '../styles/themes';

export const DefaultTheme = MD3LightTheme;

export const { ThemeProvider, withTheme, useTheme } = createTheming<Theme>(
  DefaultTheme as ReactNativePaper.Theme
);

export const defaultThemesByVersion = {
  2: {
    light: MD2LightTheme,
    dark: MD2DarkTheme,
  },
  3: {
    light: MD3LightTheme,
    dark: MD3DarkTheme,
  },
};

export const getTheme = (isDark = false, isV3 = true) => {
  const themeVersion = isV3 ? 3 : 2;
  const scheme = isDark ? 'dark' : 'light';

  return defaultThemesByVersion[themeVersion][scheme];
};
