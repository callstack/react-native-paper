import { DynamicColorIOS, PlatformColor } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { isPlatformColorSentinel, safeMerge } from '../provider';

// Android's `PlatformColor` cannot be exercised here (jest resolves the `.ios`
// platform extension), so its value is spelled out. Shape taken verbatim from
// react-native/Libraries/StyleSheet/PlatformColorValueTypes.android.js.
const androidPlatformColor = { resource_paths: ['@android:color/black'] };

describe('isPlatformColorSentinel', () => {
  it('detects iOS PlatformColor (semantic)', () => {
    expect(isPlatformColorSentinel({ semantic: ['label'] })).toBe(true);
  });

  it('detects iOS DynamicColorIOS (dynamic)', () => {
    expect(
      isPlatformColorSentinel({ dynamic: { light: '#fff', dark: '#000' } })
    ).toBe(true);
  });

  it('detects Android PlatformColor (resource_paths)', () => {
    expect(
      isPlatformColorSentinel({ resource_paths: ['@android:color/black'] })
    ).toBe(true);
  });

  it('detects values produced by the real react-native APIs', () => {
    // Guards against the shape validation below degenerating into
    // "nothing is ever a sentinel", which would let deepmerge corrupt
    // genuine platform colors again.
    expect(isPlatformColorSentinel(PlatformColor('label'))).toBe(true);
    expect(
      isPlatformColorSentinel(DynamicColorIOS({ light: '#fff', dark: '#000' }))
    ).toBe(true);
    expect(
      isPlatformColorSentinel(
        DynamicColorIOS({
          light: '#fff',
          dark: '#000',
          highContrastLight: '#eee',
          highContrastDark: '#111',
        })
      )
    ).toBe(true);
    expect(isPlatformColorSentinel(androidPlatformColor)).toBe(true);
  });

  it('rejects custom theme properties that only reuse a sentinel key name', () => {
    // Extending the theme with arbitrary properties is documented, so a theme
    // is allowed to own a key called `dynamic`, `semantic` or `resource_paths`.
    expect(isPlatformColorSentinel({ dynamic: true })).toBe(false);
    expect(isPlatformColorSentinel({ dynamic: 'auto' })).toBe(false);
    expect(isPlatformColorSentinel({ semantic: 'label' })).toBe(false);
    expect(isPlatformColorSentinel({ semantic: [1, 2] })).toBe(false);
    expect(isPlatformColorSentinel({ resource_paths: true })).toBe(false);
  });

  it('rejects objects that carry a sentinel key alongside other keys', () => {
    // A whole theme is not a platform color, even when one of its properties
    // happens to be shaped like `DynamicColorIOS`'s tuple.
    expect(
      isPlatformColorSentinel({
        dynamic: { light: '#fff', dark: '#000' },
        colors: { primary: 'tomato' },
      })
    ).toBe(false);
    expect(isPlatformColorSentinel({ semantic: ['label'], fonts: {} })).toBe(
      false
    );
  });

  it('rejects `dynamic` values that are not a light/dark tuple', () => {
    expect(isPlatformColorSentinel({ dynamic: {} })).toBe(false);
    expect(isPlatformColorSentinel({ dynamic: { light: '#fff' } })).toBe(false);
    expect(isPlatformColorSentinel({ dynamic: { dark: '#000' } })).toBe(false);
    expect(
      isPlatformColorSentinel({
        dynamic: { light: '#fff', dark: '#000', scale: 1 },
      })
    ).toBe(false);
  });

  it('rejects plain objects, primitives, null, and arrays', () => {
    expect(isPlatformColorSentinel({ primary: '#fff' })).toBe(false);
    expect(isPlatformColorSentinel('#fff')).toBe(false);
    expect(isPlatformColorSentinel(null)).toBe(false);
    expect(isPlatformColorSentinel(undefined)).toBe(false);
    expect(isPlatformColorSentinel([1, 2, 3])).toBe(false);
  });
});

describe('safeMerge', () => {
  it('deep-merges plain objects, overrides win at leaves', () => {
    const base = { a: 1, nested: { x: 1, y: 2 } };
    const overrides = { nested: { y: 20, z: 30 } };

    expect(safeMerge(base, overrides)).toEqual({
      a: 1,
      nested: { x: 1, y: 20, z: 30 },
    });
  });

  it('returns a new object reference (does not mutate base)', () => {
    const base = { nested: { x: 1 } };
    const overrides = { nested: { y: 2 } };
    const result = safeMerge(base, overrides);

    expect(result).not.toBe(base);
    expect(result.nested).not.toBe(base.nested);
    expect(base).toEqual({ nested: { x: 1 } });
  });

  it('falls back to base when overrides is null/undefined', () => {
    const base = { a: 1 };
    expect(safeMerge(base, null)).toEqual(base);
    expect(safeMerge(base, undefined)).toEqual(base);
  });

  it('replaces arrays instead of merging', () => {
    const base = { list: [1, 2, 3] };
    const overrides = { list: [9] };
    expect(safeMerge(base, overrides)).toEqual({ list: [9] });
  });

  it('treats iOS semantic sentinel as a leaf (no recursion into array)', () => {
    const sentinel = { semantic: ['label'] };
    const base = { colors: { primary: '#000' } };
    const overrides = { colors: { primary: sentinel } };

    const result = safeMerge<typeof base & { colors: { primary: unknown } }>(
      base,
      overrides
    );
    expect(result.colors.primary).toBe(sentinel);
  });

  it('treats DynamicColorIOS sentinel as a leaf', () => {
    const sentinel = { dynamic: { light: '#fff', dark: '#000' } };
    const base = { colors: { primary: sentinel } };
    const overrides = { colors: { primary: '#abc' } };

    const result = safeMerge<typeof base & { colors: { primary: unknown } }>(
      base,
      overrides
    );
    expect(result.colors.primary).toBe('#abc');
  });

  it('treats Android resource_paths sentinel as a leaf', () => {
    const sentinelBase = { resource_paths: ['@android:color/black'] };
    const sentinelOverride = { resource_paths: ['@android:color/white'] };
    const base = { colors: { primary: sentinelBase } };
    const overrides = { colors: { primary: sentinelOverride } };

    const result = safeMerge<typeof base & { colors: { primary: unknown } }>(
      base,
      overrides
    );
    expect(result.colors.primary).toBe(sentinelOverride);
  });

  it('keeps the base when overrides own a custom property named `dynamic`', () => {
    const base = {
      fonts: { titleLarge: { fontSize: 22 } },
      colors: { primary: '#000' },
    };
    const overrides = { dynamic: true };

    const result = safeMerge<typeof base & { dynamic?: boolean }>(
      base,
      overrides
    );

    expect(result.fonts).toStrictEqual(base.fonts);
    expect(result.colors).toStrictEqual(base.colors);
    expect(result.dynamic).toBe(true);
  });

  it('still treats a real DynamicColorIOS override as a leaf, not a merge target', () => {
    const baseColor = DynamicColorIOS({
      light: '#000',
      dark: '#111',
      highContrastLight: '#222',
      highContrastDark: '#333',
    });
    const overrideColor = DynamicColorIOS({ light: '#fff', dark: '#eee' });
    const base = { colors: { primary: baseColor } };
    const overrides = { colors: { primary: overrideColor } };

    const result = safeMerge<{ colors: { primary: any } }>(base, overrides);

    // Identity: the override object is passed through untouched...
    expect(result.colors.primary).toBe(overrideColor);
    // ...and nothing was inherited from the base sentinel underneath it.
    expect(result.colors.primary.dynamic.highContrastLight).toBeUndefined();
  });

  it('preserves sentinel siblings when merging a colors map', () => {
    const sentinel = { semantic: ['label'] };
    const base = {
      colors: { primary: sentinel, secondary: '#111', tertiary: '#222' },
    };
    const overrides = { colors: { secondary: '#999' } };

    const result = safeMerge<typeof base & { colors: Record<string, unknown> }>(
      base,
      overrides
    );
    expect(result.colors.primary).toBe(sentinel);
    expect(result.colors.secondary).toBe('#999');
    expect(result.colors.tertiary).toBe('#222');
  });
});
