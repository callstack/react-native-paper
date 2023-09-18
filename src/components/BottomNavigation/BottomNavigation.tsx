import * as React from 'react';
import {
  Animated,
  ColorValue,
  EasingFunction,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from 'react-native';

import useLatestCallback from 'use-latest-callback';

import BottomNavigationBar from './BottomNavigationBar';
import BottomNavigationRouteScreen from './BottomNavigationRouteScreen';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import useAnimatedValueArray from '../../utils/useAnimatedValueArray';
import type { IconSource } from '../Icon';

type BaseRoute = {
  key: string;
  title?: string;
  focusedIcon?: IconSource;
  unfocusedIcon?: IconSource;
  badge?: string | number | boolean;
  color?: string;
  accessibilityLabel?: string;
  testID?: string;
  lazy?: boolean;
};

type NavigationState<Route extends BaseRoute> = {
  index: number;
  routes: Route[];
};

type TabPressEvent = {
  defaultPrevented: boolean;
  preventDefault(): void;
};

type TouchableProps<Route extends BaseRoute> = TouchableWithoutFeedbackProps & {
  key: string;
  route: Route;
  children: React.ReactNode;
  borderless?: boolean;
  centered?: boolean;
  rippleColor?: ColorValue;
};

export type Props<Route extends BaseRoute> = {
  /**
   * Whether the shifting style is used, the active tab icon shifts up to show the label and the inactive tabs won't have a label.
   *
   * By default, this is `false` with theme version 3 and `true` when you have more than 3 tabs.
   * Pass `shifting={false}` to explicitly disable this animation, or `shifting={true}` to always use this animation.
   * Note that you need at least 2 tabs be able to run this animation.
   */
  shifting?: boolean;
  /**
   * Whether to show labels in tabs. When `false`, only icons will be displayed.
   */
  labeled?: boolean;
  /**
   * Whether tabs should be spread across the entire width.
   */
  compact?: boolean;
  /**
   * State for the bottom navigation. The state should contain the following properties:
   *
   * - `index`: a number representing the index of the active route in the `routes` array
   * - `routes`: an array containing a list of route objects used for rendering the tabs
   *
   * Each route object should contain the following properties:
   *
   * - `key`: a unique key to identify the route (required)
   * - `title`: title of the route to use as the tab label
   * - `focusedIcon`:  icon to use as the focused tab icon, can be a string, an image source or a react component @renamed Renamed from 'icon' to 'focusedIcon' in v5.x
   * - `unfocusedIcon`:  icon to use as the unfocused tab icon, can be a string, an image source or a react component @supported Available in v5.x with theme version 3
   * - `color`: color to use as background color for shifting bottom navigation @deprecated Deprecated in v5.x
   * - `badge`: badge to show on the tab icon, can be `true` to show a dot, `string` or `number` to show text.
   * - `accessibilityLabel`: accessibility label for the tab button
   * - `testID`: test id for the tab button
   *
   * Example:
   *
   * ```js
   * {
   *   index: 1,
   *   routes: [
   *     { key: 'music', title: 'Favorites', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
   *     { key: 'albums', title: 'Albums', focusedIcon: 'album' },
   *     { key: 'recents', title: 'Recents', focusedIcon: 'history' },
   *     { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
   *   ]
   * }
   * ```
   *
   * `BottomNavigation` is a controlled component, which means the `index` needs to be updated via the `onIndexChange` callback.
   */
  navigationState: NavigationState<Route>;
  /**
   * Callback which is called on tab change, receives the index of the new tab as argument.
   * The navigation state needs to be updated when it's called, otherwise the change is dropped.
   */
  onIndexChange: (index: number) => void;
  /**
   * Callback which returns a react element to render as the page for the tab. Receives an object containing the route as the argument:
   *
   * ```js
   * renderScene = ({ route, jumpTo }) => {
   *   switch (route.key) {
   *     case 'music':
   *       return <MusicRoute jumpTo={jumpTo} />;
   *     case 'albums':
   *       return <AlbumsRoute jumpTo={jumpTo} />;
   *   }
   * }
   * ```
   *
   * Pages are lazily rendered, which means that a page will be rendered the first time you navigate to it.
   * After initial render, all the pages stay rendered to preserve their state.
   *
   * You need to make sure that your individual routes implement a `shouldComponentUpdate` to improve the performance.
   * To make it easier to specify the components, you can use the `SceneMap` helper:
   *
   * ```js
   * renderScene = BottomNavigation.SceneMap({
   *   music: MusicRoute,
   *   albums: AlbumsRoute,
   * });
   * ```
   *
   * Specifying the components this way is easier and takes care of implementing a `shouldComponentUpdate` method.
   * Each component will receive the current route and a `jumpTo` method as it's props.
   * The `jumpTo` method can be used to navigate to other tabs programmatically:
   *
   * ```js
   * this.props.jumpTo('albums')
   * ```
   */
  renderScene: (props: {
    route: Route;
    jumpTo: (key: string) => void;
  }) => React.ReactNode | null;
  /**
   * Callback which returns a React Element to be used as tab icon.
   */
  renderIcon?: (props: {
    route: Route;
    focused: boolean;
    color: string;
  }) => React.ReactNode;
  /**
   * Callback which React Element to be used as tab label.
   */
  renderLabel?: (props: {
    route: Route;
    focused: boolean;
    color: string;
  }) => React.ReactNode;
  /**
   * Callback which returns a React element to be used as the touchable for the tab item.
   * Renders a `TouchableRipple` on Android and `TouchableWithoutFeedback` with `View` on iOS.
   */
  renderTouchable?: (props: TouchableProps<Route>) => React.ReactNode;
  /**
   * Get accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   * Uses `route.accessibilityLabel` by default.
   */
  getAccessibilityLabel?: (props: { route: Route }) => string | undefined;
  /**
   * Get badge for the tab, uses `route.badge` by default.
   */
  getBadge?: (props: { route: Route }) => boolean | number | string | undefined;
  /**
   * Get color for the tab, uses `route.color` by default.
   */
  getColor?: (props: { route: Route }) => string | undefined;
  /**
   * Get label text for the tab, uses `route.title` by default. Use `renderLabel` to replace label component.
   */
  getLabelText?: (props: { route: Route }) => string | undefined;
  /**
   * Get lazy for the current screen. Uses true by default.
   */
  getLazy?: (props: { route: Route }) => boolean | undefined;
  /**
   * Get the id to locate this tab button in tests, uses `route.testID` by default.
   */
  getTestID?: (props: { route: Route }) => string | undefined;
  /**
   * Function to execute on tab press. It receives the route for the pressed tab, useful for things like scroll to top.
   */
  onTabPress?: (props: { route: Route } & TabPressEvent) => void;
  /**
   * Function to execute on tab long press. It receives the route for the pressed tab, useful for things like custom action when longed pressed.
   */
  onTabLongPress?: (props: { route: Route } & TabPressEvent) => void;
  /**
   * Custom color for icon and label in the active tab.
   */
  activeColor?: string;
  /**
   * Custom color for icon and label in the inactive tab.
   */
  inactiveColor?: string;
  /**
   * Whether animation is enabled for scenes transitions in `shifting` mode.
   * By default, the scenes cross-fade during tab change when `shifting` is enabled.
   * Specify `sceneAnimationEnabled` as `false` to disable the animation.
   */
  sceneAnimationEnabled?: boolean;
  /**
   * The scene animation effect. Specify `'shifting'` for a different effect.
   * By default, 'opacity' will be used.
   */
  sceneAnimationType?: 'opacity' | 'shifting';
  /**
   * The scene animation Easing.
   */
  sceneAnimationEasing?: EasingFunction | undefined;
  /**
   * Whether the bottom navigation bar is hidden when keyboard is shown.
   * On Android, this works best when [`windowSoftInputMode`](https://developer.android.com/guide/topics/manifest/activity-element#wsoft) is set to `adjustResize`.
   */
  keyboardHidesNavigationBar?: boolean;
  /**
   * Safe area insets for the tab bar. This can be used to avoid elements like the navigation bar on Android and bottom safe area on iOS.
   * The bottom insets for iOS is added by default. You can override the behavior with this option.
   */
  safeAreaInsets?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /**
   * Style for the bottom navigation bar.  You can pass a custom background color here:
   *
   * ```js
   * barStyle={{ backgroundColor: '#694fad' }}
   * ```
   */
  barStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

const FAR_FAR_AWAY = Platform.OS === 'web' ? 0 : 9999;

const SceneComponent = React.memo(({ component, ...rest }: any) =>
  React.createElement(component, rest)
);

/**
 * BottomNavigation provides quick navigation between top-level views of an app with a bottom navigation bar.
 * It is primarily designed for use on mobile. If you want to use the navigation bar only see [`BottomNavigation.Bar`](BottomNavigationBar).
 *
 * By default BottomNavigation uses primary color as a background, in dark theme with `adaptive` mode it will use surface colour instead.
 * See [Dark Theme](https://callstack.github.io/react-native-paper/docs/guides/theming#dark-theme) for more information.
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
 *     { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
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
  getColor,
  getAccessibilityLabel,
  getTestID,
  activeColor,
  inactiveColor,
  keyboardHidesNavigationBar = Platform.OS === 'android',
  barStyle,
  labeled = true,
  style,
  sceneAnimationEnabled = false,
  sceneAnimationType = 'opacity',
  sceneAnimationEasing,
  onTabPress,
  onTabLongPress,
  onIndexChange,
  shifting: shiftingProp,
  safeAreaInsets,
  labelMaxFontSizeMultiplier = 1,
  compact: compactProp,
  testID = 'bottom-navigation',
  theme: themeOverrides,
  getLazy = ({ route }: { route: Route }) => route.lazy,
}: Props<Route>) => {
  const theme = useInternalTheme(themeOverrides);
  const { scale } = theme.animation;
  const compact = compactProp ?? !theme.isV3;
  let shifting =
    shiftingProp ?? (theme.isV3 ? false : navigationState.routes.length > 3);

  if (shifting && navigationState.routes.length < 2) {
    shifting = false;
    console.warn(
      'BottomNavigation needs at least 2 tabs to run shifting animation'
    );
  }

  const focusedKey = navigationState.routes[navigationState.index].key;

  /**
   * Active state of individual tab item positions:
   * -1 if they're before the active tab, 0 if they're active, 1 if they're after the active tab
   */
  const tabsPositionAnims = useAnimatedValueArray(
    navigationState.routes.map((_, i) =>
      i === navigationState.index ? 0 : i >= navigationState.index ? 1 : -1
    )
  );

  /**
   * The top offset for each tab item to position it offscreen.
   * Placing items offscreen helps to save memory usage for inactive screens with removeClippedSubviews.
   * We use animated values for this to prevent unnecessary re-renders.
   */
  const offsetsAnims = useAnimatedValueArray(
    navigationState.routes.map(
      // offscreen === 1, normal === 0
      (_, i) => (i === navigationState.index ? 0 : 1)
    )
  );

  /**
   * List of loaded tabs, tabs will be loaded when navigated to.
   */
  const [loaded, setLoaded] = React.useState<string[]>([focusedKey]);

  if (!loaded.includes(focusedKey)) {
    // Set the current tab to be loaded if it was not loaded before
    setLoaded((loaded) => [...loaded, focusedKey]);
  }

  const animateToIndex = React.useCallback(
    (index: number) => {
      Animated.parallel([
        ...navigationState.routes.map((_, i) =>
          Animated.timing(tabsPositionAnims[i], {
            toValue: i === index ? 0 : i >= index ? 1 : -1,
            duration: theme.isV3 || shifting ? 150 * scale : 0,
            useNativeDriver: true,
            easing: sceneAnimationEasing,
          })
        ),
      ]).start(({ finished }) => {
        if (finished) {
          // Position all inactive screens offscreen to save memory usage
          // Only do it when animation has finished to avoid glitches mid-transition if switching fast
          offsetsAnims.forEach((offset, i) => {
            if (i === index) {
              offset.setValue(0);
            } else {
              offset.setValue(1);
            }
          });
        }
      });
    },
    [
      shifting,
      navigationState.routes,
      offsetsAnims,
      scale,
      tabsPositionAnims,
      sceneAnimationEasing,
      theme,
    ]
  );

  React.useEffect(() => {
    // Workaround for native animated bug in react-native@^0.57
    // Context: https://github.com/callstack/react-native-paper/pull/637
    animateToIndex(navigationState.index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevNavigationState = React.useRef<NavigationState<Route>>();

  React.useEffect(() => {
    // Reset offsets of previous and current tabs before animation
    offsetsAnims.forEach((offset, i) => {
      if (
        i === navigationState.index ||
        i === prevNavigationState.current?.index
      ) {
        offset.setValue(0);
      }
    });

    animateToIndex(navigationState.index);
  }, [navigationState.index, animateToIndex, offsetsAnims]);

  const handleTabPress = useLatestCallback(
    (event: { route: Route } & TabPressEvent) => {
      onTabPress?.(event);

      if (event.defaultPrevented) {
        return;
      }

      const index = navigationState.routes.findIndex(
        (route) => event.route.key === route.key
      );

      if (index !== navigationState.index) {
        prevNavigationState.current = navigationState;
        onIndexChange(index);
      }
    }
  );

  const jumpTo = useLatestCallback((key: string) => {
    const index = navigationState.routes.findIndex(
      (route) => route.key === key
    );

    prevNavigationState.current = navigationState;
    onIndexChange(index);
  });

  const { routes } = navigationState;
  const { colors } = theme;

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={[styles.content, { backgroundColor: colors?.background }]}>
        {routes.map((route, index) => {
          if (getLazy({ route }) !== false && !loaded.includes(route.key)) {
            // Don't render a screen if we've never navigated to it
            return null;
          }

          const focused = navigationState.index === index;
          const previouslyFocused =
            prevNavigationState.current?.index === index;
          const countAlphaOffscreen =
            sceneAnimationEnabled && (focused || previouslyFocused);
          const renderToHardwareTextureAndroid =
            sceneAnimationEnabled && focused;

          const opacity = sceneAnimationEnabled
            ? tabsPositionAnims[index].interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 1, 0],
              })
            : focused
            ? 1
            : 0;

          const offsetTarget = focused ? 0 : FAR_FAR_AWAY;

          const top = sceneAnimationEnabled
            ? offsetsAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, offsetTarget],
              })
            : offsetTarget;

          const left =
            sceneAnimationType === 'shifting'
              ? tabsPositionAnims[index].interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-50, 0, 50],
                })
              : 0;

          const zIndex = focused ? 1 : 0;

          return (
            <BottomNavigationRouteScreen
              key={route.key}
              pointerEvents={focused ? 'auto' : 'none'}
              accessibilityElementsHidden={!focused}
              importantForAccessibility={
                focused ? 'auto' : 'no-hide-descendants'
              }
              index={index}
              visibility={opacity}
              style={[StyleSheet.absoluteFill, { zIndex }]}
              collapsable={false}
              removeClippedSubviews={
                // On iOS, set removeClippedSubviews to true only when not focused
                // This is an workaround for a bug where the clipped view never re-appears
                Platform.OS === 'ios' ? navigationState.index !== index : true
              }
            >
              <Animated.View
                {...(Platform.OS === 'android' && {
                  needsOffscreenAlphaCompositing: countAlphaOffscreen,
                })}
                renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
                style={[
                  styles.content,
                  {
                    opacity,
                    transform: [{ translateX: left }, { translateY: top }],
                  },
                ]}
              >
                {renderScene({ route, jumpTo })}
              </Animated.View>
            </BottomNavigationRouteScreen>
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
        getColor={getColor}
        getAccessibilityLabel={getAccessibilityLabel}
        getTestID={getTestID}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        keyboardHidesNavigationBar={keyboardHidesNavigationBar}
        style={barStyle}
        labeled={labeled}
        animationEasing={sceneAnimationEasing}
        onTabPress={handleTabPress}
        onTabLongPress={onTabLongPress}
        shifting={shifting}
        safeAreaInsets={safeAreaInsets}
        labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        compact={compact}
        testID={`${testID}-bar`}
        theme={theme}
      />
    </View>
  );
};

/**
 * Function which takes a map of route keys to components.
 * Pure components are used to minimize re-rendering of the pages.
 * This drastically improves the animation performance.
 */
BottomNavigation.SceneMap = <Route extends BaseRoute>(scenes: {
  [key: string]: React.ComponentType<{
    route: Route;
    jumpTo: (key: string) => void;
  }>;
}) => {
  return ({
    route,
    jumpTo,
  }: {
    route: Route;
    jumpTo: (key: string) => void;
  }) => (
    <SceneComponent
      key={route.key}
      component={scenes[route.key ? route.key : '']}
      route={route}
      jumpTo={jumpTo}
    />
  );
};

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
