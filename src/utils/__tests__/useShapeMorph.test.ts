import { describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import { linear } from 'react-native-reanimated';

import { LightTheme } from '../../theme/schemes';
import { toSpringCurve } from '../../theme/tokens/sys/motion';
import { getShapeCurvePoints, useShapeMorph } from '../useShapeMorph';

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

describe('useShapeMorph', () => {
  const spring = toSpringCurve(LightTheme.motion.spring.fast.spatial);
  const morph = {
    theme: LightTheme,
    radius: 3,
    largestRadius: 28,
    borderWidth: 2,
  };

  it('caps the curve against the inner corner, not the outer one', async () => {
    const { result } = await renderHook(() =>
      useShapeMorph({ ...morph, animate: true })
    );

    const innerCurve = getShapeCurvePoints({
      points: spring.points,
      radius: 1,
      largestRadius: 26,
    });
    const outerCurve = getShapeCurvePoints({
      points: spring.points,
      radius: 3,
      largestRadius: 28,
    });

    expect(innerCurve).not.toEqual(outerCurve);
    expect(result.current.timingFunction).toEqual(linear(...innerCurve));
  });

  it('keeps the inner corner borderWidth inside the outer one', async () => {
    const { result } = await renderHook(() =>
      useShapeMorph({ ...morph, animate: true })
    );

    expect(result.current.outerStyle).toMatchObject({
      borderRadius: 3,
      transitionDuration: spring.duration,
    });
    expect(result.current.innerStyle).toMatchObject({
      borderRadius: 1,
      transitionDuration: spring.duration,
    });
  });

  it('snaps without a transition when animate is false', async () => {
    const { result } = await renderHook(() =>
      useShapeMorph({ ...morph, animate: false })
    );

    expect(result.current.duration).toBe(0);
    expect(result.current.outerStyle).toMatchObject({ transitionDuration: 0 });
    expect(result.current.innerStyle).toMatchObject({ transitionDuration: 0 });
  });
});
