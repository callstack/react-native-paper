import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ButtonTheme } from './ButtonNew';

export const useButtonThemeAnim = (
  disabled: boolean | undefined,
  isElevatedMode: boolean,
  theme: ButtonTheme
) => {
  // animation should come from ButtonTheme
  const { animation } = useInternalTheme();
  const { current: elevation } = useRef<Animated.Value>(
    new Animated.Value(disabled ? 0 : theme.elevation.initial)
  );

  useEffect(() => {
    elevation.setValue(disabled ? 0 : theme.elevation.initial);
  }, [disabled, elevation, theme]);

  const animatePressIn = () => {
    if (isElevatedMode) {
      const { scale } = animation;
      Animated.timing(elevation, {
        toValue: theme.elevation.active,
        duration: 200 * scale,
        useNativeDriver: true,
      }).start();
    }
  };

  const animatePressOut = () => {
    if (isElevatedMode) {
      const { scale } = animation;
      Animated.timing(elevation, {
        toValue: theme.elevation.initial,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    }
  };

  return {
    elevationAnim: elevation,
    animatePressIn,
    animatePressOut,
  };
};
