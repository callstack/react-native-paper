import * as React from 'react';
import { Platform, type ViewStyle } from 'react-native';

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type AnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import {
  IOS_SHADOW_RADIUS_FACTOR,
  SHADOW_OPACITY,
  androidElevationLevels,
  shadow,
  shadowLayers,
} from '../../theme/tokens/sys/elevation';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { Elevation, InternalTheme } from '../../types';

type UseVisibilityArgs = {
  visible: boolean;
  theme: InternalTheme;
  initialScale?: number;
  transformOrigin?: ViewStyle['transformOrigin'];
  /**
   * Elevation level when shown. Shadow fades in/out with the FAB.
   */
  elevation?: Elevation;
};

type UseVisibilityResult = {
  scale: SharedValue<number>;
  alpha: SharedValue<number>;
  transformOrigin: ViewStyle['transformOrigin'];
  shadowStyle: AnimatedStyle<ViewStyle>;
};

/**
 * Animates a FAB in and out: scale + alpha together.
 * Reduce-motion: snap to the final value, no animation.
 *
 * Returns `shadowStyle` too. Put it on the same view as the transform so the
 * shadow stays in sync (Android uses `elevation`, iOS uses `shadow*`, Web uses
 * `boxShadow` -- the outer container's `opacity: alpha.value` handles the
 * visibility fade on Web so the shadow string can be static).
 */
export function useVisibility({
  visible,
  theme,
  initialScale = 0,
  transformOrigin = 'center',
  elevation = 0,
}: UseVisibilityArgs): UseVisibilityResult {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(visible ? 1 : initialScale);
  const alpha = useSharedValue(visible ? 1 : 0);

  React.useEffect(() => {
    const targetScale = visible ? 1 : initialScale;
    const targetAlpha = visible ? 1 : 0;
    if (reduceMotion) {
      scale.value = targetScale;
      alpha.value = targetAlpha;
      return;
    }
    scale.value = withSpring(
      targetScale,
      toRawSpring(theme.motion.spring.fast.spatial)
    );
    alpha.value = withSpring(
      targetAlpha,
      toRawSpring(theme.motion.spring.fast.effects)
    );
  }, [visible, theme, reduceMotion, scale, alpha, initialScale]);

  const restingElevationDp = androidElevationLevels[elevation];
  const shadowOffsetHeight = shadowLayers[0].height[elevation];
  const shadowRadius = shadowLayers[0].shadowRadius[elevation];
  const shadowColor = theme.colors.shadow;

  const webShadow =
    Platform.OS === 'web' ? shadow(elevation, shadowColor) : null;

  const shadowStyle = useAnimatedStyle(() => {
    if (Platform.OS === 'android') {
      return { elevation: alpha.value * restingElevationDp };
    }
    if (Platform.OS === 'web') {
      return webShadow ?? {};
    }
    return {
      shadowColor,
      shadowOpacity: alpha.value * (elevation ? SHADOW_OPACITY : 0),
      shadowOffset: { width: 0, height: shadowOffsetHeight },
      shadowRadius: shadowRadius * IOS_SHADOW_RADIUS_FACTOR,
    };
  });

  return { scale, alpha, transformOrigin, shadowStyle };
}
