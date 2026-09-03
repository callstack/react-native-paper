import { describe, expect, it } from '@jest/globals';
import color from 'color';

import { createTheme } from '../schemes/createTheme';
import { DarkTheme } from '../schemes/DarkTheme';
import { LightTheme } from '../schemes/LightTheme';
import { palette } from '../tokens/ref/palette';
import { buildScheme } from '../tokens/sys/color';
import type { ContrastLevel, ThemeColors } from '../types';

const MODES = ['light', 'dark'] as const;
const NON_STANDARD = ['medium', 'high'] as const satisfies ContrastLevel[];

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
      const { colors } = createTheme({ dark: mode === 'dark', contrast });
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
        const isDark = mode === 'dark';
        const standard = createTheme({ dark: isDark }).colors;
        const raised = createTheme({ dark: isDark, contrast }).colors;

        expect(ratio(raised.onPrimary, raised.primary)).toBeGreaterThan(
          ratio(standard.onPrimary, standard.primary)
        );
      }
    );
  });

  it('derives the pressed state layer from the scheme onSurface', () => {
    const { colors } = createTheme({ contrast: 'high' });

    expect(colors.stateLayerPressed).toBe(
      asColor(colors.onSurface).alpha(0.1).rgb().string()
    );
    expect(colors.stateLayerPressed).not.toBe(
      LightTheme.colors.stateLayerPressed
    );
  });

  it('keeps elevation level0 transparent', () => {
    NON_STANDARD.forEach((contrast) => {
      expect(createTheme({ contrast }).colors.elevation.level0).toBe(
        'transparent'
      );
    });
  });

  it('defaults to standard, leaving the built-in themes unchanged', () => {
    expect(createTheme({ dark: false }).colors).toStrictEqual(
      LightTheme.colors
    );
    expect(createTheme({ dark: true }).colors).toStrictEqual(DarkTheme.colors);
    expect(LightTheme.contrast).toBe('standard');
    expect(DarkTheme.contrast).toBe('standard');
  });
});
