import { describe, expect, it } from '@jest/globals';

import { LightTheme } from '../../theme/schemes';
import { toSpringCurve } from '../../theme/tokens/sys/motion';
import { getShapeCurvePoints } from '../useShapeMorph';

describe('getShapeCurvePoints', () => {
  const { points } = toSpringCurve(LightTheme.motion.spring.fast.spatial);
  const cornersOnTheWay = (curve: number[], from: number, to: number) =>
    curve.map((progress) => from + (to - from) * progress);

  it('keeps the corner at 0 or above on its way to a 0 corner', () => {
    const curve = getShapeCurvePoints({
      points,
      radius: 0,
      largestRadius: 20,
    });

    expect(Math.min(...cornersOnTheWay(curve, 20, 0))).toBe(0);
  });

  it('keeps the overshoot when the corner has room for it', () => {
    const curve = getShapeCurvePoints({
      points,
      radius: 8,
      largestRadius: 20,
    });

    expect(curve).toEqual(points);
    expect(Math.min(...cornersOnTheWay(curve, 20, 8))).toBeLessThan(8);
  });
});
