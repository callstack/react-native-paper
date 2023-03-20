import type { ComponentType } from 'react';

import { $DeepPartial, createTheming } from '@callstack/react-theme-provider';
import type { Theme as ReactNavigationTheme } from '@react-navigation/native';
import color from 'color';

import {
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from '../styles/themes';
import type { InternalTheme, MD3Theme, MD3AndroidColors } from '../types';

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
  themeOverrides: $DeepPartial<InternalTheme> | undefined
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

export const getTheme = <
  Scheme extends boolean = false,
  IsVersion3 extends boolean = true
>(
  isDark: Scheme = false as Scheme,
  isV3: IsVersion3 = true as IsVersion3
): typeof defaultThemesByVersion[IsVersion3 extends true
  ? 3
  : 2][Scheme extends true ? 'dark' : 'light'] => {
  const themeVersion = isV3 ? 3 : 2;
  const scheme = isDark ? 'dark' : 'light';

  return defaultThemesByVersion[themeVersion][scheme];
};

// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: {
  reactNavigationLight: ReactNavigationTheme;
  materialLight?: MD3Theme;
}): {
  LightTheme: ReactNavigationTheme;
};
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: {
  reactNavigationDark: ReactNavigationTheme;
  materialDark?: MD3Theme;
}): {
  DarkTheme: ReactNavigationTheme;
};
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: {
  reactNavigationLight: ReactNavigationTheme;
  reactNavigationDark: ReactNavigationTheme;
  materialLight?: MD3Theme;
  materialDark?: MD3Theme;
}): { LightTheme: ReactNavigationTheme; DarkTheme: ReactNavigationTheme };
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: any) {
  const {
    reactNavigationLight,
    reactNavigationDark,
    materialLight,
    materialDark,
  } = themes;

  const getAdaptedTheme = (
    navigationTheme: ReactNavigationTheme,
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
      fonts: {
        ...navigationTheme.fonts,
        regular: {
          fontFamily: MD3Theme.fonts.bodyMedium.fontFamily,
          fontWeight: MD3Theme.fonts.bodyMedium.fontWeight,
        },
        medium: {
          fontFamily: MD3Theme.fonts.headlineMedium.fontFamily,
          fontWeight: MD3Theme.fonts.headlineMedium.fontWeight,
        },
        bold: {
          fontFamily: MD3Theme.fonts.headlineMedium.fontFamily,
          fontWeight: MD3Theme.fonts.headlineMedium.fontWeight,
        },
        heavy: {
          fontFamily: MD3Theme.fonts.headlineMedium.fontFamily,
          fontWeight: MD3Theme.fonts.headlineMedium.fontWeight,
        },
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
