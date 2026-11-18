import { describe, expect, it } from '@jest/globals';
import color from 'color';

import {
  DarkTheme,
  HighContrastDarkTheme,
  HighContrastLightTheme,
  LightTheme,
  MediumContrastDarkTheme,
  MediumContrastLightTheme,
} from '../schemes';
import { palette } from '../tokens/ref/palette';
import { buildScheme } from '../tokens/sys/color';
import type { ContrastLevel, ThemeColors } from '../types';

const MODES = ['light', 'dark'] as const;
const NON_STANDARD = ['medium', 'high'] as const satisfies ContrastLevel[];

const THEMES = {
  light: {
    standard: LightTheme,
    medium: MediumContrastLightTheme,
    high: HighContrastLightTheme,
  },
  dark: {
    standard: DarkTheme,
    medium: MediumContrastDarkTheme,
    high: HighContrastDarkTheme,
  },
} as const;

/**
 * Text and background role pairs that MD3 requires to be readable.
 * @see https://m3.material.io/styles/color/roles
 */
const CONTRAST_PAIRS: [keyof ThemeColors, keyof ThemeColors][] = [
  ['onPrimary', 'primary'],
  ['onPrimaryContainer', 'primaryContainer'],
  ['onSecondary', 'secondary'],
  ['onSecondaryContainer', 'secondaryContainer'],
  ['onTertiary', 'tertiary'],
  ['onTertiaryContainer', 'tertiaryContainer'],
  ['onError', 'error'],
  ['onErrorContainer', 'errorContainer'],
  ['onSurface', 'surface'],
  ['onSurfaceVariant', 'surfaceVariant'],
  ['onBackground', 'background'],
  ['onSurface', 'surfaceContainer'],
  ['onSurface', 'surfaceContainerHighest'],
  ['inverseOnSurface', 'inverseSurface'],
  ['onPrimaryFixed', 'primaryFixed'],
  ['onSecondaryFixed', 'secondaryFixed'],
  ['onTertiaryFixed', 'tertiaryFixed'],
  ['onPrimaryFixed', 'primaryFixedDim'],
  ['onSecondaryFixed', 'secondaryFixedDim'],
  ['onTertiaryFixed', 'tertiaryFixedDim'],
  ['onPrimaryFixedVariant', 'primaryFixedDim'],
  ['onSecondaryFixedVariant', 'secondaryFixedDim'],
  ['onTertiaryFixedVariant', 'tertiaryFixedDim'],
  ['onPrimaryFixedVariant', 'primaryFixed'],
  ['onSecondaryFixedVariant', 'secondaryFixed'],
  ['onTertiaryFixedVariant', 'tertiaryFixed'],
];

/** WCAG 2.x minimum ratio per MD3 contrast level. */
const WCAG_TARGET: Record<Exclude<ContrastLevel, 'standard'>, number> = {
  medium: 4.5,
  high: 7,
};

/** Theme colors are typed as `ColorValue`, but every built-in scheme uses an
 *  `rgba()` string. Anything else means the scheme is broken. */
const asColor = (value: unknown) => {
  if (typeof value !== 'string') {
    throw new Error(`Expected a color string, received ${typeof value}`);
  }

  return color(value);
};

const ratio = (foreground: unknown, background: unknown) =>
  asColor(foreground).contrast(asColor(background));

describe('contrast levels', () => {
  describe.each(MODES)('%s', (mode) => {
    it.each(NON_STANDARD)('defines every color role at %s', (contrast) => {
      const standard = buildScheme(palette, { mode });
      const scheme = buildScheme(palette, { mode, contrast });

      // Catches a role that is missing from the generated table.
      expect(Object.keys(scheme).sort()).toEqual(Object.keys(standard).sort());

      Object.entries(scheme).forEach(([role, value]) => {
        expect(value).toBeDefined();
        expect(role.length && value).toBeTruthy();
      });

      expect(Object.keys(scheme.elevation).sort()).toEqual(
        Object.keys(standard.elevation).sort()
      );
    });

    it.each(NON_STANDARD)('meets WCAG contrast targets at %s', (contrast) => {
      const { colors } = THEMES[mode][contrast];
      const target = WCAG_TARGET[contrast];

      const failures = CONTRAST_PAIRS.filter(
        ([foreground, background]) =>
          ratio(colors[foreground], colors[background]) < target
      ).map(([foreground, background]) => {
        const value = ratio(colors[foreground], colors[background]);
        return `${foreground} on ${background}: ${value.toFixed(2)} < ${target}`;
      });

      expect(failures).toEqual([]);
    });

    it.each(NON_STANDARD)(
      'raises contrast above standard at %s',
      (contrast) => {
        const standard = THEMES[mode].standard.colors;
        const raised = THEMES[mode][contrast].colors;

        expect(ratio(raised.onPrimary, raised.primary)).toBeGreaterThan(
          ratio(standard.onPrimary, standard.primary)
        );
      }
    );
  });

  it('derives the pressed state layer from the scheme onSurface', () => {
    const { colors } = HighContrastLightTheme;

    expect(colors.stateLayerPressed).toBe(
      asColor(colors.onSurface).alpha(0.1).rgb().string()
    );
    expect(colors.stateLayerPressed).not.toBe(
      LightTheme.colors.stateLayerPressed
    );
  });

  it('keeps the fixed surfaces the same at every contrast level', () => {
    // The fixed surfaces stay put so they can be shared across light and dark.
    // Their `on*FixedVariant` foregrounds still darken to hold the ratio.
    let checked = 0;

    MODES.forEach((mode) => {
      const standard = THEMES[mode].standard.colors;

      NON_STANDARD.forEach((contrast) => {
        const raised = THEMES[mode][contrast].colors;

        const surfacesOf = (colors: ThemeColors) =>
          Object.entries(colors).filter(
            ([role]) => role.includes('Fixed') && !role.startsWith('on')
          );

        const before = surfacesOf(standard);
        checked += before.length;

        expect(surfacesOf(raised)).toStrictEqual(before);
      });
    });

    expect(checked).toBeGreaterThan(0);
  });

  it('keeps the fixed foregrounds readable as contrast rises', () => {
    MODES.forEach((mode) => {
      const standard = THEMES[mode].standard.colors;
      const high = THEMES[mode].high.colors;

      // The variant foreground darkens so it clears 7:1 on the dim surface.
      expect(
        ratio(high.onPrimaryFixedVariant, high.primaryFixedDim)
      ).toBeGreaterThan(
        ratio(standard.onPrimaryFixedVariant, standard.primaryFixedDim)
      );
    });
  });

  it('keeps a container distinct from its base role', () => {
    // A container collapsing onto its base role means the scheme has clipped.
    NON_STANDARD.forEach((contrast) => {
      MODES.forEach((mode) => {
        const { colors } = THEMES[mode][contrast];

        expect(colors.primaryContainer).not.toBe(colors.primary);
        expect(colors.secondaryContainer).not.toBe(colors.secondary);
        expect(colors.tertiaryContainer).not.toBe(colors.tertiary);
        expect(colors.errorContainer).not.toBe(colors.error);
        expect(colors.outlineVariant).not.toBe(colors.outline);
      });
    });
  });

  it('keeps elevation level0 transparent', () => {
    NON_STANDARD.forEach((contrast) => {
      expect(THEMES.light[contrast].colors.elevation.level0).toBe(
        'transparent'
      );
    });
  });

  it('leaves the built-in themes at standard contrast', () => {
    expect(LightTheme.colors).toStrictEqual(
      buildScheme(palette, { mode: 'light' })
    );
    expect(DarkTheme.colors).toStrictEqual(
      buildScheme(palette, { mode: 'dark' })
    );
  });
});
