import { Platform, PlatformColor } from 'react-native';

import { DarkTheme } from './DarkTheme';
import { LightTheme } from './LightTheme';
import type { Theme } from '../types';

const isApi34 = (Platform.Version as number) >= 34;
const isApi31 = (Platform.Version as number) >= 31;

const ac = (name: string) =>
  PlatformColor(`@android:color/${name}`) as unknown as string;

/**
 * Picks the correct color value for the current Android API level.
 * - API 34+: uses the named role resource (system_*_light/dark)
 * - API 31-33: uses the tonal accent resource (system_accent*_NNN), or ref
 * - API < 31: uses the reference palette string from the base theme
 * @see https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md
 */
const pick = (api34: string, api31: string, ref: string): string =>
  isApi34 ? ac(api34) : isApi31 && api31 != null ? ac(api31) : ref;

// Known limitation: surface/container roles on API 31-33 use
// @color/m3_ref_palette_dynamic_neutral_variant* (MCL resources that require a
// native DynamicColors setup). No @android:color/ equivalent exists for those
// slots. Reference palette values are used as fallback on API 31-33.

const lightColors = {
  primary: pick(
    'system_primary_light',
    'system_accent1_600',
    LightTheme.colors.primary
  ),
  onPrimary: pick(
    'system_on_primary_light',
    'system_accent1_0',
    LightTheme.colors.onPrimary
  ),
  primaryContainer: pick(
    'system_primary_container_light',
    'system_accent1_100',
    LightTheme.colors.primaryContainer
  ),
  onPrimaryContainer: pick(
    'system_on_primary_container_light',
    'system_accent1_900',
    LightTheme.colors.onPrimaryContainer
  ),
  inversePrimary: pick(
    'system_primary_dark',
    'system_accent1_200',
    LightTheme.colors.inversePrimary
  ),
  secondary: pick(
    'system_secondary_light',
    'system_accent2_600',
    LightTheme.colors.secondary
  ),
  onSecondary: pick(
    'system_on_secondary_light',
    'system_accent2_0',
    LightTheme.colors.onSecondary
  ),
  secondaryContainer: pick(
    'system_secondary_container_light',
    'system_accent2_100',
    LightTheme.colors.secondaryContainer
  ),
  onSecondaryContainer: pick(
    'system_on_secondary_container_light',
    'system_accent2_900',
    LightTheme.colors.onSecondaryContainer
  ),
  tertiary: pick(
    'system_tertiary_light',
    'system_accent3_600',
    LightTheme.colors.tertiary
  ),
  onTertiary: pick(
    'system_on_tertiary_light',
    'system_accent3_0',
    LightTheme.colors.onTertiary
  ),
  tertiaryContainer: pick(
    'system_tertiary_container_light',
    'system_accent3_100',
    LightTheme.colors.tertiaryContainer
  ),
  onTertiaryContainer: pick(
    'system_on_tertiary_container_light',
    'system_accent3_900',
    LightTheme.colors.onTertiaryContainer
  ),
  error: pick(
    'system_error_light',
    LightTheme.colors.error,
    LightTheme.colors.error
  ),
  onError: pick(
    'system_on_error_light',
    LightTheme.colors.onError,
    LightTheme.colors.onError
  ),
  errorContainer: pick(
    'system_error_container_light',
    LightTheme.colors.errorContainer,
    LightTheme.colors.errorContainer
  ),
  onErrorContainer: pick(
    'system_on_error_container_light',
    LightTheme.colors.onErrorContainer,
    LightTheme.colors.onErrorContainer
  ),
  onSurface: pick(
    'system_on_surface_light',
    'system_neutral1_900',
    LightTheme.colors.onSurface
  ),
  onBackground: pick(
    'system_on_background_light',
    'system_neutral1_900',
    LightTheme.colors.onBackground
  ),
  onSurfaceVariant: pick(
    'system_on_surface_variant_light',
    'system_neutral2_700',
    LightTheme.colors.onSurfaceVariant
  ),
  outline: pick(
    'system_outline_light',
    'system_neutral2_500',
    LightTheme.colors.outline
  ),
  outlineVariant: pick(
    'system_outline_variant_light',
    'system_neutral2_200',
    LightTheme.colors.outlineVariant
  ),
  inverseSurface: pick(
    'system_surface_dark',
    'system_neutral1_800',
    LightTheme.colors.inverseSurface
  ),
  inverseOnSurface: pick(
    'system_on_surface_dark',
    'system_neutral1_50',
    LightTheme.colors.inverseOnSurface
  ),
  surfaceContainerLowest: pick(
    'system_surface_container_lowest_light',
    'system_neutral2_0',
    LightTheme.colors.surfaceContainerLowest
  ),
  surfaceContainerLow: pick(
    'system_surface_container_low_light',
    LightTheme.colors.surfaceContainerLow,
    LightTheme.colors.surfaceContainerLow
  ),
  surfaceContainerHighest: pick(
    'system_surface_container_highest_light',
    'system_neutral2_100',
    LightTheme.colors.surfaceContainerHighest
  ),
  surface: pick(
    'system_surface_light',
    LightTheme.colors.surface,
    LightTheme.colors.surface
  ),
  surfaceDim: pick(
    'system_surface_dim_light',
    LightTheme.colors.surfaceDim,
    LightTheme.colors.surfaceDim
  ),
  surfaceBright: pick(
    'system_surface_bright_light',
    LightTheme.colors.surfaceBright,
    LightTheme.colors.surfaceBright
  ),
  surfaceContainer: pick(
    'system_surface_container_light',
    LightTheme.colors.surfaceContainer,
    LightTheme.colors.surfaceContainer
  ),
  surfaceContainerHigh: pick(
    'system_surface_container_high_light',
    LightTheme.colors.surfaceContainerHigh,
    LightTheme.colors.surfaceContainerHigh
  ),
  background: pick(
    'system_background_light',
    LightTheme.colors.background,
    LightTheme.colors.background
  ),
  surfaceVariant: pick(
    'system_surface_variant_light',
    LightTheme.colors.surfaceVariant,
    LightTheme.colors.surfaceVariant
  ),
  primaryFixed: pick(
    'system_primary_fixed',
    'system_accent1_100',
    LightTheme.colors.primaryFixed
  ),
  primaryFixedDim: pick(
    'system_primary_fixed_dim',
    'system_accent1_200',
    LightTheme.colors.primaryFixedDim
  ),
  onPrimaryFixed: pick(
    'system_on_primary_fixed',
    'system_accent1_900',
    LightTheme.colors.onPrimaryFixed
  ),
  onPrimaryFixedVariant: pick(
    'system_on_primary_fixed_variant',
    'system_accent1_700',
    LightTheme.colors.onPrimaryFixedVariant
  ),
  secondaryFixed: pick(
    'system_secondary_fixed',
    'system_accent2_100',
    LightTheme.colors.secondaryFixed
  ),
  secondaryFixedDim: pick(
    'system_secondary_fixed_dim',
    'system_accent2_200',
    LightTheme.colors.secondaryFixedDim
  ),
  onSecondaryFixed: pick(
    'system_on_secondary_fixed',
    'system_accent2_900',
    LightTheme.colors.onSecondaryFixed
  ),
  onSecondaryFixedVariant: pick(
    'system_on_secondary_fixed_variant',
    'system_accent2_700',
    LightTheme.colors.onSecondaryFixedVariant
  ),
  tertiaryFixed: pick(
    'system_tertiary_fixed',
    'system_accent3_100',
    LightTheme.colors.tertiaryFixed
  ),
  tertiaryFixedDim: pick(
    'system_tertiary_fixed_dim',
    'system_accent3_200',
    LightTheme.colors.tertiaryFixedDim
  ),
  onTertiaryFixed: pick(
    'system_on_tertiary_fixed',
    'system_accent3_900',
    LightTheme.colors.onTertiaryFixed
  ),
  onTertiaryFixedVariant: pick(
    'system_on_tertiary_fixed_variant',
    'system_accent3_700',
    LightTheme.colors.onTertiaryFixedVariant
  ),
};

const darkColors = {
  primary: pick(
    'system_primary_dark',
    'system_accent1_200',
    DarkTheme.colors.primary
  ),
  onPrimary: pick(
    'system_on_primary_dark',
    'system_accent1_800',
    DarkTheme.colors.onPrimary
  ),
  primaryContainer: pick(
    'system_primary_container_dark',
    'system_accent1_700',
    DarkTheme.colors.primaryContainer
  ),
  onPrimaryContainer: pick(
    'system_on_primary_container_dark',
    'system_accent1_100',
    DarkTheme.colors.onPrimaryContainer
  ),
  inversePrimary: pick(
    'system_primary_light',
    'system_accent1_600',
    DarkTheme.colors.inversePrimary
  ),
  secondary: pick(
    'system_secondary_dark',
    'system_accent2_200',
    DarkTheme.colors.secondary
  ),
  onSecondary: pick(
    'system_on_secondary_dark',
    'system_accent2_800',
    DarkTheme.colors.onSecondary
  ),
  secondaryContainer: pick(
    'system_secondary_container_dark',
    'system_accent2_700',
    DarkTheme.colors.secondaryContainer
  ),
  onSecondaryContainer: pick(
    'system_on_secondary_container_dark',
    'system_accent2_100',
    DarkTheme.colors.onSecondaryContainer
  ),
  tertiary: pick(
    'system_tertiary_dark',
    'system_accent3_200',
    DarkTheme.colors.tertiary
  ),
  onTertiary: pick(
    'system_on_tertiary_dark',
    'system_accent3_800',
    DarkTheme.colors.onTertiary
  ),
  tertiaryContainer: pick(
    'system_tertiary_container_dark',
    'system_accent3_700',
    DarkTheme.colors.tertiaryContainer
  ),
  onTertiaryContainer: pick(
    'system_on_tertiary_container_dark',
    'system_accent3_100',
    DarkTheme.colors.onTertiaryContainer
  ),
  error: pick(
    'system_error_dark',
    DarkTheme.colors.error,
    DarkTheme.colors.error
  ),
  onError: pick(
    'system_on_error_dark',
    DarkTheme.colors.onError,
    DarkTheme.colors.onError
  ),
  errorContainer: pick(
    'system_error_container_dark',
    DarkTheme.colors.errorContainer,
    DarkTheme.colors.errorContainer
  ),
  onErrorContainer: pick(
    'system_on_error_container_dark',
    DarkTheme.colors.onErrorContainer,
    DarkTheme.colors.onErrorContainer
  ),
  onSurface: pick(
    'system_on_surface_dark',
    'system_neutral1_100',
    DarkTheme.colors.onSurface
  ),
  onBackground: pick(
    'system_on_background_dark',
    'system_neutral1_100',
    DarkTheme.colors.onBackground
  ),
  onSurfaceVariant: pick(
    'system_on_surface_variant_dark',
    'system_neutral2_200',
    DarkTheme.colors.onSurfaceVariant
  ),
  outline: pick(
    'system_outline_dark',
    'system_neutral2_400',
    DarkTheme.colors.outline
  ),
  outlineVariant: pick(
    'system_outline_variant_dark',
    'system_neutral2_700',
    DarkTheme.colors.outlineVariant
  ),
  inverseSurface: pick(
    'system_surface_light',
    'system_neutral1_100',
    DarkTheme.colors.inverseSurface
  ),
  inverseOnSurface: pick(
    'system_on_surface_light',
    'system_neutral1_800',
    DarkTheme.colors.inverseOnSurface
  ),
  surfaceContainerLowest: pick(
    'system_surface_container_lowest_dark',
    DarkTheme.colors.surfaceContainerLowest,
    DarkTheme.colors.surfaceContainerLowest
  ),
  surfaceContainerLow: pick(
    'system_surface_container_low_dark',
    'system_neutral2_900',
    DarkTheme.colors.surfaceContainerLow
  ),
  surfaceContainerHighest: pick(
    'system_surface_container_highest_dark',
    DarkTheme.colors.surfaceContainerHighest,
    DarkTheme.colors.surfaceContainerHighest
  ),
  surface: pick(
    'system_surface_dark',
    DarkTheme.colors.surface,
    DarkTheme.colors.surface
  ),
  surfaceDim: pick(
    'system_surface_dim_dark',
    DarkTheme.colors.surfaceDim,
    DarkTheme.colors.surfaceDim
  ),
  surfaceBright: pick(
    'system_surface_bright_dark',
    DarkTheme.colors.surfaceBright,
    DarkTheme.colors.surfaceBright
  ),
  surfaceContainer: pick(
    'system_surface_container_dark',
    DarkTheme.colors.surfaceContainer,
    DarkTheme.colors.surfaceContainer
  ),
  surfaceContainerHigh: pick(
    'system_surface_container_high_dark',
    DarkTheme.colors.surfaceContainerHigh,
    DarkTheme.colors.surfaceContainerHigh
  ),
  background: pick(
    'system_background_dark',
    DarkTheme.colors.background,
    DarkTheme.colors.background
  ),
  surfaceVariant: pick(
    'system_surface_variant_dark',
    DarkTheme.colors.surfaceVariant,
    DarkTheme.colors.surfaceVariant
  ),
  primaryFixed: pick(
    'system_primary_fixed',
    'system_accent1_100',
    DarkTheme.colors.primaryFixed
  ),
  primaryFixedDim: pick(
    'system_primary_fixed_dim',
    'system_accent1_200',
    DarkTheme.colors.primaryFixedDim
  ),
  onPrimaryFixed: pick(
    'system_on_primary_fixed',
    'system_accent1_900',
    DarkTheme.colors.onPrimaryFixed
  ),
  onPrimaryFixedVariant: pick(
    'system_on_primary_fixed_variant',
    'system_accent1_700',
    DarkTheme.colors.onPrimaryFixedVariant
  ),
  secondaryFixed: pick(
    'system_secondary_fixed',
    'system_accent2_100',
    DarkTheme.colors.secondaryFixed
  ),
  secondaryFixedDim: pick(
    'system_secondary_fixed_dim',
    'system_accent2_200',
    DarkTheme.colors.secondaryFixedDim
  ),
  onSecondaryFixed: pick(
    'system_on_secondary_fixed',
    'system_accent2_900',
    DarkTheme.colors.onSecondaryFixed
  ),
  onSecondaryFixedVariant: pick(
    'system_on_secondary_fixed_variant',
    'system_accent2_700',
    DarkTheme.colors.onSecondaryFixedVariant
  ),
  tertiaryFixed: pick(
    'system_tertiary_fixed',
    'system_accent3_100',
    DarkTheme.colors.tertiaryFixed
  ),
  tertiaryFixedDim: pick(
    'system_tertiary_fixed_dim',
    'system_accent3_200',
    DarkTheme.colors.tertiaryFixedDim
  ),
  onTertiaryFixed: pick(
    'system_on_tertiary_fixed',
    'system_accent3_900',
    DarkTheme.colors.onTertiaryFixed
  ),
  onTertiaryFixedVariant: pick(
    'system_on_tertiary_fixed_variant',
    'system_accent3_700',
    DarkTheme.colors.onTertiaryFixedVariant
  ),
};

export const DynamicLightTheme: Theme = {
  ...LightTheme,
  colors: { ...LightTheme.colors, ...lightColors },
};

export const DynamicDarkTheme: Theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, ...darkColors },
};
