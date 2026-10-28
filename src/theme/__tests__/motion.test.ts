import { describe, expect, it } from '@jest/globals';

import {
  expressiveMotion,
  getTransition,
  standardMotion,
  toSpringCurve,
} from '../tokens/sys/motion';

describe('toSpringCurve', () => {
  const { spring } = expressiveMotion;

  it('starts at 0 and ends at 1', () => {
    const { points } = toSpringCurve(spring.fast.spatial);

    expect(points[0]).toBe(0);
    expect(points[points.length - 1]).toBe(1);
  });

  // A damping ratio of 0.6 overshoots by e^(-π · 0.6 / √(1 - 0.6²)) ≈ 9.5%.
  it('overshoots an underdamped spring by the expected amount', () => {
    const { points } = toSpringCurve(spring.fast.spatial);

    expect(Math.max(...points)).toBeCloseTo(1.095, 1);
  });

  it('never overshoots a critically damped spring', () => {
    const { points } = toSpringCurve(spring.fast.effects);

    expect(Math.max(...points)).toBeLessThanOrEqual(1);
  });

  it('settles a stiffer spring sooner', () => {
    const fast = toSpringCurve(spring.fast.spatial).duration;
    const slow = toSpringCurve(spring.slow.spatial).duration;

    expect(fast).toBeLessThan(slow);
  });

  it('settles the expressive fast spatial spring in about 400 ms', () => {
    expect(toSpringCurve(spring.fast.spatial).duration).toBeCloseTo(407, -1);
  });

  it('settles the standard fast spatial spring sooner', () => {
    expect(
      toSpringCurve(standardMotion.spring.fast.spatial).duration
    ).toBeLessThan(toSpringCurve(spring.fast.spatial).duration);
  });
});

const theme = { motion: expressiveMotion, animation: { scale: 1 } };

describe('getTransition', () => {
  it('passes the property through unchanged for a single property', () => {
    expect(
      getTransition(theme, 'opacity', 'short3', 'standard', false)
    ).toMatchObject({ transitionProperty: 'opacity' });
  });

  it('passes the property through unchanged for multiple properties', () => {
    expect(
      getTransition(theme, ['width', 'opacity'], 'short3', 'standard', false)
    ).toMatchObject({ transitionProperty: ['width', 'opacity'] });
  });

  it('reads the duration from the given token', () => {
    expect(
      getTransition(theme, 'opacity', 'short2', 'standard', false)
        .transitionDuration
    ).toBe(expressiveMotion.duration.short2);
  });

  it('zeroes the duration when reduceMotion is set, regardless of the token', () => {
    expect(
      getTransition(theme, 'opacity', 'short2', 'standard', true)
        .transitionDuration
    ).toBe(0);
  });

  it('multiplies the duration by theme.animation.scale', () => {
    const scaledTheme = { motion: expressiveMotion, animation: { scale: 2 } };

    expect(
      getTransition(scaledTheme, 'opacity', 'short2', 'standard', false)
        .transitionDuration
    ).toBe(expressiveMotion.duration.short2 * 2);
  });

  it('gives a duration of 0 when theme.animation.scale is 0', () => {
    const frozenTheme = { motion: expressiveMotion, animation: { scale: 0 } };

    expect(
      getTransition(frozenTheme, 'opacity', 'short2', 'standard', false)
        .transitionDuration
    ).toBe(0);
  });

  it('builds a cubicBezier timing function from the given easing token', () => {
    const { transitionTimingFunction } = getTransition(
      theme,
      'opacity',
      'short3',
      'standardAccelerate',
      false
    );

    expect(transitionTimingFunction?.toString()).toBe(
      `cubicBezier(${expressiveMotion.easing.standardAccelerate.join(', ')})`
    );
  });
});
