import { PlatformColor } from 'react-native';

import { describe, expect, it } from '@jest/globals';
import color from 'color';

import { LightTheme } from '../../theme/schemes';
import {
  getSplitButtonColors,
  getSplitButtonHitSlop,
  getSplitButtonLeadingShape,
  getSplitButtonRippleColor,
  getSplitButtonSizeStyle,
  getSplitButtonTrailingShape,
  resolveSplitButtonContainerRadius,
} from '../SplitButton/utils';

describe('resolveSplitButtonContainerRadius', () => {
  it('resolves a "full" shape to exactly half the container height, not the corner-overlap sentinel', () => {
    const radius = resolveSplitButtonContainerRadius(LightTheme, 'full', 40);

    expect(radius).toBe(20);
    // Regression guard: 'full' used to resolve through the `cornerFull`
    // sentinel (9999), which triggers RN's corner-overlap correction and
    // silently collapses the paired inner radius too.
    expect(radius).toBeLessThan(9999);
  });

  it('resolves a non-"full" shape from the theme, ignoring container height', () => {
    const radius = resolveSplitButtonContainerRadius(LightTheme, 'medium', 999);

    expect(radius).toBe(LightTheme.shapes.corner.medium);
  });
});

describe('getSplitButtonSizeStyle', () => {
  it('resolves the container radius to exactly half the container height', () => {
    (
      ['extra-small', 'small', 'medium', 'large', 'extra-large'] as const
    ).forEach((size) => {
      const sizeStyle = getSplitButtonSizeStyle({ size, theme: LightTheme });

      expect(sizeStyle.containerRadius).toBe(sizeStyle.containerHeight / 2);
      expect(sizeStyle.containerRadius).toBeLessThan(9999);
    });
  });

  it('resolves the inner radius from the theme shape corner for the size', () => {
    const sizeStyle = getSplitButtonSizeStyle({
      size: 'small',
      theme: LightTheme,
    });

    expect(sizeStyle.innerRadius).toBe(LightTheme.shapes.corner.extraSmall);
  });

  it('returns different inner radii for sizes with different corner shapes', () => {
    const small = getSplitButtonSizeStyle({ size: 'small', theme: LightTheme });
    const large = getSplitButtonSizeStyle({ size: 'large', theme: LightTheme });

    expect(small.innerRadius).toBe(LightTheme.shapes.corner.extraSmall);
    expect(large.innerRadius).toBe(LightTheme.shapes.corner.small);
  });
});

describe('getSplitButtonColors', () => {
  it('returns filled mode colors', () => {
    const { enabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'filled',
    });

    expect(enabled.containerColor).toBe(LightTheme.colors.primary);
    expect(enabled.contentColor).toBe(LightTheme.colors.onPrimary);
    expect(enabled.borderColor).toBe('transparent');
    expect(enabled.borderWidth).toBe(0);
  });

  it('returns tonal mode colors', () => {
    const { enabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'tonal',
    });

    expect(enabled.containerColor).toBe(LightTheme.colors.secondaryContainer);
    expect(enabled.contentColor).toBe(LightTheme.colors.onSecondaryContainer);
  });

  it('returns elevated mode colors', () => {
    const { enabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'elevated',
    });

    expect(enabled.containerColor).toBe(LightTheme.colors.surfaceContainerLow);
    expect(enabled.contentColor).toBe(LightTheme.colors.primary);
  });

  it('returns outlined mode colors with a visible border', () => {
    const { enabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'outlined',
    });

    expect(enabled.containerColor).toBe('transparent');
    expect(enabled.contentColor).toBe(LightTheme.colors.onSurfaceVariant);
    expect(enabled.borderColor).toBe(LightTheme.colors.outlineVariant);
    expect(enabled.borderWidth).toBe(1);
  });

  it('prefers custom container and text colors when not disabled', () => {
    const { enabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'filled',
      customButtonColor: '#123456',
      customTextColor: '#abcdef',
    });

    expect(enabled.containerColor).toBe('#123456');
    expect(enabled.contentColor).toBe('#abcdef');
  });

  it('ignores custom colors when disabled', () => {
    const { disabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'filled',
      customButtonColor: '#123456',
      customTextColor: '#abcdef',
    });

    expect(disabled.containerColor).toBe(LightTheme.colors.onSurface);
    expect(disabled.contentColor).toBe(LightTheme.colors.onSurface);
  });

  it('fades a disabled filled container instead of using a flat disabled color', () => {
    const { disabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'filled',
    });

    expect(disabled.containerColor).toBe(LightTheme.colors.onSurface);
    expect(disabled.containerOpacity).toBeLessThan(1);
  });

  it('shares the same disabled onSurface treatment across filled, tonal, and elevated', () => {
    (['filled', 'tonal', 'elevated'] as const).forEach((mode) => {
      const { disabled } = getSplitButtonColors({ theme: LightTheme, mode });

      expect(disabled.containerColor).toBe(LightTheme.colors.onSurface);
      expect(disabled.contentColor).toBe(LightTheme.colors.onSurface);
      expect(disabled.containerOpacity).toBe(0.1);
      expect(disabled.contentOpacity).toBe(0.38);
    });
  });

  it('uses a transparent container for a disabled outlined split button', () => {
    const { disabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'outlined',
    });

    expect(disabled.containerColor).toBe('transparent');
    expect(disabled.containerOpacity).toBe(1);
  });

  it('keeps the outline color at full opacity for a disabled outlined split button', () => {
    const { disabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'outlined',
    });

    expect(disabled.borderColor).toBe(LightTheme.colors.outlineVariant);
  });

  it('uses onSurface content color for a disabled outlined split button', () => {
    const { disabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'outlined',
    });

    expect(disabled.contentColor).toBe(LightTheme.colors.onSurface);
  });

  it('only grants elevation to an enabled elevated split button', () => {
    (['elevated', 'filled', 'tonal', 'outlined'] as const).forEach((mode) => {
      const { enabled, disabled } = getSplitButtonColors({
        theme: LightTheme,
        mode,
      });

      expect(enabled.elevation).toBe(mode === 'elevated' ? 1 : 0);
      expect(disabled.elevation).toBe(0);
    });
  });

  it('reduces content opacity when disabled', () => {
    const { enabled, disabled } = getSplitButtonColors({
      theme: LightTheme,
      mode: 'filled',
    });

    expect(disabled.contentOpacity).toBeLessThan(enabled.contentOpacity);
  });
});

describe('getSplitButtonRippleColor', () => {
  it('derives a translucent ripple color from the content color', () => {
    const rippleColor = getSplitButtonRippleColor({
      contentColor: '#ffffff',
    });

    expect(rippleColor).toBe(color('#ffffff').alpha(0.1).rgb().string());
  });

  it('prefers a custom ripple color when provided', () => {
    const rippleColor = getSplitButtonRippleColor({
      contentColor: '#ffffff',
      customRippleColor: '#ff0000',
    });

    expect(rippleColor).toBe('#ff0000');
  });

  it('returns undefined when the content color is not a string', () => {
    const rippleColor = getSplitButtonRippleColor({
      contentColor: PlatformColor('label'),
    });

    expect(rippleColor).toBeUndefined();
  });
});

describe('getSplitButtonHitSlop', () => {
  it('pads small sizes up to the minimum interactive size', () => {
    const hitSlop = getSplitButtonHitSlop({ size: 'small' });

    expect(hitSlop).toEqual({ top: 4, bottom: 4 });
  });

  it('pads extra-small sizes further, since they are further from the minimum', () => {
    const hitSlop = getSplitButtonHitSlop({ size: 'extra-small' });

    expect(hitSlop).toEqual({ top: 8, bottom: 8 });
  });

  it('does not add slop for sizes already at or above the minimum', () => {
    const hitSlop = getSplitButtonHitSlop({ size: 'medium' });

    expect(hitSlop).toBeUndefined();
  });

  it('passes a numeric hitSlop through unchanged', () => {
    const hitSlop = getSplitButtonHitSlop({ size: 'small', hitSlop: 10 });

    expect(hitSlop).toBe(10);
  });

  it('does not override explicit top/bottom values in an object hitSlop', () => {
    const hitSlop = getSplitButtonHitSlop({
      size: 'small',
      hitSlop: { top: 1, left: 2 },
    });

    expect(hitSlop).toEqual({ top: 1, left: 2, bottom: 4 });
  });
});

describe('getSplitButtonLeadingShape / getSplitButtonTrailingShape', () => {
  it('rounds the leading segment on the Start side and squares it on the End side', () => {
    const shape = getSplitButtonLeadingShape({
      containerRadius: 20,
      innerRadius: 4,
    });

    expect(shape).toEqual({
      borderTopStartRadius: 20,
      borderBottomStartRadius: 20,
      borderTopEndRadius: 4,
      borderBottomEndRadius: 4,
    });
  });

  it('rounds the trailing segment on the End side and squares it on the Start side', () => {
    const shape = getSplitButtonTrailingShape({
      containerRadius: 20,
      innerRadius: 4,
    });

    expect(shape).toEqual({
      borderTopStartRadius: 4,
      borderBottomStartRadius: 4,
      borderTopEndRadius: 20,
      borderBottomEndRadius: 20,
    });
  });

  it('mirrors the leading and trailing shapes around the shared inner edge', () => {
    const leading = getSplitButtonLeadingShape({
      containerRadius: 20,
      innerRadius: 4,
    });
    const trailing = getSplitButtonTrailingShape({
      containerRadius: 20,
      innerRadius: 4,
    });

    expect(leading.borderTopEndRadius).toBe(trailing.borderTopStartRadius);
    expect(leading.borderBottomEndRadius).toBe(
      trailing.borderBottomStartRadius
    );
  });
});
