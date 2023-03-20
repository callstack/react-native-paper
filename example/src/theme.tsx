import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  adaptNavigationTheme,
  configureFonts,
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';

function getMD2Theme(isDarkMode = false) {
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  return isDarkMode
    ? { navigationTheme: DarkTheme, theme: MD2DarkTheme }
    : { navigationTheme: LightTheme, theme: MD2LightTheme };
}

function getMD3Theme(isDarkMode = false, customFont?: string) {
  const materialLight = { ...MD3LightTheme };
  const materialDark = { ...MD3DarkTheme };

  if (customFont) {
    materialLight.fonts = configureFonts({
      config: { fontFamily: customFont },
    });
    materialDark.fonts = configureFonts({
      config: { fontFamily: customFont },
    });
  }

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialLight,
    materialDark,
  });

  return isDarkMode
    ? { navigationTheme: DarkTheme, theme: materialDark }
    : { navigationTheme: LightTheme, theme: materialLight };
}

export function getTheme(
  version: 2 | 3 = 3,
  isDarkMode: boolean = false,
  customFont?: string
) {
  return version == 2
    ? getMD2Theme(isDarkMode)
    : getMD3Theme(isDarkMode, customFont);
}
