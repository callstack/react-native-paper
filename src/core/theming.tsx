import type { ComponentType } from 'react';

import { $DeepPartial, createTheming } from '@callstack/react-theme-provider';
import color from 'color';

import {
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from '../styles/themes';
import type {
  InternalTheme,
  MD3Theme,
  MD3AndroidColors,
  NavigationTheme,
} from '../types';

export const DefaultTheme = MD3LightTheme;

export const {
  ThemeProvider,
  withTheme,
  useTheme: useAppTheme,
} = createTheming<unknown>(MD3LightTheme);

export function useTheme<T = MD3Theme>(overrides?: $DeepPartial<T>) {
  return useAppTheme<T>(overrides);
}

export const useInternalTheme = (
  themeOverrides?: $DeepPartial<InternalTheme>
) => useAppTheme<InternalTheme>(themeOverrides);

export const withInternalTheme = <Props extends { theme: InternalTheme }, C>(
  WrappedComponent: ComponentType<Props & { theme: InternalTheme }> & C
) => withTheme<Props, C>(WrappedComponent);

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

// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: {
  reactNaivgationLight: NavigationTheme;
  materialLight?: MD3Theme;
}): {
  LightTheme: NavigationTheme;
};
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: {
  reactNavigationDark: NavigationTheme;
  materialDark?: MD3Theme;
}): {
  DarkTheme: NavigationTheme;
};
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: {
  reactNavigationLight: NavigationTheme;
  reactNavigationDark: NavigationTheme;
  materialLight?: MD3Theme;
  materialDark?: MD3Theme;
}): { LightTheme: NavigationTheme; DarkTheme: NavigationTheme };
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: any) {
  const {
    reactNavigationLight,
    reactNavigationDark,
    materialLight,
    materialDark,
  } = themes;

  const getAdaptedTheme = (
    navigationTheme: NavigationTheme,
    MD3Theme: MD3Theme
  ) => {
    return {
      ...navigationTheme,
      colors: {
        ...navigationTheme.colors,
        primary: MD3Theme.colors.primary,
        background: MD3Theme.colors.background,
        card: MD3Theme.colors.elevation.level2,
        text: MD3Theme.colors.onSurface,
        border: MD3Theme.colors.outline,
        notification: MD3Theme.colors.error,
      },
    };
  };

  const MD3Themes = {
    light: materialLight || MD3LightTheme,
    dark: materialDark || MD3DarkTheme,
  };

  if (reactNavigationLight && reactNavigationDark) {
    const modes = ['light', 'dark'] as const;

    const NavigationThemes = {
      light: reactNavigationLight,
      dark: reactNavigationDark,
    };

    const { light: adaptedLight, dark: adaptedDark } = modes.reduce(
      (prev, curr) => {
        return {
          ...prev,
          [curr]: getAdaptedTheme(NavigationThemes[curr], MD3Themes[curr]),
        };
      },
      {
        light: reactNavigationLight,
        dark: reactNavigationDark,
      }
    );

    return {
      LightTheme: adaptedLight,
      DarkTheme: adaptedDark,
    };
  }

  if (reactNavigationDark) {
    return {
      DarkTheme: getAdaptedTheme(reactNavigationDark, MD3Themes.dark),
    };
  }

  return {
    LightTheme: getAdaptedTheme(reactNavigationLight, MD3Themes.light),
  };
}

export const getDynamicThemeElevations = (scheme: MD3AndroidColors) => {
  const elevationValues = ['transparent', 0.05, 0.08, 0.11, 0.12, 0.14];
  return elevationValues.reduce((elevations, elevationValue, index) => {
    return {
      ...elevations,
      [`level${index}`]:
        index === 0
          ? elevationValue
          : color(scheme.surface)
              .mix(color(scheme.primary), elevationValue as number)
              .rgb()
              .string(),
    };
  }, {});
};
