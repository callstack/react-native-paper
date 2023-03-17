import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import {
  adaptNavigationTheme,
  configureFonts,
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';

export function getCombinedTheme({
  overrides,
  isDarkMode = false,
  isV3 = true,
}: {
  overrides?: Record<any, any>;
  isDarkMode?: boolean;
  isV3?: boolean;
}) {
  const customTheme = overrides ?? {};
  customTheme.colors ??= {};
  customTheme.fonts ??= {};

  if (isV3) {
    if (overrides) {
      const MD3LightCustom = {
        ...MD3LightTheme,
        ...customTheme,
        colors: {
          ...MD3LightTheme.colors,
          ...customTheme.colors,
        },
      };

      const MD3DarkCustom = {
        ...MD3DarkTheme,
        ...customTheme,
        colors: {
          ...MD3DarkTheme.colors,
          ...customTheme.colors,
        },
      };

      if (overrides.fonts) {
        const MD3LightCustomFont = {
          ...MD3LightCustom,
          fonts: configureFonts({
            config: overrides.fonts,
          }),
        };
        const MD3DarkCustomFont = {
          ...MD3DarkCustom,
          fonts: configureFonts({
            config: overrides.fonts,
          }),
        };

        const { LightTheme, DarkTheme } = adaptNavigationTheme({
          reactNavigationLight: NavigationDefaultTheme,
          reactNavigationDark: NavigationDarkTheme,
          materialLight: MD3LightCustomFont,
          materialDark: MD3DarkCustomFont,
        });

        if (isDarkMode) {
          return {
            ...MD3DarkCustomFont,
            ...DarkTheme,
            colors: {
              ...MD3DarkCustomFont.colors,
              ...DarkTheme.colors,
            },
            fonts: {
              ...DarkTheme.fonts,
              ...MD3DarkCustomFont.fonts,
            },
          };
        }

        return {
          ...MD3LightCustomFont,
          ...LightTheme,
          colors: {
            ...MD3LightCustomFont.colors,
            ...LightTheme.colors,
          },
          fonts: {
            ...LightTheme.fonts,
            ...MD3LightCustomFont.fonts,
          },
        };
      }

      const { LightTheme, DarkTheme } = adaptNavigationTheme({
        reactNavigationLight: NavigationDefaultTheme,
        reactNavigationDark: NavigationDarkTheme,
        materialLight: MD3LightCustom,
        materialDark: MD3DarkCustom,
      });

      if (isDarkMode) {
        return {
          ...MD3DarkCustom,
          ...DarkTheme,
          colors: {
            ...MD3DarkCustom.colors,
            ...DarkTheme.colors,
          },
          fonts: {
            ...MD3DarkCustom.fonts,
            ...DarkTheme.fonts,
          },
        };
      }

      return {
        ...MD3LightCustom,
        ...LightTheme,
        colors: {
          ...MD3LightCustom.colors,
          ...LightTheme.colors,
        },
        fonts: {
          ...MD3LightCustom.fonts,
          ...LightTheme.fonts,
        },
      };
    }

    const { LightTheme, DarkTheme } = adaptNavigationTheme({
      reactNavigationLight: NavigationDefaultTheme,
      reactNavigationDark: NavigationDarkTheme,
    });

    return isDarkMode
      ? {
          ...MD3DarkTheme,
          ...DarkTheme,
          colors: {
            ...MD3DarkTheme.colors,
            ...DarkTheme.colors,
          },
          fonts: {
            ...MD3DarkTheme.fonts,
            ...DarkTheme.fonts,
          },
        }
      : {
          ...MD3LightTheme,
          ...LightTheme,
          colors: {
            ...MD3LightTheme.colors,
            ...LightTheme.colors,
          },
          fonts: {
            ...MD3LightTheme.fonts,
            ...LightTheme.fonts,
          },
        };
  }

  if (overrides) {
    if (isDarkMode) {
      return {
        ...MD2DarkTheme,
        ...customTheme,
        colors: {
          ...MD2DarkTheme.colors,
          ...customTheme.colors,
        },
        fonts: MD2DarkTheme.fonts,
      };
    }

    return {
      ...MD2LightTheme,
      ...overrides,
      colors: {
        ...MD2LightTheme.colors,
        ...customTheme.colors,
      },
      fonts: MD2DarkTheme.fonts,
    };
  }

  return isDarkMode ? MD2DarkTheme : MD2LightTheme;
}
