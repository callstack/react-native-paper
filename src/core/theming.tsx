import { $DeepPartial, createTheming } from '@callstack/react-theme-provider';
import type { ComponentType } from 'react';
import type { InternalTheme } from 'src/types';
import {
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from '../styles/themes';

export const DefaultTheme = MD3LightTheme;

export const { ThemeProvider, withTheme, useTheme } =
  createTheming<ReactNativePaperTheme>(DefaultTheme);

export const useInternalTheme = (
  themeOverrides?: $DeepPartial<InternalTheme>
) => useTheme<InternalTheme>(themeOverrides);

export const withInternalTheme = <Props extends {}, C>(
  WrappedComponent: ComponentType<Props & { theme: InternalTheme }> & C
) => withTheme(WrappedComponent);

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
