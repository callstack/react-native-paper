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
): (typeof defaultThemesByVersion)[IsVersion3 extends true
  ? 3
  : 2][Scheme extends true ? 'dark' : 'light'] => {
  const themeVersion = isV3 ? 3 : 2;
  const scheme = isDark ? 'dark' : 'light';

  return defaultThemesByVersion[themeVersion][scheme];
};

// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme<T extends NavigationTheme>(themes: {
  reactNavigationLight: T;
  materialLight?: MD3Theme;
}): {
  LightTheme: NavigationTheme;
};
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme<T extends NavigationTheme>(themes: {
  reactNavigationDark: T;
  materialDark?: MD3Theme;
}): {
  DarkTheme: NavigationTheme;
};
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme<
  TLight extends NavigationTheme,
  TDark extends NavigationTheme
>(themes: {
  reactNavigationLight: TLight;
  reactNavigationDark: TDark;
  materialLight?: MD3Theme;
  materialDark?: MD3Theme;
}): { LightTheme: TLight; DarkTheme: TDark };
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: any) {
  const {
    reactNavigationLight,
    reactNavigationDark,
    materialLight,
    materialDark,
  } = themes;

  const MD3Themes = {
    light: materialLight || MD3LightTheme,
    dark: materialDark || MD3DarkTheme,
  };

  const result: { LightTheme?: any; DarkTheme?: any } = {};

  if (reactNavigationLight) {
    result.LightTheme = getAdaptedTheme(reactNavigationLight, MD3Themes.light);
  }

  if (reactNavigationDark) {
    result.DarkTheme = getAdaptedTheme(reactNavigationDark, MD3Themes.dark);
  }

  return result;
}

const getAdaptedTheme = <T extends NavigationTheme>(
  theme: T,
  materialTheme: MD3Theme
): T => {
  const base = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: materialTheme.colors.primary,
      background: materialTheme.colors.background,
      card: materialTheme.colors.elevation.level2,
      text: materialTheme.colors.onSurface,
      border: materialTheme.colors.outline,
      notification: materialTheme.colors.error,
    },
  };

  if ('fonts' in theme) {
    return {
      ...base,
      fonts: {
        regular: {
          fontFamily: materialTheme.fonts.bodyMedium.fontFamily,
          fontWeight: materialTheme.fonts.bodyMedium.fontWeight,
          letterSpacing: materialTheme.fonts.bodyMedium.letterSpacing,
        },
        medium: {
          fontFamily: materialTheme.fonts.titleMedium.fontFamily,
          fontWeight: materialTheme.fonts.titleMedium.fontWeight,
          letterSpacing: materialTheme.fonts.titleMedium.letterSpacing,
        },
        bold: {
          fontFamily: materialTheme.fonts.headlineSmall.fontFamily,
          fontWeight: materialTheme.fonts.headlineSmall.fontWeight,
          letterSpacing: materialTheme.fonts.headlineSmall.letterSpacing,
        },
        heavy: {
          fontFamily: materialTheme.fonts.headlineLarge.fontFamily,
          fontWeight: materialTheme.fonts.headlineLarge.fontWeight,
          letterSpacing: materialTheme.fonts.headlineLarge.letterSpacing,
        },
      },
    };
  }

  return base;
};

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
