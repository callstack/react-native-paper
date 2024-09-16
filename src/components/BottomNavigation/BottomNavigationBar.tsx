import * as React from 'react';
import {
  Animated,
  ColorValue,
  EasingFunction,
  Platform,
  StyleProp,
  StyleSheet,
  Pressable,
  View,
  ViewStyle,
} from 'react-native';

import color from 'color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getActiveTintColor,
  getInactiveTintColor,
  getLabelColor,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import overlay from '../../styles/overlay';
import { black, white } from '../../styles/themes/v2/colors';
import type { ThemeProp } from '../../types';
import useAnimatedValue from '../../utils/useAnimatedValue';
import useAnimatedValueArray from '../../utils/useAnimatedValueArray';
import useIsKeyboardShown from '../../utils/useIsKeyboardShown';
import useLayout from '../../utils/useLayout';
import Badge from '../Badge';
import Icon, { IconSource } from '../Icon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

type BaseRoute = {
  key: string;
  title?: string;
  focusedIcon?: IconSource;
  unfocusedIcon?: IconSource;
  badge?: string | number | boolean;
  /**
   * @deprecated In v5.x works only with theme version 2.
   */
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

type TouchableProps<Route extends BaseRoute> = TouchableRippleProps & {
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
   * - `color`: color to use as background color for shifting bottom navigation @deprecatedProperty In v5.x works only with theme version 2.
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
   * `BottomNavigation.Bar` is a controlled component, which means the `index` needs to be updated via the `onTabPress` callback.
   */
  navigationState: NavigationState<Route>;
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
   * Renders a `TouchableRipple` on Android and `Pressable` on iOS.
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
   * Get the id to locate this tab button in tests, uses `route.testID` by default.
   */
  getTestID?: (props: { route: Route }) => string | undefined;
  /**
   * Function to execute on tab press. It receives the route for the pressed tab. Use this to update the navigation state.
   */
  onTabPress: (props: { route: Route } & TabPressEvent) => void;
  /**
   * Function to execute on tab long press. It receives the route for the pressed tab
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
   * The scene animation Easing.
   */
  animationEasing?: EasingFunction | undefined;
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
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  activeIndicatorStyle?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

const MIN_RIPPLE_SCALE = 0.001; // Minimum scale is not 0 due to bug with animation
const MIN_TAB_WIDTH = 96;
const MAX_TAB_WIDTH = 168;
const BAR_HEIGHT = 56;
const OUTLINE_WIDTH = 64;

const Touchable = <Route extends BaseRoute>({
  route: _0,
  style,
  children,
  borderless,
  centered,
  rippleColor,
  ...rest
}: TouchableProps<Route>) =>
  TouchableRipple.supported ? (
    <TouchableRipple
      {...rest}
      disabled={rest.disabled || undefined}
      borderless={borderless}
      centered={centered}
      rippleColor={rippleColor}
      style={style}
    >
      {children}
    </TouchableRipple>
  ) : (
    <Pressable style={style} {...rest}>
      {children}
    </Pressable>
  );

/**
 * A navigation bar which can easily be integrated with [React Navigation's Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator/).
 *
 * ## Usage
 * ```js
 * import React from 'react';
 * import { View, StyleSheet } from 'react-native';
 *
 * import { CommonActions } from '@react-navigation/native';
 * import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 * import { Text, BottomNavigation } from 'react-native-paper';
 * import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
 *
 * const Tab = createBottomTabNavigator();
 *
 * export default function MyComponent() {
 *   return (
 *     <Tab.Navigator
 *       screenOptions={{
 *         headerShown: false,
 *       }}
 *       tabBar={({ navigation, state, descriptors, insets }) => (
 *         <BottomNavigation.Bar
 *           navigationState={state}
 *          safeAreaInsets={insets}
 *           onTabPress={({ route, preventDefault }) => {
 *             const event = navigation.emit({
 *               type: 'tabPress',
 *               target: route.key,
 *               canPreventDefault: true,
 *             });
 *
 *             if (event.defaultPrevented) {
 *               preventDefault();
 *             } else {
 *              navigation.dispatch({
 *                 ...CommonActions.navigate(route.name, route.params),
 *                 target: state.key,
 *               });
 *             }
 *           }}
 *           renderIcon={({ route, focused, color }) => {
 *             const { options } = descriptors[route.key];
 *             if (options.tabBarIcon) {
 *               return options.tabBarIcon({ focused, color, size: 24 });
 *             }
 *
 *             return null;
 *           }}
 *           getLabelText={({ route }) => {
 *             const { options } = descriptors[route.key];
 *             const label =
 *               options.tabBarLabel !== undefined
 *                 ? options.tabBarLabel
 *                 : options.title !== undefined
 *                 ? options.title
 *                 : route.title;
 *
 *             return label;
 *           }}
 *         />
 *       )}
 *     >
 *       <Tab.Screen
 *         name="Home"
 *         component={HomeScreen}
 *         options={{
 *           tabBarLabel: 'Home',
 *           tabBarIcon: ({ color, size }) => {
 *             return <Icon name="home" size={size} color={color} />;
 *           },
 *         }}
 *       />
 *       <Tab.Screen
 *         name="Settings"
 *         component={SettingsScreen}
 *         options={{
 *           tabBarLabel: 'Settings',
 *           tabBarIcon: ({ color, size }) => {
 *             return <Icon name="cog" size={size} color={color} />;
 *           },
 *         }}
 *       />
 *     </Tab.Navigator>
 *   );
 * }
 *
 * function HomeScreen() {
 *   return (
 *     <View style={styles.container}>
 *       <Text variant="headlineMedium">Home!</Text>
 *     </View>
 *   );
 * }
 *
 * function SettingsScreen() {
 *   return (
 *     <View style={styles.container}>
 *       <Text variant="headlineMedium">Settings!</Text>
 *     </View>
 *   );
 * }
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     flex: 1,
 *     justifyContent: 'center',
 *     alignItems: 'center',
 *   },
 * });
 * ```
 */
const BottomNavigationBar = <Route extends BaseRoute>({
  navigationState,
  renderIcon,
  renderLabel,
  renderTouchable = (props: TouchableProps<Route>) => <Touchable {...props} />,
  getLabelText = ({ route }: { route: Route }) => route.title,
  getBadge = ({ route }: { route: Route }) => route.badge,
  getColor = ({ route }: { route: Route }) => route.color,
  getAccessibilityLabel = ({ route }: { route: Route }) =>
    route.accessibilityLabel,
  getTestID = ({ route }: { route: Route }) => route.testID,
  activeColor,
  inactiveColor,
  keyboardHidesNavigationBar = Platform.OS === 'android',
  style,
  activeIndicatorStyle,
  labeled = true,
  animationEasing,
  onTabPress,
  onTabLongPress,
  shifting: shiftingProp,
  safeAreaInsets,
  labelMaxFontSizeMultiplier = 1,
  compact: compactProp,
  testID = 'bottom-navigation-bar',
  theme: themeOverrides,
}: Props<Route>) => {
  const theme = useInternalTheme(themeOverrides);
  const { bottom, left, right } = useSafeAreaInsets();
  const { scale } = theme.animation;
  const compact = compactProp ?? !theme.isV3;
  let shifting =
    shiftingProp ?? (theme.isV3 ? false : navigationState.routes.length > 3);

  if (shifting && navigationState.routes.length < 2) {
    shifting = false;
    console.warn(
      'BottomNavigation.Bar needs at least 2 tabs to run shifting animation'
    );
  }

  /**
   * Visibility of the navigation bar, visible state is 1 and invisible is 0.
   */
  const visibleAnim = useAnimatedValue(1);

  /**
   * Active state of individual tab items, active state is 1 and inactive state is 0.
   */
  const tabsAnims = useAnimatedValueArray(
    navigationState.routes.map(
      // focused === 1, unfocused === 0
      (_, i) => (i === navigationState.index ? 1 : 0)
    )
  );

  /**
   * Index of the currently active tab. Used for setting the background color.
   * We don't use the color as an animated value directly, because `setValue` seems to be buggy with colors?.
   */
  const indexAnim = useAnimatedValue(navigationState.index);

  /**
   * Animation for the background color ripple, used to determine it's scale and opacity.
   */
  const rippleAnim = useAnimatedValue(MIN_RIPPLE_SCALE);

  /**
   * Layout of the navigation bar. The width is used to determine the size and position of the ripple.
   */
  const [layout, onLayout] = useLayout();

  /**
   * Track whether the keyboard is visible to show and hide the navigation bar.
   */
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  const handleKeyboardShow = React.useCallback(() => {
    setKeyboardVisible(true);
    Animated.timing(visibleAnim, {
      toValue: 0,
      duration: 150 * scale,
      useNativeDriver: true,
    }).start();
  }, [scale, visibleAnim]);

  const handleKeyboardHide = React.useCallback(() => {
    Animated.timing(visibleAnim, {
      toValue: 1,
      duration: 100 * scale,
      useNativeDriver: true,
    }).start(() => {
      setKeyboardVisible(false);
    });
  }, [scale, visibleAnim]);

  const animateToIndex = React.useCallback(
    (index: number) => {
      // Reset the ripple to avoid glitch if it's currently animating
      rippleAnim.setValue(MIN_RIPPLE_SCALE);

      Animated.parallel([
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: theme.isV3 || shifting ? 400 * scale : 0,
          useNativeDriver: true,
        }),
        ...navigationState.routes.map((_, i) =>
          Animated.timing(tabsAnims[i], {
            toValue: i === index ? 1 : 0,
            duration: theme.isV3 || shifting ? 150 * scale : 0,
            useNativeDriver: true,
            easing: animationEasing,
          })
        ),
      ]).start(() => {
        // Workaround a bug in native animations where this is reset after first animation
        tabsAnims.map((tab, i) => tab.setValue(i === index ? 1 : 0));

        // Update the index to change bar's background color and then hide the ripple
        indexAnim.setValue(index);
        rippleAnim.setValue(MIN_RIPPLE_SCALE);
      });
    },
    [
      rippleAnim,
      theme.isV3,
      shifting,
      scale,
      navigationState.routes,
      tabsAnims,
      animationEasing,
      indexAnim,
    ]
  );

  React.useEffect(() => {
    // Workaround for native animated bug in react-native@^0.57
    // Context: https://github.com/callstack/react-native-paper/pull/637
    animateToIndex(navigationState.index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useIsKeyboardShown({
    onShow: handleKeyboardShow,
    onHide: handleKeyboardHide,
  });

  React.useEffect(() => {
    animateToIndex(navigationState.index);
  }, [navigationState.index, animateToIndex]);

  const eventForIndex = (index: number) => {
    const event = {
      route: navigationState.routes[index],
      defaultPrevented: false,
      preventDefault: () => {
        event.defaultPrevented = true;
      },
    };

    return event;
  };

  const { routes } = navigationState;
  const { colors, dark: isDarkTheme, mode, isV3 } = theme;

  const { backgroundColor: customBackground, elevation = 4 } =
    (StyleSheet.flatten(style) || {}) as {
      elevation?: number;
      backgroundColor?: ColorValue;
    };

  const approxBackgroundColor = customBackground
    ? customBackground
    : isDarkTheme && mode === 'adaptive'
    ? overlay(elevation, colors?.surface)
    : colors?.primary;

  const v2BackgroundColorInterpolation = shifting
    ? indexAnim.interpolate({
        inputRange: routes.map((_, i) => i),
        // FIXME: does outputRange support ColorValue or just strings?
        // @ts-expect-error
        outputRange: routes.map(
          (route) => getColor({ route }) || approxBackgroundColor
        ),
      })
    : approxBackgroundColor;

  const backgroundColor = isV3
    ? customBackground || theme.colors.elevation.level2
    : shifting
    ? v2BackgroundColorInterpolation
    : approxBackgroundColor;

  const isDark =
    typeof approxBackgroundColor === 'string'
      ? !color(approxBackgroundColor).isLight()
      : true;

  const textColor = isDark ? white : black;

  const activeTintColor = getActiveTintColor({
    activeColor,
    defaultColor: textColor,
    theme,
  });

  const inactiveTintColor = getInactiveTintColor({
    inactiveColor,
    defaultColor: textColor,
    theme,
  });
  const touchColor = color(activeTintColor).alpha(0.12).rgb().string();

  const maxTabWidth = routes.length > 3 ? MIN_TAB_WIDTH : MAX_TAB_WIDTH;
  const maxTabBarWidth = maxTabWidth * routes.length;

  const rippleSize = layout.width / 4;

  const insets = {
    left: safeAreaInsets?.left ?? left,
    right: safeAreaInsets?.right ?? right,
    bottom: safeAreaInsets?.bottom ?? bottom,
  };

  return (
    <Surface
      {...(theme.isV3 && { elevation: 0 })}
      testID={testID}
      style={[
        !theme.isV3 && styles.elevation,
        styles.bar,
        keyboardHidesNavigationBar // eslint-disable-next-line react-native/no-inline-styles
          ? {
              // When the keyboard is shown, slide down the navigation bar
              transform: [
                {
                  translateY: visibleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layout.height, 0],
                  }),
                },
              ],
              // Absolutely position the navigation bar so that the content is below it
              // This is needed to avoid gap at bottom when the navigation bar is hidden
              position: keyboardVisible ? 'absolute' : undefined,
            }
          : null,
        style,
      ]}
      pointerEvents={
        layout.measured
          ? keyboardHidesNavigationBar && keyboardVisible
            ? 'none'
            : 'auto'
          : 'none'
      }
      onLayout={onLayout}
    >
      <Animated.View
        style={[styles.barContent, { backgroundColor }]}
        testID={`${testID}-content`}
      >
        <View
          style={[
            styles.items,
            {
              marginBottom: insets.bottom,
              marginHorizontal: Math.max(insets.left, insets.right),
            },
            compact && {
              maxWidth: maxTabBarWidth,
            },
          ]}
          accessibilityRole={'tablist'}
          testID={`${testID}-content-wrapper`}
        >
          {shifting && !isV3 ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.ripple,
                {
                  // Since we have a single ripple, we have to reposition it so that it appears to expand from active tab.
                  // We need to move it from the top to center of the navigation bar and from the left to the active tab.
                  top: (BAR_HEIGHT - rippleSize) / 2,
                  left:
                    (Math.min(layout.width, maxTabBarWidth) / routes.length) *
                      (navigationState.index + 0.5) -
                    rippleSize / 2,
                  height: rippleSize,
                  width: rippleSize,
                  borderRadius: rippleSize / 2,
                  backgroundColor: getColor({
                    route: routes[navigationState.index],
                  }),
                  transform: [
                    {
                      // Scale to twice the size  to ensure it covers the whole navigation bar
                      scale: rippleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 8],
                      }),
                    },
                  ],
                  opacity: rippleAnim.interpolate({
                    inputRange: [0, MIN_RIPPLE_SCALE, 0.3, 1],
                    outputRange: [0, 0, 1, 1],
                  }),
                },
              ]}
              testID={`${testID}-content-ripple`}
            />
          ) : null}
          {routes.map((route, index) => {
            const focused = navigationState.index === index;
            const active = tabsAnims[index];

            // Scale the label up
            const scale =
              labeled && shifting
                ? active.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  })
                : 1;

            // Move down the icon to account for no-label in shifting and smaller label in non-shifting.
            const translateY = labeled
              ? shifting
                ? active.interpolate({
                    inputRange: [0, 1],
                    outputRange: [7, 0],
                  })
                : 0
              : 7;

            // We render the active icon and label on top of inactive ones and cross-fade them on change.
            // This trick gives the illusion that we are animating between active and inactive colors.
            // This is to ensure that we can use native driver, as colors cannot be animated with native driver.
            const activeOpacity = active;
            const inactiveOpacity = active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            });

            const v3ActiveOpacity = focused ? 1 : 0;
            const v3InactiveOpacity = shifting
              ? inactiveOpacity
              : focused
              ? 0
              : 1;

            // Scale horizontally the outline pill
            const outlineScale = focused
              ? active.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                })
              : 0;

            const badge = getBadge({ route });

            const activeLabelColor = getLabelColor({
              tintColor: activeTintColor,
              hasColor: Boolean(activeColor),
              focused,
              defaultColor: textColor,
              theme,
            });

            const inactiveLabelColor = getLabelColor({
              tintColor: inactiveTintColor,
              hasColor: Boolean(inactiveColor),
              focused,
              defaultColor: textColor,
              theme,
            });

            const badgeStyle = {
              top: !isV3 ? -2 : typeof badge === 'boolean' ? 4 : 2,
              right:
                (badge != null && typeof badge !== 'boolean'
                  ? String(badge).length * -2
                  : 0) - (!isV3 ? 2 : 0),
            };

            const isV3Shifting = isV3 && shifting && labeled;

            const font = isV3 ? theme.fonts.labelMedium : {};

            return renderTouchable({
              key: route.key,
              route,
              borderless: true,
              centered: true,
              rippleColor: isV3 ? 'transparent' : touchColor,
              onPress: () => onTabPress(eventForIndex(index)),
              onLongPress: () => onTabLongPress?.(eventForIndex(index)),
              testID: getTestID({ route }),
              accessibilityLabel: getAccessibilityLabel({ route }),
              accessibilityRole: Platform.OS === 'ios' ? 'button' : 'tab',
              accessibilityState: { selected: focused },
              style: [styles.item, isV3 && styles.v3Item],
              children: (
                <View
                  pointerEvents="none"
                  style={
                    isV3 &&
                    (labeled
                      ? styles.v3TouchableContainer
                      : styles.v3NoLabelContainer)
                  }
                >
                  <Animated.View
                    style={[
                      styles.iconContainer,
                      isV3 && styles.v3IconContainer,
                      (!isV3 || isV3Shifting) && {
                        transform: [{ translateY }],
                      },
                    ]}
                  >
                    {isV3 && focused && (
                      <Animated.View
                        style={[
                          styles.outline,
                          {
                            transform: [
                              {
                                scaleX: outlineScale,
                              },
                            ],
                            backgroundColor: theme.colors.secondaryContainer,
                          },
                          activeIndicatorStyle,
                        ]}
                      />
                    )}
                    <Animated.View
                      style={[
                        styles.iconWrapper,
                        isV3 && styles.v3IconWrapper,
                        { opacity: isV3 ? v3ActiveOpacity : activeOpacity },
                      ]}
                    >
                      {renderIcon ? (
                        renderIcon({
                          route,
                          focused: true,
                          color: activeTintColor,
                        })
                      ) : (
                        <Icon
                          source={route.focusedIcon as IconSource}
                          color={activeTintColor}
                          size={24}
                        />
                      )}
                    </Animated.View>
                    <Animated.View
                      style={[
                        styles.iconWrapper,
                        isV3 && styles.v3IconWrapper,
                        {
                          opacity: isV3 ? v3InactiveOpacity : inactiveOpacity,
                        },
                      ]}
                    >
                      {renderIcon ? (
                        renderIcon({
                          route,
                          focused: false,
                          color: inactiveTintColor,
                        })
                      ) : (
                        <Icon
                          source={
                            theme.isV3 && route.unfocusedIcon !== undefined
                              ? route.unfocusedIcon
                              : (route.focusedIcon as IconSource)
                          }
                          color={inactiveTintColor}
                          size={24}
                        />
                      )}
                    </Animated.View>
                    <View style={[styles.badgeContainer, badgeStyle]}>
                      {typeof badge === 'boolean' ? (
                        <Badge visible={badge} size={isV3 ? 6 : 8} />
                      ) : (
                        <Badge visible={badge != null} size={16}>
                          {badge}
                        </Badge>
                      )}
                    </View>
                  </Animated.View>
                  {labeled ? (
                    <Animated.View
                      style={[
                        styles.labelContainer,
                        !isV3 && { transform: [{ scale }] },
                      ]}
                    >
                      <Animated.View
                        style={[
                          styles.labelWrapper,
                          (!isV3 || isV3Shifting) && {
                            opacity: activeOpacity,
                          },
                        ]}
                      >
                        {renderLabel ? (
                          renderLabel({
                            route,
                            focused: true,
                            color: activeLabelColor,
                          })
                        ) : (
                          <Text
                            maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
                            variant="labelMedium"
                            style={[
                              styles.label,
                              {
                                color: activeLabelColor,
                                ...font,
                              },
                            ]}
                          >
                            {getLabelText({ route })}
                          </Text>
                        )}
                      </Animated.View>
                      {shifting ? null : (
                        <Animated.View
                          style={[
                            styles.labelWrapper,
                            { opacity: inactiveOpacity },
                          ]}
                        >
                          {renderLabel ? (
                            renderLabel({
                              route,
                              focused: false,
                              color: inactiveLabelColor,
                            })
                          ) : (
                            <Text
                              maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
                              variant="labelMedium"
                              selectable={false}
                              style={[
                                styles.label,
                                {
                                  color: inactiveLabelColor,
                                  ...font,
                                },
                              ]}
                            >
                              {getLabelText({ route })}
                            </Text>
                          )}
                        </Animated.View>
                      )}
                    </Animated.View>
                  ) : (
                    !isV3 && <View style={styles.labelContainer} />
                  )}
                </View>
              ),
            });
          })}
        </View>
      </Animated.View>
    </Surface>
  );
};

BottomNavigationBar.displayName = 'BottomNavigation.Bar';

export default BottomNavigationBar;

const styles = StyleSheet.create({
  bar: {
    left: 0,
    right: 0,
    bottom: 0,
  },
  barContent: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  items: {
    flexDirection: 'row',
    ...(Platform.OS === 'web'
      ? {
          width: '100%',
        }
      : null),
  },
  item: {
    flex: 1,
    // Top padding is 6 and bottom padding is 10
    // The extra 4dp bottom padding is offset by label's height
    paddingVertical: 6,
  },
  v3Item: {
    paddingVertical: 0,
  },
  ripple: {
    position: 'absolute',
  },
  iconContainer: {
    height: 24,
    width: 24,
    marginTop: 2,
    marginHorizontal: 12,
    alignSelf: 'center',
  },
  v3IconContainer: {
    height: 32,
    width: 32,
    marginBottom: 4,
    marginTop: 0,
    justifyContent: 'center',
  },
  iconWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  v3IconWrapper: {
    top: 4,
  },
  labelContainer: {
    height: 16,
    paddingBottom: 2,
  },
  labelWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  // eslint-disable-next-line react-native/no-color-literals
  label: {
    fontSize: 12,
    height: BAR_HEIGHT,
    textAlign: 'center',
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? {
          whiteSpace: 'nowrap',
          alignSelf: 'center',
        }
      : null),
  },
  badgeContainer: {
    position: 'absolute',
    left: 0,
  },
  v3TouchableContainer: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  v3NoLabelContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outline: {
    width: OUTLINE_WIDTH,
    height: OUTLINE_WIDTH / 2,
    borderRadius: OUTLINE_WIDTH / 4,
    alignSelf: 'center',
  },
  elevation: {
    elevation: 4,
  },
});
