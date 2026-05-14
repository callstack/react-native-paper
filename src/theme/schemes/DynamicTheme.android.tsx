import { Platform, PlatformColor, type ColorValue } from 'react-native';

import { DarkTheme } from './DarkTheme';
import { LightTheme } from './LightTheme';
import { Palette } from '../tokens';
import type { Theme, ThemeColors } from '../types';

const apiLevel = Platform.Version as number;

const ac = (name: string) => PlatformColor(`@android:color/${name}`);

/**
 * Picks the correct color value for the current Android API level.
 * - API 34+: uses the named role resource (system_*_light/dark)
 * - API 31-33: uses the tonal accent resource (system_accent*_NNN), or ref when null
 * - API < 31: uses the reference palette value
 *
 * Pass `null` as api31 for roles that have no @android:color/ resource on API31-33
 * (MCL @color/m3_ref_palette_* resources and error roles). Those fall through to ref.
 * @see https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md
 */
const pick = (api34: string, api31: string | null, ref: string): ColorValue =>
  apiLevel >= 34
    ? ac(api34)
    : apiLevel >= 31 && api31 !== null
    ? ac(api31)
    : ref;

// Known limitation: surface/container roles on API 31-33 use
// @color/m3_ref_palette_dynamic_neutral_variant* (MCL resources that require a
// native DynamicColors setup). No @android:color/ equivalent exists for those
// slots. Reference palette values are used as fallback on API 31-33.

type RoleEntry = {
  role: keyof ThemeColors;
  light: [string, string | null, string];
  dark: [string, string | null, string];
};

const colorRoleMap: RoleEntry[] = [
  // Primary family
  {
    role: 'primary',
    light: ['system_primary_light', 'system_accent1_600', Palette.primary40],
    dark: ['system_primary_dark', 'system_accent1_200', Palette.primary80],
  },
  {
    role: 'onPrimary',
    light: ['system_on_primary_light', 'system_accent1_0', Palette.primary100],
    dark: ['system_on_primary_dark', 'system_accent1_800', Palette.primary20],
  },
  {
    role: 'primaryContainer',
    light: [
      'system_primary_container_light',
      'system_accent1_100',
      Palette.primary90,
    ],
    dark: [
      'system_primary_container_dark',
      'system_accent1_700',
      Palette.primary30,
    ],
  },
  {
    role: 'onPrimaryContainer',
    light: [
      'system_on_primary_container_light',
      'system_accent1_900',
      Palette.primary10,
    ],
    dark: [
      'system_on_primary_container_dark',
      'system_accent1_100',
      Palette.primary90,
    ],
  },
  {
    role: 'inversePrimary',
    light: ['system_primary_dark', 'system_accent1_200', Palette.primary80],
    dark: ['system_primary_light', 'system_accent1_600', Palette.primary40],
  },
  // Secondary family
  {
    role: 'secondary',
    light: [
      'system_secondary_light',
      'system_accent2_600',
      Palette.secondary40,
    ],
    dark: ['system_secondary_dark', 'system_accent2_200', Palette.secondary80],
  },
  {
    role: 'onSecondary',
    light: [
      'system_on_secondary_light',
      'system_accent2_0',
      Palette.secondary100,
    ],
    dark: [
      'system_on_secondary_dark',
      'system_accent2_800',
      Palette.secondary20,
    ],
  },
  {
    role: 'secondaryContainer',
    light: [
      'system_secondary_container_light',
      'system_accent2_100',
      Palette.secondary90,
    ],
    dark: [
      'system_secondary_container_dark',
      'system_accent2_700',
      Palette.secondary30,
    ],
  },
  {
    role: 'onSecondaryContainer',
    light: [
      'system_on_secondary_container_light',
      'system_accent2_900',
      Palette.secondary10,
    ],
    dark: [
      'system_on_secondary_container_dark',
      'system_accent2_100',
      Palette.secondary90,
    ],
  },
  // Tertiary family
  {
    role: 'tertiary',
    light: ['system_tertiary_light', 'system_accent3_600', Palette.tertiary40],
    dark: ['system_tertiary_dark', 'system_accent3_200', Palette.tertiary80],
  },
  {
    role: 'onTertiary',
    light: [
      'system_on_tertiary_light',
      'system_accent3_0',
      Palette.tertiary100,
    ],
    dark: ['system_on_tertiary_dark', 'system_accent3_800', Palette.tertiary20],
  },
  {
    role: 'tertiaryContainer',
    light: [
      'system_tertiary_container_light',
      'system_accent3_100',
      Palette.tertiary90,
    ],
    dark: [
      'system_tertiary_container_dark',
      'system_accent3_700',
      Palette.tertiary30,
    ],
  },
  {
    role: 'onTertiaryContainer',
    light: [
      'system_on_tertiary_container_light',
      'system_accent3_900',
      Palette.tertiary10,
    ],
    dark: [
      'system_on_tertiary_container_dark',
      'system_accent3_100',
      Palette.tertiary90,
    ],
  },
  // Error family -- no @android:color/ resource on API31-33; null falls through to ref
  {
    role: 'error',
    light: ['system_error_light', null, Palette.error40],
    dark: ['system_error_dark', null, Palette.error80],
  },
  {
    role: 'onError',
    light: ['system_on_error_light', null, Palette.error100],
    dark: ['system_on_error_dark', null, Palette.error20],
  },
  {
    role: 'errorContainer',
    light: ['system_error_container_light', null, Palette.error90],
    dark: ['system_error_container_dark', null, Palette.error30],
  },
  {
    role: 'onErrorContainer',
    light: ['system_on_error_container_light', null, Palette.error10],
    dark: ['system_on_error_container_dark', null, Palette.error90],
  },
  // Neutral roles
  {
    role: 'onSurface',
    light: [
      'system_on_surface_light',
      'system_neutral1_900',
      Palette.neutral10,
    ],
    dark: ['system_on_surface_dark', 'system_neutral1_100', Palette.neutral90],
  },
  {
    role: 'onBackground',
    light: [
      'system_on_background_light',
      'system_neutral1_900',
      Palette.neutral10,
    ],
    dark: [
      'system_on_background_dark',
      'system_neutral1_100',
      Palette.neutral90,
    ],
  },
  {
    role: 'onSurfaceVariant',
    light: [
      'system_on_surface_variant_light',
      'system_neutral2_700',
      Palette.neutralVariant30,
    ],
    dark: [
      'system_on_surface_variant_dark',
      'system_neutral2_200',
      Palette.neutralVariant80,
    ],
  },
  {
    role: 'outline',
    light: [
      'system_outline_light',
      'system_neutral2_500',
      Palette.neutralVariant50,
    ],
    dark: [
      'system_outline_dark',
      'system_neutral2_400',
      Palette.neutralVariant60,
    ],
  },
  {
    role: 'outlineVariant',
    light: [
      'system_outline_variant_light',
      'system_neutral2_200',
      Palette.neutralVariant80,
    ],
    dark: [
      'system_outline_variant_dark',
      'system_neutral2_700',
      Palette.neutralVariant30,
    ],
  },
  {
    role: 'inverseSurface',
    light: ['system_surface_dark', 'system_neutral1_800', Palette.neutral20],
    dark: ['system_surface_light', 'system_neutral1_100', Palette.neutral90],
  },
  {
    role: 'inverseOnSurface',
    light: ['system_on_surface_dark', 'system_neutral1_50', Palette.neutral95],
    dark: ['system_on_surface_light', 'system_neutral1_800', Palette.neutral20],
  },
  {
    role: 'surfaceVariant',
    light: [
      'system_surface_variant_light',
      'system_neutral2_100',
      Palette.neutralVariant90,
    ],
    dark: [
      'system_surface_variant_dark',
      'system_neutral2_700',
      Palette.neutralVariant30,
    ],
  },
  // Surface/background family -- API31-33 uses MCL @color/m3_ref_palette_* (not @android:color/); null falls through to ref
  {
    role: 'background',
    light: ['system_background_light', null, Palette.neutral98],
    dark: ['system_background_dark', null, Palette.neutral6],
  },
  {
    role: 'surface',
    light: ['system_surface_light', null, Palette.neutral98],
    dark: ['system_surface_dark', null, Palette.neutral6],
  },
  {
    role: 'surfaceBright',
    light: ['system_surface_bright_light', null, Palette.neutral98],
    dark: ['system_surface_bright_dark', null, Palette.neutral24],
  },
  {
    role: 'surfaceDim',
    light: ['system_surface_dim_light', null, Palette.neutral87],
    dark: ['system_surface_dim_dark', null, Palette.neutral6],
  },
  {
    role: 'surfaceContainer',
    light: ['system_surface_container_light', null, Palette.neutral94],
    dark: ['system_surface_container_dark', null, Palette.neutral12],
  },
  {
    role: 'surfaceContainerLow',
    light: ['system_surface_container_low_light', null, Palette.neutral96],
    dark: [
      'system_surface_container_low_dark',
      'system_neutral2_900',
      Palette.neutral10,
    ],
  },
  {
    role: 'surfaceContainerLowest',
    light: [
      'system_surface_container_lowest_light',
      'system_neutral2_0',
      Palette.neutral100,
    ],
    dark: ['system_surface_container_lowest_dark', null, Palette.neutral4],
  },
  {
    role: 'surfaceContainerHigh',
    light: ['system_surface_container_high_light', null, Palette.neutral92],
    dark: ['system_surface_container_high_dark', null, Palette.neutral17],
  },
  {
    role: 'surfaceContainerHighest',
    light: [
      'system_surface_container_highest_light',
      'system_neutral2_100',
      Palette.neutral90,
    ],
    dark: ['system_surface_container_highest_dark', null, Palette.neutral22],
  },
  // Fixed roles: same api34/api31 for both light and dark schemes
  {
    role: 'primaryFixed',
    light: ['system_primary_fixed', 'system_accent1_100', Palette.primary90],
    dark: ['system_primary_fixed', 'system_accent1_100', Palette.primary90],
  },
  {
    role: 'primaryFixedDim',
    light: [
      'system_primary_fixed_dim',
      'system_accent1_200',
      Palette.primary80,
    ],
    dark: ['system_primary_fixed_dim', 'system_accent1_200', Palette.primary80],
  },
  {
    role: 'onPrimaryFixed',
    light: ['system_on_primary_fixed', 'system_accent1_900', Palette.primary10],
    dark: ['system_on_primary_fixed', 'system_accent1_900', Palette.primary10],
  },
  {
    role: 'onPrimaryFixedVariant',
    light: [
      'system_on_primary_fixed_variant',
      'system_accent1_700',
      Palette.primary30,
    ],
    dark: [
      'system_on_primary_fixed_variant',
      'system_accent1_700',
      Palette.primary30,
    ],
  },
  {
    role: 'secondaryFixed',
    light: [
      'system_secondary_fixed',
      'system_accent2_100',
      Palette.secondary90,
    ],
    dark: ['system_secondary_fixed', 'system_accent2_100', Palette.secondary90],
  },
  {
    role: 'secondaryFixedDim',
    light: [
      'system_secondary_fixed_dim',
      'system_accent2_200',
      Palette.secondary80,
    ],
    dark: [
      'system_secondary_fixed_dim',
      'system_accent2_200',
      Palette.secondary80,
    ],
  },
  {
    role: 'onSecondaryFixed',
    light: [
      'system_on_secondary_fixed',
      'system_accent2_900',
      Palette.secondary10,
    ],
    dark: [
      'system_on_secondary_fixed',
      'system_accent2_900',
      Palette.secondary10,
    ],
  },
  {
    role: 'onSecondaryFixedVariant',
    light: [
      'system_on_secondary_fixed_variant',
      'system_accent2_700',
      Palette.secondary30,
    ],
    dark: [
      'system_on_secondary_fixed_variant',
      'system_accent2_700',
      Palette.secondary30,
    ],
  },
  {
    role: 'tertiaryFixed',
    light: ['system_tertiary_fixed', 'system_accent3_100', Palette.tertiary90],
    dark: ['system_tertiary_fixed', 'system_accent3_100', Palette.tertiary90],
  },
  {
    role: 'tertiaryFixedDim',
    light: [
      'system_tertiary_fixed_dim',
      'system_accent3_200',
      Palette.tertiary80,
    ],
    dark: [
      'system_tertiary_fixed_dim',
      'system_accent3_200',
      Palette.tertiary80,
    ],
  },
  {
    role: 'onTertiaryFixed',
    light: [
      'system_on_tertiary_fixed',
      'system_accent3_900',
      Palette.tertiary10,
    ],
    dark: [
      'system_on_tertiary_fixed',
      'system_accent3_900',
      Palette.tertiary10,
    ],
  },
  {
    role: 'onTertiaryFixedVariant',
    light: [
      'system_on_tertiary_fixed_variant',
      'system_accent3_700',
      Palette.tertiary30,
    ],
    dark: [
      'system_on_tertiary_fixed_variant',
      'system_accent3_700',
      Palette.tertiary30,
    ],
  },
];

function buildDynamicColors(scheme: 'light' | 'dark'): Partial<ThemeColors> {
  return Object.fromEntries(
    colorRoleMap.map(({ role, [scheme]: [api34, api31, ref] }) => [
      role,
      pick(api34, api31, ref),
    ])
  ) as Partial<ThemeColors>;
}

export const isDynamicColorSupported = apiLevel >= 31;

const lightDynamicColors = isDynamicColorSupported
  ? buildDynamicColors('light')
  : undefined;
const darkDynamicColors = isDynamicColorSupported
  ? buildDynamicColors('dark')
  : undefined;

export const DynamicLightTheme: Theme = {
  ...LightTheme,
  colors: { ...LightTheme.colors, ...lightDynamicColors },
};

export const DynamicDarkTheme: Theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, ...darkDynamicColors },
};
