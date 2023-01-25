import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ButtonTheme } from './ButtonNew';

export const useButtonThemeAnim = (
  disabled: boolean | undefined,
  isElevatedMode: boolean,
  elevation: ButtonTheme['elevation']
) => {
  // animation should come from ButtonTheme
  const { animation } = useInternalTheme(undefined);
  const { current: elevationRef } = useRef<Animated.Value>(
    new Animated.Value(disabled ? 0 : elevation.initial)
  );

  useEffect(() => {
    elevationRef.setValue(disabled ? 0 : elevation.initial);
  }, [disabled, elevationRef, elevation]);

  const animatePressIn = () => {
    if (isElevatedMode) {
      const { scale } = animation;
      Animated.timing(elevationRef, {
        toValue: elevation.active,
        duration: 200 * scale,
        useNativeDriver: true,
      }).start();
    }
  };

  const animatePressOut = () => {
    if (isElevatedMode) {
      const { scale } = animation;
      Animated.timing(elevationRef, {
        toValue: elevation.initial,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    }
  };

  return {
    elevationAnim: elevationRef,
    animatePressIn,
    animatePressOut,
  };
};
