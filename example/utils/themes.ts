import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  adaptNavigationTheme,
  DarkTheme,
  LightTheme,
  configureFonts,
} from 'react-native-paper';

const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } =
  adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

export const CombinedDefaultTheme = {
  ...LightTheme,
  ...NavLightTheme,
  colors: {
    ...LightTheme.colors,
    ...NavLightTheme.colors,
  },
  fonts: {
    ...NavLightTheme.fonts,
    ...LightTheme.fonts,
  },
};

export const CombinedDarkTheme = {
  ...DarkTheme,
  ...NavDarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...NavDarkTheme.colors,
  },
  fonts: {
    ...NavDarkTheme.fonts,
    ...DarkTheme.fonts,
  },
};

type CombinedTheme = typeof CombinedDefaultTheme;

export const createConfiguredFontTheme = (theme: CombinedTheme) => ({
  ...theme,
  fonts: configureFonts({
    config: {
      fontFamily: 'Abel',
    },
  }),
});

export const createConfiguredFontNavigationTheme = (theme: CombinedTheme) => ({
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
