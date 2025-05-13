import type { ComponentType } from 'react';

import { $DeepPartial, createTheming } from '@callstack/react-theme-provider';

import { DarkTheme, LightTheme } from '../styles/themes';
import type { InternalTheme, Theme, NavigationTheme } from '../types';

export const DefaultTheme = LightTheme;

export const {
  ThemeProvider,
  withTheme,
  useTheme: useAppTheme,
} = createTheming<unknown>(LightTheme);

export function useTheme<T = Theme>(overrides?: $DeepPartial<T>) {
  return useAppTheme<T>(overrides);
}

export const useInternalTheme = (
  themeOverrides: $DeepPartial<InternalTheme> | undefined
) => useAppTheme<InternalTheme>(themeOverrides);

export const withInternalTheme = <Props extends { theme: InternalTheme }, C>(
  WrappedComponent: ComponentType<Props & { theme: InternalTheme }> & C
) => withTheme<Props, C>(WrappedComponent);

export const defaultThemesByVersion = {
  light: LightTheme,
  dark: DarkTheme,
};

export const getTheme = <Scheme extends boolean = false>(
  isDark: Scheme = false as Scheme
): (typeof defaultThemesByVersion)[Scheme extends true ? 'dark' : 'light'] => {
  const scheme = isDark ? 'dark' : 'light';

  return defaultThemesByVersion[scheme];
};

// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme<T extends NavigationTheme>(themes: {
  reactNavigationLight: T;
  materialLight?: Theme;
}): {
  LightTheme: NavigationTheme;
};
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme<T extends NavigationTheme>(themes: {
  reactNavigationDark: T;
  materialDark?: Theme;
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
  materialLight?: Theme;
  materialDark?: Theme;
}): { LightTheme: TLight; DarkTheme: TDark };
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme(themes: any) {
  const {
    reactNavigationLight,
    reactNavigationDark,
    materialLight,
    materialDark,
  } = themes;

  const Theme = {
    light: materialLight || LightTheme,
    dark: materialDark || DarkTheme,
  };

  const result: { LightTheme?: any; DarkTheme?: any } = {};

  if (reactNavigationLight) {
    result.LightTheme = getAdaptedTheme(reactNavigationLight, Theme.light);
  }

  if (reactNavigationDark) {
    result.DarkTheme = getAdaptedTheme(reactNavigationDark, Theme.dark);
  }

  return result;
}

const getAdaptedTheme = <T extends NavigationTheme>(
  theme: T,
  materialTheme: Theme
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
