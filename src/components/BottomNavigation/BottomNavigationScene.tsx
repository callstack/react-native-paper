import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import BottomNavigationRouteScreen from './BottomNavigationRouteScreen';
import type { BaseRoute, SceneAnimationType } from './types';

const FAR_FAR_AWAY = Platform.OS === 'web' ? 0 : 9999;

export type Props<Route extends BaseRoute> = {
  route: Route;
  index: number;
  focused: boolean;
  activeIndex: SharedValue<number>;
  sceneAnimationEnabled: boolean;
  sceneAnimationType: SceneAnimationType;
  renderScene: (props: {
    route: Route;
    jumpTo: (key: string) => void;
  }) => React.ReactNode | null;
  jumpTo: (key: string) => void;
};

function BottomNavigationScene<Route extends BaseRoute>({
  route,
  index,
  focused,
  activeIndex,
  sceneAnimationEnabled,
  sceneAnimationType,
  renderScene,
  jumpTo,
}: Props<Route>) {
  const animatedStyle = useAnimatedStyle(() => {
    if (!sceneAnimationEnabled) {
      const isFocused = activeIndex.value === index;

      return {
        opacity: isFocused ? 1 : 0,
        display:
          Platform.OS === 'web' && !isFocused
            ? ('none' as const)
            : ('flex' as const),
        transform: [
          { translateX: 0 },
          { translateY: isFocused ? 0 : FAR_FAR_AWAY },
        ],
      };
    }

    const position = index - activeIndex.value;
    const distance = Math.abs(position);
    const hidden = distance >= 0.99;

    return {
      opacity: interpolate(distance, [0, 1], [1, 0], Extrapolation.CLAMP),
      display:
        Platform.OS === 'web' && hidden ? ('none' as const) : ('flex' as const),
      transform: [
        {
          translateX: sceneAnimationType === 'shifting' ? position * 50 : 0,
        },
        { translateY: hidden ? FAR_FAR_AWAY : 0 },
      ],
    };
  }, [index, sceneAnimationEnabled, sceneAnimationType]);

  return (
    <BottomNavigationRouteScreen
      index={index}
      pointerEvents={focused ? 'auto' : 'none'}
      aria-hidden={!focused}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      style={[StyleSheet.absoluteFill, focused ? styles.front : styles.back]}
      collapsable={false}
      removeClippedSubviews={
        // On iOS, set removeClippedSubviews to true only when not focused
        // This is an workaround for a bug where the clipped view never re-appears
        Platform.OS === 'ios' ? !focused : true
      }
    >
      <Animated.View
        style={[styles.content, animatedStyle]}
        renderToHardwareTextureAndroid={sceneAnimationEnabled && focused}
      >
        {renderScene({ route, jumpTo })}
      </Animated.View>
    </BottomNavigationRouteScreen>
  );
}

function routeEquals<Route extends BaseRoute>(previous: Route, next: Route) {
  return previous.key === next.key;
}

function propsAreEqual<Route extends BaseRoute>(
  previous: Props<Route>,
  next: Props<Route>
) {
  return (
    previous.index === next.index &&
    previous.focused === next.focused &&
    previous.sceneAnimationEnabled === next.sceneAnimationEnabled &&
    previous.sceneAnimationType === next.sceneAnimationType &&
    previous.activeIndex === next.activeIndex &&
    previous.jumpTo === next.jumpTo &&
    previous.renderScene === next.renderScene &&
    routeEquals(previous.route, next.route)
  );
}

// React.memo erases the generic; restore it so callers keep Route inference.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export default React.memo(
  BottomNavigationScene,
  propsAreEqual
) as typeof BottomNavigationScene;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  front: {
    zIndex: 1,
  },
  back: {
    zIndex: 0,
  },
});
