import * as React from 'react';
import { Animated, Easing } from 'react-native';

type SharedValue<T> = {
  value: T;
};

const Reanimated = Animated as typeof Animated & {
  View: typeof Animated.View;
  Text: typeof Animated.Text;
};

const interpolateNumber = (
  value: number,
  inputRange: number[],
  outputRange: number[]
) => {
  if (inputRange.length < 2 || outputRange.length < 2) {
    return outputRange[0] ?? value;
  }

  const [inputStart, inputEnd] = inputRange;
  const [outputStart, outputEnd] = outputRange;

  if (inputEnd === inputStart) {
    return outputStart;
  }

  const ratio = (value - inputStart) / (inputEnd - inputStart);
  return outputStart + (outputEnd - outputStart) * ratio;
};

export default Reanimated;
export { Easing };

export const ReduceMotion = {
  System: 'system',
  Always: 'always',
  Never: 'never',
} as const;

export const useSharedValue = <T>(initialValue: T): SharedValue<T> => {
  const ref = React.useRef<SharedValue<T>>({ value: initialValue });
  return ref.current;
};

export const useDerivedValue = <T>(updater: () => T): SharedValue<T> => {
  const shared = useSharedValue(updater());
  shared.value = updater();
  return shared;
};

export const useAnimatedStyle = <T extends object>(updater: () => T): T =>
  updater();

export const useAnimatedReaction = <T>(
  prepare: () => T,
  reactToValue: (current: T, previous: T | null) => void
) => {
  const previous = React.useRef<T | null>(null);
  const current = prepare();

  React.useEffect(() => {
    reactToValue(current, previous.current);
    previous.current = current;
  }, [current, reactToValue]);
};

export const useAnimatedRef = <T>() => React.useRef<T | null>(null);

export const measure = () => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  pageX: 0,
  pageY: 0,
});

export const withTiming = <T>(value: T) => value;
export const withSpring = <T>(value: T) => value;
export const withDelay = <T>(_delay: number, value: T) => value;
export const withSequence = <T>(...values: T[]) => values[values.length - 1];

export const interpolate = (
  value: number,
  inputRange: number[],
  outputRange: number[]
) => interpolateNumber(value, inputRange, outputRange);

export type { SharedValue };
export type AnimatedStyle<T> = T;
