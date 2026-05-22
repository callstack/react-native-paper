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
  androidElevationLevels,
  shadowLayers,
} from '../../theme/tokens/sys/elevation';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { Elevation, InternalTheme } from '../../types';

type UseFabVisibilityArgs = {
  visible: boolean;
  theme: InternalTheme;
  initialScale?: number;
  transformOrigin?: ViewStyle['transformOrigin'];
  /**
   * Elevation level when shown. Shadow fades in/out with the FAB.
   */
  elevation?: Elevation;
};

type UseFabVisibilityResult = {
  scale: SharedValue<number>;
  alpha: SharedValue<number>;
  transformOrigin: ViewStyle['transformOrigin'];
  shadowStyle: AnimatedStyle<ViewStyle>;
};

const isAndroid = Platform.OS === 'android';

/**
 * Animates a FAB in and out: scale + alpha together.
 * Reduce-motion: snap to the final value, no animation.
 *
 * Returns `shadowStyle` too. Put it on the same view as the transform so the
 * shadow stays in sync (Android uses `elevation`, iOS/web uses `shadow*`).
 */
export function useFabVisibility({
  visible,
  theme,
  initialScale = 0,
  transformOrigin = 'center',
  elevation = 0,
}: UseFabVisibilityArgs): UseFabVisibilityResult {
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
  const restingShadowOpacity = elevation ? shadowLayers[0].shadowOpacity : 0;
  const shadowOffsetHeight = shadowLayers[0].height[elevation];
  const shadowRadius = shadowLayers[0].shadowRadius[elevation];
  const shadowColor = theme.colors.shadow;

  const shadowStyle = useAnimatedStyle(() => {
    if (isAndroid) {
      return { elevation: alpha.value * restingElevationDp };
    }
    return {
      shadowColor,
      shadowOpacity: alpha.value * restingShadowOpacity,
      shadowOffset: { width: 0, height: shadowOffsetHeight },
      shadowRadius,
    };
  });

  return { scale, alpha, transformOrigin, shadowStyle };
}
