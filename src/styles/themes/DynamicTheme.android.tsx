import { Platform, PlatformColor } from 'react-native';

import { MD3DarkTheme } from './DarkTheme';
import { MD3LightTheme } from './LightTheme';
import type { MD3Theme } from '../../types';

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
    MD3LightTheme.colors.primary
  ),
  onPrimary: pick(
    'system_on_primary_light',
    'system_accent1_0',
    MD3LightTheme.colors.onPrimary
  ),
  primaryContainer: pick(
    'system_primary_container_light',
    'system_accent1_100',
    MD3LightTheme.colors.primaryContainer
  ),
  onPrimaryContainer: pick(
    'system_on_primary_container_light',
    'system_accent1_900',
    MD3LightTheme.colors.onPrimaryContainer
  ),
  inversePrimary: pick(
    'system_primary_dark',
    'system_accent1_200',
    MD3LightTheme.colors.inversePrimary
  ),
  secondary: pick(
    'system_secondary_light',
    'system_accent2_600',
    MD3LightTheme.colors.secondary
  ),
  onSecondary: pick(
    'system_on_secondary_light',
    'system_accent2_0',
    MD3LightTheme.colors.onSecondary
  ),
  secondaryContainer: pick(
    'system_secondary_container_light',
    'system_accent2_100',
    MD3LightTheme.colors.secondaryContainer
  ),
  onSecondaryContainer: pick(
    'system_on_secondary_container_light',
    'system_accent2_900',
    MD3LightTheme.colors.onSecondaryContainer
  ),
  tertiary: pick(
    'system_tertiary_light',
    'system_accent3_600',
    MD3LightTheme.colors.tertiary
  ),
  onTertiary: pick(
    'system_on_tertiary_light',
    'system_accent3_0',
    MD3LightTheme.colors.onTertiary
  ),
  tertiaryContainer: pick(
    'system_tertiary_container_light',
    'system_accent3_100',
    MD3LightTheme.colors.tertiaryContainer
  ),
  onTertiaryContainer: pick(
    'system_on_tertiary_container_light',
    'system_accent3_900',
    MD3LightTheme.colors.onTertiaryContainer
  ),
  error: pick(
    'system_error_light',
    MD3LightTheme.colors.error,
    MD3LightTheme.colors.error
  ),
  onError: pick(
    'system_on_error_light',
    MD3LightTheme.colors.onError,
    MD3LightTheme.colors.onError
  ),
  errorContainer: pick(
    'system_error_container_light',
    MD3LightTheme.colors.errorContainer,
    MD3LightTheme.colors.errorContainer
  ),
  onErrorContainer: pick(
    'system_on_error_container_light',
    MD3LightTheme.colors.onErrorContainer,
    MD3LightTheme.colors.onErrorContainer
  ),
  onSurface: pick(
    'system_on_surface_light',
    'system_neutral1_900',
    MD3LightTheme.colors.onSurface
  ),
  onBackground: pick(
    'system_on_background_light',
    'system_neutral1_900',
    MD3LightTheme.colors.onBackground
  ),
  onSurfaceVariant: pick(
    'system_on_surface_variant_light',
    'system_neutral2_700',
    MD3LightTheme.colors.onSurfaceVariant
  ),
  outline: pick(
    'system_outline_light',
    'system_neutral2_500',
    MD3LightTheme.colors.outline
  ),
  outlineVariant: pick(
    'system_outline_variant_light',
    'system_neutral2_200',
    MD3LightTheme.colors.outlineVariant
  ),
  inverseSurface: pick(
    'system_surface_dark',
    'system_neutral1_800',
    MD3LightTheme.colors.inverseSurface
  ),
  inverseOnSurface: pick(
    'system_on_surface_dark',
    'system_neutral1_50',
    MD3LightTheme.colors.inverseOnSurface
  ),
  surfaceContainerLowest: pick(
    'system_surface_container_lowest_light',
    'system_neutral2_0',
    MD3LightTheme.colors.surfaceContainerLowest
  ),
  surfaceContainerLow: pick(
    'system_surface_container_low_light',
    MD3LightTheme.colors.surfaceContainerLow,
    MD3LightTheme.colors.surfaceContainerLow
  ),
  surfaceContainerHighest: pick(
    'system_surface_container_highest_light',
    'system_neutral2_100',
    MD3LightTheme.colors.surfaceContainerHighest
  ),
  surface: pick(
    'system_surface_light',
    MD3LightTheme.colors.surface,
    MD3LightTheme.colors.surface
  ),
  surfaceDim: pick(
    'system_surface_dim_light',
    MD3LightTheme.colors.surfaceDim,
    MD3LightTheme.colors.surfaceDim
  ),
  surfaceBright: pick(
    'system_surface_bright_light',
    MD3LightTheme.colors.surfaceBright,
    MD3LightTheme.colors.surfaceBright
  ),
  surfaceContainer: pick(
    'system_surface_container_light',
    MD3LightTheme.colors.surfaceContainer,
    MD3LightTheme.colors.surfaceContainer
  ),
  surfaceContainerHigh: pick(
    'system_surface_container_high_light',
    MD3LightTheme.colors.surfaceContainerHigh,
    MD3LightTheme.colors.surfaceContainerHigh
  ),
  background: pick(
    'system_background_light',
    MD3LightTheme.colors.background,
    MD3LightTheme.colors.background
  ),
  surfaceVariant: pick(
    'system_surface_variant_light',
    MD3LightTheme.colors.surfaceVariant,
    MD3LightTheme.colors.surfaceVariant
  ),
  primaryFixed: pick(
    'system_primary_fixed',
    'system_accent1_100',
    MD3LightTheme.colors.primaryFixed
  ),
  primaryFixedDim: pick(
    'system_primary_fixed_dim',
    'system_accent1_200',
    MD3LightTheme.colors.primaryFixedDim
  ),
  onPrimaryFixed: pick(
    'system_on_primary_fixed',
    'system_accent1_900',
    MD3LightTheme.colors.onPrimaryFixed
  ),
  onPrimaryFixedVariant: pick(
    'system_on_primary_fixed_variant',
    'system_accent1_700',
    MD3LightTheme.colors.onPrimaryFixedVariant
  ),
  secondaryFixed: pick(
    'system_secondary_fixed',
    'system_accent2_100',
    MD3LightTheme.colors.secondaryFixed
  ),
  secondaryFixedDim: pick(
    'system_secondary_fixed_dim',
    'system_accent2_200',
    MD3LightTheme.colors.secondaryFixedDim
  ),
  onSecondaryFixed: pick(
    'system_on_secondary_fixed',
    'system_accent2_900',
    MD3LightTheme.colors.onSecondaryFixed
  ),
  onSecondaryFixedVariant: pick(
    'system_on_secondary_fixed_variant',
    'system_accent2_700',
    MD3LightTheme.colors.onSecondaryFixedVariant
  ),
  tertiaryFixed: pick(
    'system_tertiary_fixed',
    'system_accent3_100',
    MD3LightTheme.colors.tertiaryFixed
  ),
  tertiaryFixedDim: pick(
    'system_tertiary_fixed_dim',
    'system_accent3_200',
    MD3LightTheme.colors.tertiaryFixedDim
  ),
  onTertiaryFixed: pick(
    'system_on_tertiary_fixed',
    'system_accent3_900',
    MD3LightTheme.colors.onTertiaryFixed
  ),
  onTertiaryFixedVariant: pick(
    'system_on_tertiary_fixed_variant',
    'system_accent3_700',
    MD3LightTheme.colors.onTertiaryFixedVariant
  ),
};

const darkColors = {
  primary: pick(
    'system_primary_dark',
    'system_accent1_200',
    MD3DarkTheme.colors.primary
  ),
  onPrimary: pick(
    'system_on_primary_dark',
    'system_accent1_800',
    MD3DarkTheme.colors.onPrimary
  ),
  primaryContainer: pick(
    'system_primary_container_dark',
    'system_accent1_700',
    MD3DarkTheme.colors.primaryContainer
  ),
  onPrimaryContainer: pick(
    'system_on_primary_container_dark',
    'system_accent1_100',
    MD3DarkTheme.colors.onPrimaryContainer
  ),
  inversePrimary: pick(
    'system_primary_light',
    'system_accent1_600',
    MD3DarkTheme.colors.inversePrimary
  ),
  secondary: pick(
    'system_secondary_dark',
    'system_accent2_200',
    MD3DarkTheme.colors.secondary
  ),
  onSecondary: pick(
    'system_on_secondary_dark',
    'system_accent2_800',
    MD3DarkTheme.colors.onSecondary
  ),
  secondaryContainer: pick(
    'system_secondary_container_dark',
    'system_accent2_700',
    MD3DarkTheme.colors.secondaryContainer
  ),
  onSecondaryContainer: pick(
    'system_on_secondary_container_dark',
    'system_accent2_100',
    MD3DarkTheme.colors.onSecondaryContainer
  ),
  tertiary: pick(
    'system_tertiary_dark',
    'system_accent3_200',
    MD3DarkTheme.colors.tertiary
  ),
  onTertiary: pick(
    'system_on_tertiary_dark',
    'system_accent3_800',
    MD3DarkTheme.colors.onTertiary
  ),
  tertiaryContainer: pick(
    'system_tertiary_container_dark',
    'system_accent3_700',
    MD3DarkTheme.colors.tertiaryContainer
  ),
  onTertiaryContainer: pick(
    'system_on_tertiary_container_dark',
    'system_accent3_100',
    MD3DarkTheme.colors.onTertiaryContainer
  ),
  error: pick(
    'system_error_dark',
    MD3DarkTheme.colors.error,
    MD3DarkTheme.colors.error
  ),
  onError: pick(
    'system_on_error_dark',
    MD3DarkTheme.colors.onError,
    MD3DarkTheme.colors.onError
  ),
  errorContainer: pick(
    'system_error_container_dark',
    MD3DarkTheme.colors.errorContainer,
    MD3DarkTheme.colors.errorContainer
  ),
  onErrorContainer: pick(
    'system_on_error_container_dark',
    MD3DarkTheme.colors.onErrorContainer,
    MD3DarkTheme.colors.onErrorContainer
  ),
  onSurface: pick(
    'system_on_surface_dark',
    'system_neutral1_100',
    MD3DarkTheme.colors.onSurface
  ),
  onBackground: pick(
    'system_on_background_dark',
    'system_neutral1_100',
    MD3DarkTheme.colors.onBackground
  ),
  onSurfaceVariant: pick(
    'system_on_surface_variant_dark',
    'system_neutral2_200',
    MD3DarkTheme.colors.onSurfaceVariant
  ),
  outline: pick(
    'system_outline_dark',
    'system_neutral2_400',
    MD3DarkTheme.colors.outline
  ),
  outlineVariant: pick(
    'system_outline_variant_dark',
    'system_neutral2_700',
    MD3DarkTheme.colors.outlineVariant
  ),
  inverseSurface: pick(
    'system_surface_light',
    'system_neutral1_100',
    MD3DarkTheme.colors.inverseSurface
  ),
  inverseOnSurface: pick(
    'system_on_surface_light',
    'system_neutral1_800',
    MD3DarkTheme.colors.inverseOnSurface
  ),
  surfaceContainerLowest: pick(
    'system_surface_container_lowest_dark',
    MD3DarkTheme.colors.surfaceContainerLowest,
    MD3DarkTheme.colors.surfaceContainerLowest
  ),
  surfaceContainerLow: pick(
    'system_surface_container_low_dark',
    'system_neutral2_900',
    MD3DarkTheme.colors.surfaceContainerLow
  ),
  surfaceContainerHighest: pick(
    'system_surface_container_highest_dark',
    MD3DarkTheme.colors.surfaceContainerHighest,
    MD3DarkTheme.colors.surfaceContainerHighest
  ),
  surface: pick(
    'system_surface_dark',
    MD3DarkTheme.colors.surface,
    MD3DarkTheme.colors.surface
  ),
  surfaceDim: pick(
    'system_surface_dim_dark',
    MD3DarkTheme.colors.surfaceDim,
    MD3DarkTheme.colors.surfaceDim
  ),
  surfaceBright: pick(
    'system_surface_bright_dark',
    MD3DarkTheme.colors.surfaceBright,
    MD3DarkTheme.colors.surfaceBright
  ),
  surfaceContainer: pick(
    'system_surface_container_dark',
    MD3DarkTheme.colors.surfaceContainer,
    MD3DarkTheme.colors.surfaceContainer
  ),
  surfaceContainerHigh: pick(
    'system_surface_container_high_dark',
    MD3DarkTheme.colors.surfaceContainerHigh,
    MD3DarkTheme.colors.surfaceContainerHigh
  ),
  background: pick(
    'system_background_dark',
    MD3DarkTheme.colors.background,
    MD3DarkTheme.colors.background
  ),
  surfaceVariant: pick(
    'system_surface_variant_dark',
    MD3DarkTheme.colors.surfaceVariant,
    MD3DarkTheme.colors.surfaceVariant
  ),
  primaryFixed: pick(
    'system_primary_fixed',
    'system_accent1_100',
    MD3DarkTheme.colors.primaryFixed
  ),
  primaryFixedDim: pick(
    'system_primary_fixed_dim',
    'system_accent1_200',
    MD3DarkTheme.colors.primaryFixedDim
  ),
  onPrimaryFixed: pick(
    'system_on_primary_fixed',
    'system_accent1_900',
    MD3DarkTheme.colors.onPrimaryFixed
  ),
  onPrimaryFixedVariant: pick(
    'system_on_primary_fixed_variant',
    'system_accent1_700',
    MD3DarkTheme.colors.onPrimaryFixedVariant
  ),
  secondaryFixed: pick(
    'system_secondary_fixed',
    'system_accent2_100',
    MD3DarkTheme.colors.secondaryFixed
  ),
  secondaryFixedDim: pick(
    'system_secondary_fixed_dim',
    'system_accent2_200',
    MD3DarkTheme.colors.secondaryFixedDim
  ),
  onSecondaryFixed: pick(
    'system_on_secondary_fixed',
    'system_accent2_900',
    MD3DarkTheme.colors.onSecondaryFixed
  ),
  onSecondaryFixedVariant: pick(
    'system_on_secondary_fixed_variant',
    'system_accent2_700',
    MD3DarkTheme.colors.onSecondaryFixedVariant
  ),
  tertiaryFixed: pick(
    'system_tertiary_fixed',
    'system_accent3_100',
    MD3DarkTheme.colors.tertiaryFixed
  ),
  tertiaryFixedDim: pick(
    'system_tertiary_fixed_dim',
    'system_accent3_200',
    MD3DarkTheme.colors.tertiaryFixedDim
  ),
  onTertiaryFixed: pick(
    'system_on_tertiary_fixed',
    'system_accent3_900',
    MD3DarkTheme.colors.onTertiaryFixed
  ),
  onTertiaryFixedVariant: pick(
    'system_on_tertiary_fixed_variant',
    'system_accent3_700',
    MD3DarkTheme.colors.onTertiaryFixedVariant
  ),
};

export const MD3DynamicLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, ...lightColors },
};

export const MD3DynamicDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...darkColors },
};
