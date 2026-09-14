import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useSharedValue, withTiming } from 'react-native-reanimated';
import useLatestCallback from 'use-latest-callback';

import BottomNavigationBar from './BottomNavigationBar';
import BottomNavigationScene from './BottomNavigationScene';
import SceneMap from './SceneMap';
import type {
  BaseRoute,
  BarProps,
  SceneAnimationEasing,
  SceneAnimationType,
} from './types';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../../theme/types';

export type { BaseRoute, NavigationState } from './types';

export type Props<Route extends BaseRoute> = Omit<
  BarProps<Route>,
  'onTabPress' | 'animationEasing' | 'style'
> & {
  /**
   * Callback which is called on tab change, receives the index of the new tab as argument.
   * The navigation state needs to be updated when it's called, otherwise the change is dropped.
   */
  onIndexChange: (index: number) => void;
  /**
   * Callback which returns a react element to render as the page for the tab. Receives an object containing the route as the argument.
   *
   * Pages are lazily rendered, which means that a page will be rendered the first time you navigate to it.
   * After initial render, all the pages stay rendered to preserve their state.
   *
   * You need to make sure that your individual routes implement a `shouldComponentUpdate` to improve the performance.
   * To make it easier to specify the components, you can use the `SceneMap` helper.
   */
  renderScene: (props: {
    route: Route;
    jumpTo: (key: string) => void;
  }) => React.ReactNode | null;
  /**
   * Get lazy for the current screen. Uses true by default.
   */
  getLazy?: (props: { route: Route }) => boolean | undefined;
  /**
   * Function to execute on tab press. It receives the route for the pressed tab, useful for things like scroll to top.
   */
  onTabPress?: BarProps<Route>['onTabPress'];
  /**
   * Whether animation is enabled for scene transitions.
   * By default, scenes are not animated.
   */
  sceneAnimationEnabled?: boolean;
  /**
   * The scene animation effect. Specify `'shifting'` for a horizontal slide.
   * By default, 'opacity' will be used.
   */
  sceneAnimationType?: SceneAnimationType;
  /**
   * The scene animation easing. Accepts a `(value: number) => number` function,
   * including easings from `react-native-reanimated`.
   */
  sceneAnimationEasing?: SceneAnimationEasing;
  /**
   * Style for the bottom navigation bar.
   */
  barStyle?: BarProps<Route>['style'];
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * testID for the underlying `BottomNavigation.Bar`.
   */
  barTestID?: string;
};

/**
 * BottomNavigation provides quick navigation between top-level views of an app with a bottom navigation bar.
 * It is primarily designed for use on mobile. If you want to use the navigation bar only see [`BottomNavigation.Bar`](BottomNavigationBar).
 *
 * The bar follows the Material Design 3 Expressive navigation bar spec: 64dp height,
 * 56×32 active indicator, `secondary` active labels, and an optional horizontal
 * item layout on medium windows.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { BottomNavigation, Text } from 'react-native-paper';
 *
 * const MusicRoute = () => <Text>Music</Text>;
 *
 * const AlbumsRoute = () => <Text>Albums</Text>;
 *
 * const RecentsRoute = () => <Text>Recents</Text>;
 *
 * const NotificationsRoute = () => <Text>Notifications</Text>;
 *
 * const MyComponent = () => {
 *   const [index, setIndex] = React.useState(0);
 *   const [routes] = React.useState([
 *     { key: 'music', title: 'Favorites', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
 *     { key: 'albums', title: 'Albums', focusedIcon: 'album' },
 *     { key: 'recents', title: 'Recents', focusedIcon: 'history' },
 *     { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline', badge: 3 },
 *   ]);
 *
 *   const renderScene = BottomNavigation.SceneMap({
 *     music: MusicRoute,
 *     albums: AlbumsRoute,
 *     recents: RecentsRoute,
 *     notifications: NotificationsRoute,
 *   });
 *
 *   return (
 *     <BottomNavigation
 *       navigationState={{ index, routes }}
 *       onIndexChange={setIndex}
 *       renderScene={renderScene}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const BottomNavigation = <Route extends BaseRoute>({
  navigationState,
  renderScene,
  renderIcon,
  renderLabel,
  renderTouchable,
  getLabelText,
  getBadge,
  getAccessibilityLabel,
  getTestID,
  activeColor,
  inactiveColor,
  keyboardHidesNavigationBar = Platform.OS === 'android',
  barStyle,
  labeled = true,
  style,
  activeIndicatorStyle,
  sceneAnimationEnabled = false,
  sceneAnimationType = 'opacity',
  sceneAnimationEasing,
  onTabPress,
  onTabLongPress,
  onIndexChange,
  shifting,
  itemLayout,
  safeAreaInsets,
  labelMaxFontSizeMultiplier = 1,
  compact,
  testID,
  barTestID,
  theme: themeOverrides,
  getLazy = ({ route }: { route: Route }) => route.lazy,
}: Props<Route>) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();
  const focusedKey = navigationState.routes[navigationState.index].key;
  const activeIndex = useSharedValue(navigationState.index);

  const [loaded, setLoaded] = React.useState(
    () => new Set<string>([focusedKey])
  );

  if (!loaded.has(focusedKey)) {
    setLoaded((current) => {
      const next = new Set(current);
      next.add(focusedKey);
      return next;
    });
  }

  React.useEffect(() => {
    if (!sceneAnimationEnabled || reduceMotion) {
      activeIndex.value = navigationState.index;
      return;
    }

    activeIndex.value = withTiming(navigationState.index, {
      duration: theme.motion.duration.short3 * theme.animation.scale,
      easing: sceneAnimationEasing,
    });
  }, [
    activeIndex,
    navigationState.index,
    reduceMotion,
    sceneAnimationEasing,
    sceneAnimationEnabled,
    theme.animation.scale,
    theme.motion.duration.short3,
  ]);

  const handleTabPress = useLatestCallback(
    (event: Parameters<NonNullable<Props<Route>['onTabPress']>>[0]) => {
      onTabPress?.(event);

      if (event.defaultPrevented) {
        return;
      }

      const index = navigationState.routes.findIndex(
        (route) => event.route.key === route.key
      );

      if (index !== navigationState.index) {
        onIndexChange(index);
      }
    }
  );

  const jumpTo = useLatestCallback((key: string) => {
    const index = navigationState.routes.findIndex(
      (route) => route.key === key
    );

    onIndexChange(index);
  });

  const renderSceneStable = useLatestCallback(renderScene);
  const getLazyStable = useLatestCallback(getLazy);
  const { routes } = navigationState;

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View
        style={[styles.content, { backgroundColor: theme.colors.background }]}
      >
        {routes.map((route, index) => {
          const isLazy = getLazyStable({ route }) !== false;

          if (isLazy && !loaded.has(route.key)) {
            return null;
          }

          return (
            <BottomNavigationScene
              key={route.key}
              route={route}
              index={index}
              focused={navigationState.index === index}
              activeIndex={activeIndex}
              sceneAnimationEnabled={sceneAnimationEnabled}
              sceneAnimationType={sceneAnimationType}
              renderScene={renderSceneStable}
              jumpTo={jumpTo}
            />
          );
        })}
      </View>
      <BottomNavigationBar
        navigationState={navigationState}
        renderIcon={renderIcon}
        renderLabel={renderLabel}
        renderTouchable={renderTouchable}
        getLabelText={getLabelText}
        getBadge={getBadge}
        getAccessibilityLabel={getAccessibilityLabel}
        getTestID={getTestID}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        keyboardHidesNavigationBar={keyboardHidesNavigationBar}
        style={barStyle}
        activeIndicatorStyle={activeIndicatorStyle}
        labeled={labeled}
        animationEasing={sceneAnimationEasing}
        onTabPress={handleTabPress}
        onTabLongPress={onTabLongPress}
        shifting={shifting}
        itemLayout={itemLayout}
        safeAreaInsets={safeAreaInsets}
        labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        compact={compact}
        testID={barTestID}
        theme={theme}
      />
    </View>
  );
};

BottomNavigation.SceneMap = SceneMap;

// @component ./BottomNavigationBar.tsx
BottomNavigation.Bar = BottomNavigationBar;

export default BottomNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});
