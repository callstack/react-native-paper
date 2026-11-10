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
  const safeOverrides = React.useMemo(
    () => withoutUnsafeKeys(overrides),
    [overrides]
  );
  return useThemeBase<T>(safeOverrides);
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

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value &&
  typeof value === 'object' &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
// Drops unsafe keys at any depth of nested plain objects and arrays. A value
// with nothing to drop is returned as is, so the app's objects keep their
// identity. PlatformColor values are walked too, since any object can carry a
// sentinel key; a real one has nothing to drop and comes back as is.
export const withoutUnsafeKeys = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    const items = value.map((item: unknown) => withoutUnsafeKeys(item));
    return items.some((item, index) => item !== value[index])
      ? (items as T)
      : value;
  }
  if (!isPlainObject(value)) {
    return value;
  }
  let changed = false;
  const entries: Array<[string, unknown]> = [];
  for (const [key, child] of Object.entries(value)) {
    if (UNSAFE_KEYS.has(key)) {
      changed = true;
      continue;
    }
    const safeChild = withoutUnsafeKeys(child);
    changed ||= safeChild !== child;
    entries.push([key, safeChild]);
  }
  return changed ? (Object.fromEntries(entries) as T) : value;
};

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
    return (withoutUnsafeKeys(overrides) ?? base) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(overrides)) {
    if (UNSAFE_KEYS.has(key)) {
      continue;
    }
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
  LightTheme: T;
};
// eslint-disable-next-line no-redeclare
export function adaptNavigationTheme<T extends NavigationTheme>(themes: {
  reactNavigationDark: T;
  materialDark?: Theme;
}): {
  DarkTheme: T;
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
