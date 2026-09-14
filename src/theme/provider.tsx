import * as React from 'react';

import { createTheming } from '@callstack/react-theme-provider';
import type { $DeepPartial } from '@callstack/react-theme-provider';
import isEqual from 'fast-deep-equal';

import { DarkTheme, LightTheme } from './schemes';
import type { Theme, NavigationTheme } from './types';

const {
  ThemeProvider,
  withTheme,
  useTheme: useThemeBase,
} = createTheming<unknown>(LightTheme);

export { ThemeProvider, withTheme };

export function useTheme<T = Theme>(overrides?: $DeepPartial<T>) {
  return useThemeBase<T>(overrides);
}

// Upstream `deepmerge` corrupts PlatformColor objects, so we recurse manually
// and treat sentinels as leaves. Three shapes:
//   `semantic`        — iOS PlatformColor
//   `dynamic`         — DynamicColorIOS
//   `resource_paths`  — Android PlatformColor
export const isPlatformColorSentinel = (v: unknown): boolean =>
  !!v &&
  typeof v === 'object' &&
  ('resource_paths' in v || 'semantic' in v || 'dynamic' in v);

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
export const safeMerge = <T,>(base: T, overrides: unknown): T => {
  if (
    !base ||
    !overrides ||
    typeof base !== 'object' ||
    typeof overrides !== 'object' ||
    Array.isArray(base) ||
    Array.isArray(overrides) ||
    isPlatformColorSentinel(base) ||
    isPlatformColorSentinel(overrides)
  ) {
    // leaf: override wins, fall back to base
    return (overrides ?? base) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(overrides)) {
    out[key] = safeMerge(
      (base as Record<string, unknown>)[key],
      (overrides as Record<string, unknown>)[key]
    );
  }
  return out as T;
};
/* eslint-enable @typescript-eslint/no-unsafe-type-assertion */

export const useInternalTheme = (
  themeOverrides: $DeepPartial<Theme> | undefined
): Theme => {
  const theme = useThemeBase<Theme>();
  const [overrides, setOverrides] = React.useState(themeOverrides);

  if (!isEqual(overrides, themeOverrides)) {
    setOverrides(themeOverrides);
  }

  return React.useMemo(
    () => (overrides ? safeMerge(theme, overrides) : theme),
    [theme, overrides]
  );
};

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
  TDark extends NavigationTheme,
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

  const MD3Themes = {
    light: materialLight || LightTheme,
    dark: materialDark || DarkTheme,
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
  materialTheme: Theme
): T => {
  const base = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: materialTheme.colors.primary,
      background: materialTheme.colors.background,
      card: materialTheme.colors.surfaceContainer,
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
