import { createTheming } from '@callstack/react-theme-provider';
import MD2DarkTheme from '../styles/themes/v2/DarkTheme';
import MD2LightTheme from '../styles/themes/v2/LightTheme';
import MD3DarkTheme from '../styles/themes/v3/DarkTheme';
import {
  default as LightTheme,
  default as MD3LightTheme,
} from '../styles/themes/v3/LightTheme';

export const { ThemeProvider, withTheme, useTheme } =
  createTheming<ReactNativePaper.Theme>(LightTheme as ReactNativePaper.Theme);

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
