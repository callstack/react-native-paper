import color from 'color';

import { state } from './state';
import type { ElevationColors, ThemeColors } from '../../types';
import { palette as defaultPalette } from '../ref/palette';

type Palette = typeof defaultPalette;
type PaletteKey = keyof Palette;

/** Roles that map 1:1 to a palette key. Excludes the computed fields. */
type MappedRoles = Omit<ThemeColors, 'stateLayerPressed' | 'elevation'>;

type Contrast = 'standard'; // extend with 'medium' | 'high' when those ship

const roleToTone: Record<
  'light' | 'dark',
  Record<Contrast, Record<keyof MappedRoles, PaletteKey>>
> = {
  light: {
    standard: {
      primary: 'primary40',
      onPrimary: 'primary100',
      primaryContainer: 'primary90',
      onPrimaryContainer: 'primary10',
      secondary: 'secondary40',
      onSecondary: 'secondary100',
      secondaryContainer: 'secondary90',
      onSecondaryContainer: 'secondary10',
      tertiary: 'tertiary40',
      onTertiary: 'tertiary100',
      tertiaryContainer: 'tertiary90',
      onTertiaryContainer: 'tertiary10',
      error: 'error40',
      onError: 'error100',
      errorContainer: 'error90',
      onErrorContainer: 'error10',
      surface: 'neutral98',
      surfaceDim: 'neutral87',
      surfaceBright: 'neutral98',
      surfaceContainerLowest: 'neutral100',
      surfaceContainerLow: 'neutral96',
      surfaceContainer: 'neutral94',
      surfaceContainerHigh: 'neutral92',
      surfaceContainerHighest: 'neutral90',
      surfaceVariant: 'neutralVariant90',
      background: 'neutral98',
      onSurface: 'neutral10',
      onSurfaceVariant: 'neutralVariant30',
      onBackground: 'neutral10',
      outline: 'neutralVariant50',
      outlineVariant: 'neutralVariant80',
      inverseSurface: 'neutral20',
      inverseOnSurface: 'neutral95',
      inversePrimary: 'primary80',
      primaryFixed: 'primary90',
      primaryFixedDim: 'primary80',
      onPrimaryFixed: 'primary10',
      onPrimaryFixedVariant: 'primary30',
      secondaryFixed: 'secondary90',
      secondaryFixedDim: 'secondary80',
      onSecondaryFixed: 'secondary10',
      onSecondaryFixedVariant: 'secondary30',
      tertiaryFixed: 'tertiary90',
      tertiaryFixedDim: 'tertiary80',
      onTertiaryFixed: 'tertiary10',
      onTertiaryFixedVariant: 'tertiary30',
      shadow: 'neutral0',
      scrim: 'neutral0',
    },
  },
  dark: {
    standard: {
      primary: 'primary80',
      onPrimary: 'primary20',
      primaryContainer: 'primary30',
      onPrimaryContainer: 'primary90',
      secondary: 'secondary80',
      onSecondary: 'secondary20',
      secondaryContainer: 'secondary30',
      onSecondaryContainer: 'secondary90',
      tertiary: 'tertiary80',
      onTertiary: 'tertiary20',
      tertiaryContainer: 'tertiary30',
      onTertiaryContainer: 'tertiary90',
      error: 'error80',
      onError: 'error20',
      errorContainer: 'error30',
      onErrorContainer: 'error80',
      surface: 'neutral6',
      surfaceDim: 'neutral6',
      surfaceBright: 'neutral24',
      surfaceContainerLowest: 'neutral4',
      surfaceContainerLow: 'neutral10',
      surfaceContainer: 'neutral12',
      surfaceContainerHigh: 'neutral17',
      surfaceContainerHighest: 'neutral22',
      surfaceVariant: 'neutralVariant30',
      background: 'neutral6',
      onSurface: 'neutral90',
      onSurfaceVariant: 'neutralVariant80',
      onBackground: 'neutral90',
      outline: 'neutralVariant60',
      outlineVariant: 'neutralVariant30',
      inverseSurface: 'neutral90',
      inverseOnSurface: 'neutral20',
      inversePrimary: 'primary40',
      primaryFixed: 'primary90',
      primaryFixedDim: 'primary80',
      onPrimaryFixed: 'primary10',
      onPrimaryFixedVariant: 'primary30',
      secondaryFixed: 'secondary90',
      secondaryFixedDim: 'secondary80',
      onSecondaryFixed: 'secondary10',
      onSecondaryFixedVariant: 'secondary30',
      tertiaryFixed: 'tertiary90',
      tertiaryFixedDim: 'tertiary80',
      onTertiaryFixed: 'tertiary10',
      onTertiaryFixedVariant: 'tertiary30',
      shadow: 'neutral0',
      scrim: 'neutral0',
    },
  },
};

const elevationToTone: Record<
  'light' | 'dark',
  Record<Contrast, Record<Exclude<keyof ElevationColors, 'level0'>, PaletteKey>>
> = {
  light: {
    standard: {
      level1: 'neutral96',
      level2: 'neutral94',
      level3: 'neutral92',
      level4: 'neutral92',
      level5: 'neutral90',
    },
  },
  dark: {
    standard: {
      level1: 'neutral10',
      level2: 'neutral12',
      level3: 'neutral17',
      level4: 'neutral17',
      level5: 'neutral22',
    },
  },
};

export function buildScheme(
  palette: Palette,
  opts: { mode: 'light' | 'dark'; contrast?: Contrast }
): ThemeColors {
  const contrast = opts.contrast ?? 'standard';
  const tones = roleToTone[opts.mode][contrast];
  const elevTones = elevationToTone[opts.mode][contrast];

  const mapped = Object.fromEntries(
    (Object.keys(tones) as Array<keyof typeof tones>).map((role) => [
      role,
      palette[tones[role]],
    ])
  ) as MappedRoles;

  return {
    ...mapped,
    stateLayerPressed: color(palette[tones.onSurface])
      .alpha(state.opacity.pressed)
      .rgb()
      .string(),
    elevation: {
      level0: 'transparent',
      level1: palette[elevTones.level1],
      level2: palette[elevTones.level2],
      level3: palette[elevTones.level3],
      level4: palette[elevTones.level4],
      level5: palette[elevTones.level5],
    },
  };
}
