import { PlatformColor } from 'react-native';

import { describe, expect, it } from '@jest/globals';
import color from 'color';

import { getTheme } from '../../core/theming';
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
    const theme = getTheme();

    const radius = resolveSplitButtonContainerRadius(theme, 'full', 40);

    expect(radius).toBe(20);
    // Regression guard: 'full' used to resolve through the `cornerFull`
    // sentinel (9999), which triggers RN's corner-overlap correction and
    // silently collapses the paired inner radius too.
    expect(radius).toBeLessThan(9999);
  });

  it('resolves a non-"full" shape from the theme, ignoring container height', () => {
    const theme = getTheme();

    const radius = resolveSplitButtonContainerRadius(theme, 'medium', 999);

    expect(radius).toBe(theme.shapes.corner.medium);
  });
});

describe('getSplitButtonSizeStyle', () => {
  it('resolves the container radius to exactly half the container height', () => {
    const theme = getTheme();

    (
      ['extra-small', 'small', 'medium', 'large', 'extra-large'] as const
    ).forEach((size) => {
      const sizeStyle = getSplitButtonSizeStyle({ size, theme });

      expect(sizeStyle.containerRadius).toBe(sizeStyle.containerHeight / 2);
      expect(sizeStyle.containerRadius).toBeLessThan(9999);
    });
  });

  it('resolves the inner radius from the theme shape corner for the size', () => {
    const theme = getTheme();
    const sizeStyle = getSplitButtonSizeStyle({ size: 'small', theme });

    expect(sizeStyle.innerRadius).toBe(theme.shapes.corner.extraSmall);
  });

  it('returns different inner radii for sizes with different corner shapes', () => {
    const theme = getTheme();
    const small = getSplitButtonSizeStyle({ size: 'small', theme });
    const large = getSplitButtonSizeStyle({ size: 'large', theme });

    expect(small.innerRadius).toBe(theme.shapes.corner.extraSmall);
    expect(large.innerRadius).toBe(theme.shapes.corner.small);
  });
});

describe('getSplitButtonColors', () => {
  it('returns filled mode colors', () => {
    const theme = getTheme();
    const colors = getSplitButtonColors({ theme, mode: 'filled' });

    expect(colors.containerColor).toBe(theme.colors.primary);
    expect(colors.contentColor).toBe(theme.colors.onPrimary);
    expect(colors.borderColor).toBe('transparent');
    expect(colors.borderWidth).toBe(0);
  });

  it('returns tonal mode colors', () => {
    const theme = getTheme();
    const colors = getSplitButtonColors({ theme, mode: 'tonal' });

    expect(colors.containerColor).toBe(theme.colors.secondaryContainer);
    expect(colors.contentColor).toBe(theme.colors.onSecondaryContainer);
  });

  it('returns elevated mode colors', () => {
    const theme = getTheme();
    const colors = getSplitButtonColors({ theme, mode: 'elevated' });

    expect(colors.containerColor).toBe(theme.colors.surfaceContainerLow);
    expect(colors.contentColor).toBe(theme.colors.primary);
  });

  it('returns outlined mode colors with a visible border', () => {
    const theme = getTheme();
    const colors = getSplitButtonColors({ theme, mode: 'outlined' });

    expect(colors.containerColor).toBe('transparent');
    expect(colors.contentColor).toBe(theme.colors.onSurfaceVariant);
    expect(colors.borderColor).toBe(theme.colors.outlineVariant);
    expect(colors.borderWidth).toBe(1);
  });

  it('prefers custom container and text colors when not disabled', () => {
    const theme = getTheme();
    const colors = getSplitButtonColors({
      theme,
      mode: 'filled',
      customButtonColor: '#123456',
      customTextColor: '#abcdef',
    });

    expect(colors.containerColor).toBe('#123456');
    expect(colors.contentColor).toBe('#abcdef');
  });

  it('ignores custom colors when disabled', () => {
    const theme = getTheme();
    const colors = getSplitButtonColors({
      theme,
      mode: 'filled',
      disabled: true,
      customButtonColor: '#123456',
      customTextColor: '#abcdef',
    });

    expect(colors.containerColor).toBe(theme.colors.onSurface);
    expect(colors.contentColor).toBe(theme.colors.onSurface);
  });

  it('fades a disabled filled container instead of using a flat disabled color', () => {
    const theme = getTheme();
    const colors = getSplitButtonColors({
      theme,
      mode: 'filled',
      disabled: true,
    });

    expect(colors.containerColor).toBe(theme.colors.onSurface);
    expect(colors.containerOpacity).toBeLessThan(1);
  });

  it('uses a transparent container for a disabled outlined split button', () => {
    const theme = getTheme();
    const colors = getSplitButtonColors({
      theme,
      mode: 'outlined',
      disabled: true,
    });

    expect(colors.containerColor).toBe('transparent');
    expect(colors.containerOpacity).toBe(1);
  });

  it('dims the outline color for a disabled outlined split button', () => {
    const theme = getTheme();
    const colors = getSplitButtonColors({
      theme,
      mode: 'outlined',
      disabled: true,
    });
    const { onSurface } = theme.colors;
    if (typeof onSurface !== 'string') {
      throw new Error('Expected default theme onSurface to be a string');
    }
    const expectedBorderColor = color(onSurface).alpha(0.12).rgb().string();

    expect(colors.borderColor).toBe(expectedBorderColor);
    expect(colors.borderColor).not.toBe(theme.colors.outlineVariant);
  });

  it('reduces content opacity when disabled', () => {
    const theme = getTheme();
    const enabledColors = getSplitButtonColors({ theme, mode: 'filled' });
    const disabledColors = getSplitButtonColors({
      theme,
      mode: 'filled',
      disabled: true,
    });

    expect(disabledColors.contentOpacity).toBeLessThan(
      enabledColors.contentOpacity
    );
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
