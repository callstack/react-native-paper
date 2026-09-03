import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import type { Theme as ReactNavigationTheme } from '@react-navigation/native';
import { adaptNavigationTheme, configureFonts } from 'react-native-paper';
import type { Theme } from 'react-native-paper';

/**
 * Merges the React Navigation theme into a Paper theme.
 *
 * The Paper theme is passed in, and also given to `adaptNavigationTheme`, so
 * that the selected contrast level is kept.
 */
export const createCombinedTheme = (paperTheme: Theme, isDark: boolean) => {
  const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } =
    adaptNavigationTheme({
      reactNavigationLight: NavigationDefaultTheme,
      reactNavigationDark: NavigationDarkTheme,
      materialLight: isDark ? undefined : paperTheme,
      materialDark: isDark ? paperTheme : undefined,
    });

  const navTheme = isDark ? NavDarkTheme : NavLightTheme;

  return {
    ...paperTheme,
    ...navTheme,
    colors: {
      ...paperTheme.colors,
      ...navTheme.colors,
    },
    fonts: {
      ...paperTheme.fonts,
      ...navTheme.fonts,
    },
  };
};

export const createConfiguredFontTheme = (
  theme: Theme & ReactNavigationTheme
) => ({
  ...theme,
  fonts: configureFonts({
    config: {
      fontFamily: 'Abel',
    },
  }),
});

export const createConfiguredFontNavigationTheme = (
  theme: Theme & ReactNavigationTheme
) => ({
  ...theme,
  fonts: {
    ...theme.fonts,
    regular: {
      ...theme.fonts.regular,
      fontFamily: 'Abel',
    },
    medium: {
      ...theme.fonts.medium,
      fontFamily: 'Abel',
    },
    heavy: {
      ...theme.fonts.heavy,
      fontFamily: 'Abel',
    },
    bold: {
      ...theme.fonts.bold,
      fontFamily: 'Abel',
    },
  },
});
