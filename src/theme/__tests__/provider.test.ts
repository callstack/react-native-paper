import { isPlatformColorSentinel, safeMerge } from '../provider';

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
