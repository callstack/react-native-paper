import { describe, expect, it } from '@jest/globals';

import { DarkTheme, LightTheme } from '../../theme/schemes';

/**
 * The MD3 tonal palette is luminance-matched by tone, so a `secondary` ring on
 * any other role at the same tone is ~1:1 and vanishes in greyscale. The ring
 * is drawn outward onto the page background for exactly this reason; these
 * tests pin the surfaces it is allowed to land on.
 *
 * WCAG 1.4.11 Non-text Contrast wants 3:1.
 */
const MIN_RATIO = 3;

const luminance = (rgb: string) => {
  const [r, g, b] = (rgb.match(/\d+/g) ?? []).slice(0, 3).map(Number);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const contrastRatio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe.each([
  ['light', LightTheme],
  ['dark', DarkTheme],
])('focus ring contrast (%s)', (_name, theme) => {
  const ring = String(theme.colors.secondary);

  // Surfaces an outward ring actually lands on.
  const landsOn: (keyof typeof theme.colors)[] = [
    'background',
    'surface',
    'surfaceVariant',
    'secondaryContainer',
  ];
  it.each(landsOn)('has 3:1 against %s', (role) => {
    expect(
      contrastRatio(ring, String(theme.colors[role]))
    ).toBeGreaterThanOrEqual(MIN_RATIO);
  });

  // Guards the reason the ring is outward rather than inward: these are the
  // fills it would sit on top of, and it is invisible against them.
  const wouldVanishOn: (keyof typeof theme.colors)[] = [
    'primary',
    'tertiary',
    'error',
  ];
  it.each(wouldVanishOn)(
    'is documented as unusable inward on the %s fill',
    (role) => {
      expect(contrastRatio(ring, String(theme.colors[role]))).toBeLessThan(
        MIN_RATIO
      );
    }
  );
});
