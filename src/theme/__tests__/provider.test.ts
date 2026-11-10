import * as React from 'react';
import { PlatformColor } from 'react-native';

import { describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import {
  isPlatformColorSentinel,
  safeMerge,
  ThemeProvider,
  useInternalTheme,
  useTheme,
  withoutUnsafeKeys,
} from '../provider';
import { DarkTheme, LightTheme } from '../schemes';
import type { Theme, ThemeProp } from '../types';

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

  it('ignores a top-level __proto__ key', () => {
    const overrides = JSON.parse('{"__proto__": {"polluted": "yes"}, "a": 2}');

    const result = safeMerge<Record<string, unknown>>({ a: 1 }, overrides);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result).toEqual({ a: 2 });
    expect(result.polluted).toBeUndefined();
    const fresh: Record<string, unknown> = {};
    expect(fresh.polluted).toBeUndefined();
  });

  it('ignores a nested __proto__ key', () => {
    const base = { colors: { primary: 'blue', secondary: 'green' } };
    const overrides = JSON.parse(
      '{"colors": {"__proto__": {"polluted": "yes"}, "primary": "red"}}'
    );

    const result = safeMerge<{ colors: Record<string, unknown> }>(
      base,
      overrides
    );
    expect(Object.getPrototypeOf(result.colors)).toBe(Object.prototype);
    expect(result.colors.primary).toBe('red');
    expect(result.colors.secondary).toBe('green');
    expect(result.colors.polluted).toBeUndefined();
  });

  it('skips constructor and prototype keys', () => {
    const overrides = JSON.parse(
      '{"constructor": {"x": 1}, "prototype": {"y": 2}, "a": 2}'
    );

    const result = safeMerge<Record<string, unknown>>({ a: 1 }, overrides);
    expect(Object.prototype.hasOwnProperty.call(result, 'constructor')).toBe(
      false
    );
    expect(Object.prototype.hasOwnProperty.call(result, 'prototype')).toBe(
      false
    );
    expect(result.constructor).toBe(Object);
    expect(result).toEqual({ a: 2 });
  });

  it('ignores a __proto__ key inside a new override subtree', () => {
    const overrides = JSON.parse(
      '{"extra": {"__proto__": {"polluted": "yes"}, "b": 2}}'
    );

    const result = safeMerge<{ a: number; extra?: Record<string, unknown> }>(
      { a: 1 },
      overrides
    );
    expect(Object.getPrototypeOf(result.extra)).toBe(Object.prototype);
    expect(
      Object.prototype.hasOwnProperty.call(result.extra, '__proto__')
    ).toBe(false);
    expect(result.extra?.polluted).toBeUndefined();
    expect(result.extra).toEqual({ b: 2 });
  });
});

describe('useInternalTheme', () => {
  it('returns the default theme without overrides', async () => {
    const { result } = await renderHook(() => useInternalTheme(undefined));

    expect(result.current).toBe(LightTheme);
  });

  it('keeps the theme reference when nested overrides have equal values', async () => {
    const { result, rerender } = await renderHook(
      (overrides: ThemeProp) => useInternalTheme(overrides),
      { initialProps: { colors: { primary: '#123456' } } }
    );
    const theme = result.current;

    await rerender({ colors: { primary: '#123456' } });

    expect(result.current).toBe(theme);
    expect(result.current.colors.primary).toBe('#123456');
    expect(result.current.colors.secondary).toBe(LightTheme.colors.secondary);
  });

  it('updates changed overrides and restores defaults when overrides are removed', async () => {
    const { result, rerender } = await renderHook(
      (overrides: ThemeProp | undefined) => useInternalTheme(overrides),
      { initialProps: { colors: { primary: '#123456', secondary: '#abcdef' } } }
    );
    const theme = result.current;

    await rerender({ colors: { primary: '#654321' } });

    expect(result.current).not.toBe(theme);
    expect(result.current.colors.primary).toBe('#654321');
    expect(result.current.colors.secondary).toBe(LightTheme.colors.secondary);

    await rerender(undefined);

    expect(result.current).toBe(LightTheme);
  });

  it('updates the provider theme while keeping local overrides', async () => {
    let theme = LightTheme;
    const wrapper = (props: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, { ...props, theme });
    const { result, rerender } = await renderHook(
      (overrides: ThemeProp) => useInternalTheme(overrides),
      { wrapper, initialProps: { colors: { primary: '#123456' } } }
    );
    const previous = result.current;

    theme = DarkTheme;
    await rerender({ colors: { primary: '#123456' } });

    expect(result.current).not.toBe(previous);
    expect(result.current.dark).toBe(true);
    expect(result.current.colors.primary).toBe('#123456');
    expect(result.current.colors.secondary).toBe(DarkTheme.colors.secondary);
  });

  it('preserves platform colors and keeps equal platform color overrides stable', async () => {
    const primary = PlatformColor('label');
    const { result, rerender } = await renderHook(
      (overrides: ThemeProp) => useInternalTheme(overrides),
      { initialProps: { colors: { primary } } }
    );
    const theme = result.current;

    expect(result.current.colors.primary).toBe(primary);

    await rerender({ colors: { primary: PlatformColor('label') } });

    expect(result.current).toBe(theme);

    await rerender({ colors: { primary: PlatformColor('secondaryLabel') } });

    expect(result.current).not.toBe(theme);
    expect(result.current.colors.primary).toEqual(
      PlatformColor('secondaryLabel')
    );
  });
});

describe('useTheme', () => {
  it('drops prototype keys from overrides parsed from JSON', async () => {
    const overrides = JSON.parse(
      '{"__proto__": {"polluted": "yes"}, "colors": {"__proto__": {"polluted": "yes"}, "secondary": "blue"}}'
    );

    const { result } = await renderHook(() => useTheme<Theme>(overrides));

    for (const value of [result.current, result.current.colors]) {
      expect(Object.getPrototypeOf(value)).toBe(Object.prototype);
      expect(Object.prototype.hasOwnProperty.call(value, '__proto__')).toBe(
        false
      );
      expect(value).not.toHaveProperty('polluted');
    }
    expect(result.current.colors.primary).toBe(LightTheme.colors.primary);
    expect(result.current.colors.secondary).toBe('blue');
    expect(result.current.fonts).toEqual(LightTheme.fonts);
    expect({}).not.toHaveProperty('polluted');
  });

  it('keeps the theme reference while the overrides object stays the same', async () => {
    const overrides = { colors: { primary: '#123456' } };
    const { result, rerender } = await renderHook(() =>
      useTheme<Theme>(overrides)
    );
    const theme = result.current;

    await rerender({});

    expect(result.current).toBe(theme);
    expect(result.current.colors.primary).toBe('#123456');
  });

  it('keeps the theme reference while overrides with a prototype key stay the same', async () => {
    const overrides = JSON.parse(
      '{"__proto__": {"polluted": "yes"}, "colors": {"primary": "#123456"}}'
    );
    const { result, rerender } = await renderHook(() =>
      useTheme<Theme>(overrides)
    );
    const theme = result.current;

    await rerender({});

    expect(result.current).toBe(theme);
    expect(Object.getPrototypeOf(result.current)).toBe(Object.prototype);
    expect(result.current.colors.primary).toBe('#123456');
  });

  it('drops prototype keys from overrides shaped like a PlatformColor', async () => {
    const overrides = JSON.parse(
      '{"semantic": ["label"], "__proto__": {"polluted": "yes"}, "colors": {"primary": {"semantic": ["label"], "__proto__": {"polluted": "yes"}}}}'
    );

    const { result } = await renderHook(() => useTheme<Theme>(overrides));

    for (const value of [result.current, result.current.colors.primary]) {
      expect(Object.getPrototypeOf(value)).toBe(Object.prototype);
      expect(Object.prototype.hasOwnProperty.call(value, '__proto__')).toBe(
        false
      );
      expect(value).not.toHaveProperty('polluted');
    }
    expect(result.current.colors.primary).toEqual({ semantic: ['label'] });
  });

  it('drops prototype keys from objects inside arrays', async () => {
    const overrides = JSON.parse(
      '{"list": [{"__proto__": {"polluted": "yes"}, "a": 1}, "b"]}'
    );

    const { result } = await renderHook(() =>
      useTheme<Theme & { list: unknown[] }>(overrides)
    );

    const [item, other] = result.current.list;
    expect(Object.getPrototypeOf(item)).toBe(Object.prototype);
    expect(item).not.toHaveProperty('polluted');
    expect(item).toEqual({ a: 1 });
    expect(other).toBe('b');
  });
});

describe('withoutUnsafeKeys', () => {
  it('returns values with nothing to drop as they are', () => {
    const values = [
      PlatformColor('label'),
      { dynamic: { light: '#fff', dark: '#000' } },
      { resource_paths: ['@android:color/black'] },
      { colors: { primary: PlatformColor('label') }, list: [{ a: 1 }, 'b'] },
      [{ a: 1 }],
    ];

    for (const value of values) {
      expect(withoutUnsafeKeys(value)).toBe(value);
    }
  });
});
