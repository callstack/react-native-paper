import { describe, expect, it } from '@jest/globals';

import { LightTheme } from '../../theme/schemes';
import { getDimensions, resolveColors } from '../FAB/utils';

describe('resolveColors', () => {
  it('returns theme colors for default variant (tonalPrimary)', () => {
    const colors = resolveColors({ theme: LightTheme });
    expect(colors).toEqual({
      container: LightTheme.colors.primaryContainer,
      content: LightTheme.colors.onPrimaryContainer,
    });
  });

  it('returns theme colors for primary variant', () => {
    const colors = resolveColors({ theme: LightTheme, variant: 'primary' });
    expect(colors).toEqual({
      container: LightTheme.colors.primary,
      content: LightTheme.colors.onPrimary,
    });
  });

  it('returns theme colors for secondary variant', () => {
    const colors = resolveColors({ theme: LightTheme, variant: 'secondary' });
    expect(colors).toEqual({
      container: LightTheme.colors.secondary,
      content: LightTheme.colors.onSecondary,
    });
  });

  it('returns theme colors for tertiary variant', () => {
    const colors = resolveColors({ theme: LightTheme, variant: 'tertiary' });
    expect(colors).toEqual({
      container: LightTheme.colors.tertiary,
      content: LightTheme.colors.onTertiary,
    });
  });

  it('returns theme colors for tonalSecondary variant', () => {
    const colors = resolveColors({
      theme: LightTheme,
      variant: 'tonalSecondary',
    });
    expect(colors).toEqual({
      container: LightTheme.colors.secondaryContainer,
      content: LightTheme.colors.onSecondaryContainer,
    });
  });

  it('returns theme colors for tonalTertiary variant', () => {
    const colors = resolveColors({
      theme: LightTheme,
      variant: 'tonalTertiary',
    });
    expect(colors).toEqual({
      container: LightTheme.colors.tertiaryContainer,
      content: LightTheme.colors.onTertiaryContainer,
    });
  });

  it('containerColor override wins over variant', () => {
    const colors = resolveColors({
      theme: LightTheme,
      variant: 'primary',
      containerColor: '#custom',
    });
    expect(colors.container).toBe('#custom');
  });

  it('derives content color from containerColor when contentColor is not set', () => {
    // Use a known theme color so contentColorFor can derive the on-color pairing
    const colors = resolveColors({
      theme: LightTheme,
      containerColor: LightTheme.colors.primary,
    });
    expect(colors.container).toBe(LightTheme.colors.primary);
    expect(colors.content).toBe(LightTheme.colors.onPrimary);
  });

  it('both containerColor and contentColor overrides win', () => {
    const colors = resolveColors({
      theme: LightTheme,
      containerColor: '#bg',
      contentColor: '#fg',
    });
    expect(colors).toEqual({ container: '#bg', content: '#fg' });
  });

  it('contentColor-only override uses variant container', () => {
    const colors = resolveColors({
      theme: LightTheme,
      variant: 'primary',
      contentColor: '#custom',
    });
    expect(colors.container).toBe(LightTheme.colors.primary);
    expect(colors.content).toBe('#custom');
  });
});

describe('getDimensions', () => {
  it('returns correct dimensions for default size', () => {
    const dims = getDimensions({ theme: LightTheme });
    expect(dims.height).toBe(56);
    expect(dims.width).toBe(56);
    expect(dims.iconSize).toBe(24);
    expect(dims.leading).toBe(16);
    expect(dims.trailing).toBe(16);
    expect(dims.iconLabelGap).toBe(8);
    expect(dims.labelTypescale).toBe('titleMedium');
  });

  it('returns correct dimensions for medium size', () => {
    const dims = getDimensions({ theme: LightTheme, size: 'medium' });
    expect(dims.height).toBe(80);
    expect(dims.width).toBe(80);
    expect(dims.iconSize).toBe(28);
    expect(dims.leading).toBe(26);
    expect(dims.trailing).toBe(26);
    expect(dims.iconLabelGap).toBe(12);
    expect(dims.labelTypescale).toBe('titleLarge');
  });

  it('returns correct dimensions for large size', () => {
    const dims = getDimensions({ theme: LightTheme, size: 'large' });
    expect(dims.height).toBe(96);
    expect(dims.width).toBe(96);
    expect(dims.iconSize).toBe(36);
    expect(dims.leading).toBe(30);
    expect(dims.trailing).toBe(30);
    expect(dims.iconLabelGap).toBe(16);
    expect(dims.labelTypescale).toBe('headlineSmall');
  });

  it('shape override changes borderRadius compared to default', () => {
    const defaultDims = getDimensions({ theme: LightTheme });
    const fullDims = getDimensions({ theme: LightTheme, shape: 'full' });
    expect(fullDims.borderRadius).not.toBe(defaultDims.borderRadius);
  });

  it('iconSize override wins over size spec', () => {
    const dims = getDimensions({ theme: LightTheme, iconSize: 32 });
    expect(dims.iconSize).toBe(32);
  });

  it('leading and trailing overrides win over size spec', () => {
    const dims = getDimensions({
      theme: LightTheme,
      leading: 20,
      trailing: 24,
    });
    expect(dims.leading).toBe(20);
    expect(dims.trailing).toBe(24);
  });
});
