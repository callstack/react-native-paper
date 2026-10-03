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

const isStringArray = (v: unknown): boolean =>
  Array.isArray(v) && v.every((item) => typeof item === 'string');

const DYNAMIC_TUPLE_KEYS = [
  'light',
  'dark',
  'highContrastLight',
  'highContrastDark',
];

// `DynamicColorIOS` always emits both `light` and `dark` (either may be
// nullish) and never any key outside the tuple above.
const isDynamicColorIOSTuple = (v: unknown): boolean => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    return false;
  }
  const keys = Object.keys(v);
  return (
    keys.includes('light') &&
    keys.includes('dark') &&
    keys.every((key) => DYNAMIC_TUPLE_KEYS.includes(key))
  );
};

// Upstream `deepmerge` corrupts PlatformColor objects, so we recurse manually
// and treat sentinels as leaves. Three shapes, straight from React Native's
// `PlatformColorValueTypes.{ios,android}.js`:
//   `{ semantic: string[] }`                 -> iOS PlatformColor
//   `{ dynamic: { light, dark, ...} }`       -> DynamicColorIOS
//   `{ resource_paths: string[] }`           -> Android PlatformColor
// The shape has to be validated, not just the key name: a theme may own a
// custom property called `dynamic`, `semantic` or `resource_paths` (extending
// the theme with arbitrary properties is documented), and treating such a
// theme as a leaf would drop every default it did not spell out.
export const isPlatformColorSentinel = (v: unknown): boolean => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    return false;
  }
  // A native color value carries exactly one of the three keys and nothing
  // else, so anything with siblings is a regular object.
  const entries = Object.entries(v);
  if (entries.length !== 1) {
    return false;
  }
  const [[key, value]] = entries;

  switch (key) {
    case 'semantic':
    case 'resource_paths':
      return isStringArray(value);
    case 'dynamic':
      return isDynamicColorIOSTuple(value);
    default:
      return false;
  }
};

// A native color replaces whatever it lands on, so it is a leaf wherever it
// appears *inside* a theme. Only nested values get this check: the root
// `overrides` is the theme itself, and a theme is free to own a custom property
// shaped like a sentinel, which would otherwise drop every default.
const mergeThemeValue = (base: unknown, overrides: unknown): unknown =>
  isPlatformColorSentinel(overrides) ? overrides : safeMerge(base, overrides);

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
export const safeMerge = <T,>(base: T, overrides: unknown): T => {
  if (
    !base ||
    !overrides ||
    typeof base !== 'object' ||
    typeof overrides !== 'object' ||
    Array.isArray(base) ||
    Array.isArray(overrides) ||
    isPlatformColorSentinel(base)
  ) {
    // leaf: override wins, fall back to base
    return (overrides ?? base) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(overrides)) {
    out[key] = mergeThemeValue(
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
