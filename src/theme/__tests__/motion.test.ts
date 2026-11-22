import { describe, expect, it } from '@jest/globals';

import {
  expressiveMotion,
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
