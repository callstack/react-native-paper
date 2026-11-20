import * as React from 'react';
import type { ViewStyle } from 'react-native';

import {
  linear,
  type CSSStyle,
  type CSSTransitionTimingFunction,
} from 'react-native-reanimated';

import { getButtonShapeCurvePoints } from './utils';
import { toSpringCurve } from '../../theme/tokens/sys/motion';
import type { InternalTheme } from '../../theme/types';

type ShapeMorph = {
  duration: number;
  timingFunction: CSSTransitionTimingFunction;
  outerStyle: CSSStyle<ViewStyle>;
  innerStyle: CSSStyle<ViewStyle>;
};

/**
 * Corner morph shared by Button and IconButton: a CSS transition shaped like
 * the MD3 fast spatial spring.
 *
 * The curve is capped against the inner corner (inside the outline), so a
 * bouncy spring can't push that corner below 0. The outer corner takes the
 * same curve, so the two stay `borderWidth` apart throughout.
 */
export const useShapeMorph = ({
  theme,
  radius,
  largestRadius,
  borderWidth,
  animate,
}: {
  theme: InternalTheme;
  radius: number;
  largestRadius: number;
  borderWidth: number;
  animate: boolean;
}): ShapeMorph => {
  const spring = React.useMemo(
    () => toSpringCurve(theme.motion.spring.fast.spatial),
    [theme.motion.spring.fast.spatial]
  );

  const innerRadius = Math.max(0, radius - borderWidth);
  const largestInnerRadius = Math.max(0, largestRadius - borderWidth);

  const timingFunction = React.useMemo(
    () =>
      linear(
        ...getButtonShapeCurvePoints({
          points: spring.points,
          radius: innerRadius,
          largestRadius: largestInnerRadius,
        })
      ),
    [spring.points, innerRadius, largestInnerRadius]
  );

  const duration = animate ? spring.duration : 0;

  const transitionStyle: CSSStyle<ViewStyle> = {
    transitionProperty: 'borderRadius',
    transitionDuration: duration,
    transitionTimingFunction: timingFunction,
  };

  return {
    duration,
    timingFunction,
    outerStyle: { ...transitionStyle, borderRadius: radius },
    innerStyle: { ...transitionStyle, borderRadius: innerRadius },
  };
};
