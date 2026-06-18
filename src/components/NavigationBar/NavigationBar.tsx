import * as React from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Pressable,
  View,
} from 'react-native';
import type {
  ColorValue,
  EasingFunction,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BAR_HEIGHT,
  colorRoles,
  ICON_LABEL_GAP,
  ICON_SIZE,
  INDICATOR_BORDER_RADIUS,
  INDICATOR_HEIGHT,
  INDICATOR_WIDTH,
  MAX_TAB_WIDTH,
  MIN_TAB_WIDTH,
  NO_LABEL_BAR_HEIGHT,
} from './tokens';
import { useInternalTheme } from '../../core/theming';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import { getStateLayer } from '../../theme/utils/state';
import type { Theme, ThemeProp } from '../../types';
import useAnimatedValue from '../../utils/useAnimatedValue';
import useAnimatedValueArray from '../../utils/useAnimatedValueArray';
import useIsKeyboardShown from '../../utils/useIsKeyboardShown';
import useLayout from '../../utils/useLayout';
import Badge from '../Badge';
import {
  getActiveTintColor,
  getInactiveTintColor,
  getLabelColor,
} from '../BottomNavigation/utils';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type BaseRoute = {
  key: string;
  title?: string;
  focusedIcon?: IconSource;
  unfocusedIcon?: IconSource;
  badge?: string | number | boolean;
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
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export type Props<Route extends BaseRoute> = {
  /**
   * Whether to show labels in tabs. When `false`, only icons will be displayed.
   */
  labeled?: boolean;
  /**
   * The item layout variant of the flexible navigation bar.
   *
   * - `stacked` (default): the icon sits above the label.
   * - `horizontal`: the icon sits beside the label and the active indicator
   *   hugs both. Recommended for medium-width windows (e.g. foldables and
   *   tablets). Has no effect when `labeled` is `false`.
   */
  variant?: 'stacked' | 'horizontal';
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
   * `NavigationBar` is a controlled component, which means the `index` needs to be updated via the `onTabPress` callback.
   */
  navigationState: NavigationState<Route>;
  /**
   * Callback which returns a React Element to be used as tab icon.
   */
  renderIcon?: (props: {
    route: Route;
    focused: boolean;
    color: ColorValue;
  }) => React.ReactNode;
  /**
   * Callback which React Element to be used as tab label.
   */
  renderLabel?: (props: {
    route: Route;
    focused: boolean;
    color: ColorValue;
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

type ItemProps<Route extends BaseRoute> = {
  route: Route;
  focused: boolean;
  active: Animated.Value;
  labeled: boolean;
  variant: 'stacked' | 'horizontal';
  activeTintColor: ColorValue;
  inactiveTintColor: ColorValue;
  activeColor?: string;
  inactiveColor?: string;
  renderIcon?: Props<Route>['renderIcon'];
  renderLabel?: Props<Route>['renderLabel'];
  renderTouchable: NonNullable<Props<Route>['renderTouchable']>;
  getLabelText: NonNullable<Props<Route>['getLabelText']>;
  getBadge: NonNullable<Props<Route>['getBadge']>;
  getTestID: NonNullable<Props<Route>['getTestID']>;
  getAccessibilityLabel: NonNullable<Props<Route>['getAccessibilityLabel']>;
  onPress: () => void;
  onLongPress: () => void;
  activeIndicatorStyle?: StyleProp<ViewStyle>;
  labelMaxFontSizeMultiplier?: number;
  theme: Theme;
};

const NavigationBarItem = <Route extends BaseRoute>({
  route,
  focused,
  active,
  labeled,
  variant,
  activeTintColor,
  inactiveTintColor,
  activeColor,
  inactiveColor,
  renderIcon,
  renderLabel,
  renderTouchable,
  getLabelText,
  getBadge,
  getTestID,
  getAccessibilityLabel,
  onPress,
  onLongPress,
  activeIndicatorStyle,
  labelMaxFontSizeMultiplier = 1,
  theme,
}: ItemProps<Route>) => {
  const { colors } = theme;

  const [hovered, setHovered] = React.useState(false);
  const [keyboardFocused, setKeyboardFocused] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  // The active indicator is always mounted and cross-fades via `active` opacity
  // (remounting it on focus change breaks native-driven animations). In the
  // stacked layout it also scales horizontally from 0.5 → 1 on selection.
  const outlineScale = active.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const iconColor = focused ? activeTintColor : inactiveTintColor;
  const labelColor = getLabelColor({
    tintColor: iconColor,
    hasColor: Boolean(focused ? activeColor : inactiveColor),
    focused,
    theme,
  });

  const badge = getBadge({ route });
  const badgeStyle = {
    top: typeof badge === 'boolean' ? 4 : 2,
    right:
      badge != null && typeof badge !== 'boolean'
        ? String(badge).length * -2
        : 0,
  };

  const font = theme.fonts.labelMedium;

  // MD3 state layer: visible on hover (8%) and focus/press (10%). Active items
  // use the on-secondary-container role, inactive the on-surface-variant role.
  const stateLayerRole = focused
    ? colorRoles.activeIcon
    : colorRoles.inactiveIcon;
  const stateLayer = pressed
    ? getStateLayer(theme, stateLayerRole, 'pressed')
    : keyboardFocused
    ? getStateLayer(theme, stateLayerRole, 'focused')
    : hovered
    ? getStateLayer(theme, stateLayerRole, 'hovered')
    : null;
  const stateLayerColor = stateLayer
    ? { backgroundColor: stateLayer.color, opacity: stateLayer.opacity }
    : null;

  const itemTestID = getTestID({ route });
  const indicatorTestID = itemTestID
    ? `${itemTestID}-active-indicator`
    : undefined;
  const stateLayerTestID = itemTestID ? `${itemTestID}-state-layer` : undefined;

  // The horizontal arrangement places the label beside the icon and only
  // applies when labels are shown; otherwise it falls back to stacked icon-only.
  const horizontal = variant === 'horizontal' && labeled;

  // Item pieces shared across both layouts. The active/inactive distinction is
  // a plain color swap (no cross-fade), so a single icon and label suffice.
  const icon = renderIcon ? (
    renderIcon({ route, focused, color: iconColor })
  ) : (
    <Icon
      source={
        (focused
          ? route.focusedIcon
          : route.unfocusedIcon ?? route.focusedIcon) as IconSource
      }
      color={iconColor}
      size={ICON_SIZE}
    />
  );

  const tabBadge = (
    <View style={[styles.badgeContainer, badgeStyle]}>
      {typeof badge === 'boolean' ? (
        <Badge visible={badge} size={6} />
      ) : (
        <Badge visible={badge != null} size={16}>
          {badge}
        </Badge>
      )}
    </View>
  );

  const renderTabLabel = (labelStyle: StyleProp<TextStyle>) =>
    renderLabel ? (
      renderLabel({ route, focused, color: labelColor })
    ) : (
      <Text
        maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        variant="labelMedium"
        selectable={false}
        style={[labelStyle, { color: labelColor, ...font }]}
      >
        {getLabelText({ route })}
      </Text>
    );

  const stackedContent = (
    <View
      pointerEvents="none"
      style={labeled ? styles.stackedContainer : styles.noLabelContainer}
    >
      <View style={styles.iconContainer}>
        <Animated.View
          testID={indicatorTestID}
          style={[
            styles.stackedIndicator,
            {
              opacity: active,
              transform: [{ scaleX: outlineScale }],
              backgroundColor: colors.secondaryContainer,
            },
            activeIndicatorStyle,
          ]}
        />
        <View pointerEvents="none" style={styles.stateLayerWrapper}>
          <View
            testID={stateLayerTestID}
            style={[styles.stateLayer, stateLayerColor]}
          />
        </View>
        <View style={styles.iconWrapper}>{icon}</View>
        {tabBadge}
      </View>
      {labeled ? (
        <View style={styles.labelContainer}>
          {renderTabLabel(styles.label)}
        </View>
      ) : null}
    </View>
  );

  const horizontalContent = (
    <View pointerEvents="none" style={styles.horizontalContainer}>
      <View style={styles.horizontalItem}>
        <Animated.View
          testID={indicatorTestID}
          style={[
            StyleSheet.absoluteFill,
            styles.horizontalIndicator,
            {
              backgroundColor: colors.secondaryContainer,
              opacity: active,
              transform: [
                {
                  scale: active.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
            activeIndicatorStyle,
          ]}
        />
        <View
          testID={stateLayerTestID}
          style={[
            StyleSheet.absoluteFill,
            styles.horizontalIndicator,
            stateLayerColor,
          ]}
        />
        <View>
          {icon}
          {tabBadge}
        </View>
        {renderTabLabel(styles.horizontalLabel)}
      </View>
    </View>
  );

  return renderTouchable({
    key: route.key,
    route,
    borderless: true,
    centered: true,
    rippleColor: 'transparent',
    onPress,
    onLongPress,
    onPressIn: () => setPressed(true),
    onPressOut: () => setPressed(false),
    onHoverIn: () => setHovered(true),
    onHoverOut: () => setHovered(false),
    onFocus: () => setKeyboardFocused(true),
    onBlur: () => setKeyboardFocused(false),
    testID: itemTestID,
    accessibilityLabel: getAccessibilityLabel({ route }),
    accessibilityRole: Platform.OS === 'ios' ? 'button' : 'tab',
    accessibilityState: { selected: focused },
    style: styles.item,
    children: horizontal ? horizontalContent : stackedContent,
  });
};

/**
 * The Material Design 3 flexible navigation bar. It can easily be integrated
 * with [React Navigation's Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator/).
 *
 * The flexible navigation bar replaces the original (now deprecated) navigation
 * bar exposed as `BottomNavigation.Bar`. Set the `variant` prop to `'horizontal'`
 * to lay items out horizontally (icon beside label) in medium-width windows.
 *
 * Migrating from `BottomNavigation.Bar`: it is deprecated in favor of
 * `NavigationBar`. The Material Design 2 `shifting` prop has been removed (it
 * has no MD3 equivalent), tab interactions now show MD3 state layers instead of
 * suppressing feedback, and the bar height follows the 64dp spec.
 *
 * ## Usage
 * ### without React Navigation
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { NavigationBar, Text, Provider } from 'react-native-paper';
 *
 * function HomeScreen() {
 *   return (
 *     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
 *       <Text>Home!</Text>
 *     </View>
 *   );
 * }
 *
 * function SettingsScreen() {
 *   return (
 *     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
 *       <Text>Settings!</Text>
 *   </View>
 *   );
 * }
 *
 * export default function MyComponent() {
 *   const [index, setIndex] = React.useState(0);
 *
 *   const routes = [
 *     { key: 'home', title: 'Home', focusedIcon: 'home' },
 *     { key: 'settings', title: 'Settings', focusedIcon: 'cog' },
 *   ];
 *
 *   const renderScene = ({ route }) => {
 *     switch (route.key) {
 *       case 'home':
 *         return <HomeScreen />;
 *       case 'settings':
 *         return <SettingsScreen />;
 *       default:
 *         return null;
 *     }
 *   };
 *
 *   return (
 *     <Provider>
 *       {renderScene({ route: routes[index] })}
 *       <NavigationBar
 *         navigationState={{ index, routes }}
 *         onTabPress={({ route }) => {
 *           const newIndex = routes.findIndex((r) => r.key === route.key);
 *           if (newIndex !== -1) {
 *             setIndex(newIndex);
 *           }
 *         }}
 *         getLabelText={({ route }) => route.title}
 *       />
 *     </Provider>
 *   );
 * }
 * ```
 */
const NavigationBar = <Route extends BaseRoute>({
  navigationState,
  renderIcon,
  renderLabel,
  renderTouchable = ({ key, ...props }: TouchableProps<Route>) => (
    <Touchable key={key} {...props} />
  ),
  getLabelText = ({ route }: { route: Route }) => route.title,
  getBadge = ({ route }: { route: Route }) => route.badge,
  getAccessibilityLabel = ({ route }: { route: Route }) =>
    route.accessibilityLabel,
  getTestID = ({ route }: { route: Route }) => route.testID,
  activeColor,
  inactiveColor,
  keyboardHidesNavigationBar = Platform.OS === 'android',
  style,
  activeIndicatorStyle,
  labeled = true,
  variant = 'stacked',
  animationEasing,
  onTabPress,
  onTabLongPress,
  safeAreaInsets,
  labelMaxFontSizeMultiplier = 1,
  compact: compactProp,
  testID = 'bottom-navigation-bar',
  theme: themeOverrides,
}: Props<Route>) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors, motion } = theme as Theme;
  const { bottom, left, right } = useSafeAreaInsets();
  const { scale } = theme.animation;
  const compact = compactProp ?? false;

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
   * Layout of the navigation bar.
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
      // The bar slides out, so accelerate (exit).
      duration: motion.duration.short3 * scale,
      easing: Easing.bezier(...motion.easing.standardAccelerate),
      useNativeDriver: true,
    }).start();
  }, [motion, scale, visibleAnim]);

  const handleKeyboardHide = React.useCallback(() => {
    Animated.timing(visibleAnim, {
      toValue: 1,
      // The bar slides back in, so decelerate (enter).
      duration: motion.duration.short2 * scale,
      easing: Easing.bezier(...motion.easing.standardDecelerate),
      useNativeDriver: true,
    }).start(() => {
      setKeyboardVisible(false);
    });
  }, [motion, scale, visibleAnim]);

  const animateToIndex = React.useCallback(
    (index: number) => {
      // When animations are disabled (e.g. reduce motion), jump to the value.
      if (scale === 0) {
        tabsAnims.forEach((tab, i) => tab.setValue(i === index ? 1 : 0));
        return;
      }

      Animated.parallel(
        navigationState.routes.map((_, i) => {
          const toValue = i === index ? 1 : 0;
          // Spring the active indicator for the M3-Expressive selection motion.
          // A custom `animationEasing` opts back into timed (eased) movement.
          return animationEasing
            ? Animated.timing(tabsAnims[i], {
                toValue,
                duration: motion.duration.short4 * scale,
                easing: animationEasing,
                useNativeDriver: true,
              })
            : Animated.spring(tabsAnims[i], {
                toValue,
                ...toRawSpring(motion.spring.fast.spatial),
                useNativeDriver: true,
              });
        })
      ).start(() => {
        // Workaround a bug in native animations where this is reset after first animation
        tabsAnims.map((tab, i) => tab.setValue(i === index ? 1 : 0));
      });
    },
    [scale, navigationState.routes, tabsAnims, animationEasing, motion]
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

  const { backgroundColor: customBackground } = (StyleSheet.flatten(style) ||
    {}) as {
    elevation?: number;
    backgroundColor?: ColorValue;
  };

  const backgroundColor = customBackground || colors.surfaceContainer;

  const activeTintColor = getActiveTintColor({
    activeColor,
    theme,
  });

  const inactiveTintColor = getInactiveTintColor({
    inactiveColor,
    theme,
  });

  const maxTabWidth = routes.length > 3 ? MIN_TAB_WIDTH : MAX_TAB_WIDTH;
  const maxTabBarWidth = maxTabWidth * routes.length;

  const insets = {
    left: safeAreaInsets?.left ?? left,
    right: safeAreaInsets?.right ?? right,
    bottom: safeAreaInsets?.bottom ?? bottom,
  };

  return (
    <Surface
      elevation={0}
      testID={testID}
      style={[
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
      container
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
          {routes.map((route, index) => {
            const focused = navigationState.index === index;

            return (
              <NavigationBarItem
                key={route.key}
                route={route}
                focused={focused}
                active={tabsAnims[index]}
                labeled={labeled}
                variant={variant}
                activeTintColor={activeTintColor}
                inactiveTintColor={inactiveTintColor}
                activeColor={activeColor}
                inactiveColor={inactiveColor}
                renderIcon={renderIcon}
                renderLabel={renderLabel}
                renderTouchable={renderTouchable}
                getLabelText={getLabelText}
                getBadge={getBadge}
                getTestID={getTestID}
                getAccessibilityLabel={getAccessibilityLabel}
                onPress={() => onTabPress(eventForIndex(index))}
                onLongPress={() => onTabLongPress?.(eventForIndex(index))}
                activeIndicatorStyle={activeIndicatorStyle}
                labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
                theme={theme as Theme}
              />
            );
          })}
        </View>
      </Animated.View>
    </Surface>
  );
};

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;

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
    paddingVertical: 0,
  },
  iconContainer: {
    height: INDICATOR_HEIGHT,
    width: INDICATOR_HEIGHT,
    marginTop: 0,
    marginBottom: ICON_LABEL_GAP,
    marginHorizontal: 12,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    ...StyleSheet.absoluteFill,
    top: 4,
    alignItems: 'center',
  },
  labelContainer: {
    height: 16,
    paddingBottom: 2,
  },
  // eslint-disable-next-line react-native/no-color-literals
  label: {
    fontSize: 12,
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
  stackedContainer: {
    height: BAR_HEIGHT,
    justifyContent: 'center',
  },
  noLabelContainer: {
    height: NO_LABEL_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackedIndicator: {
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_BORDER_RADIUS,
    alignSelf: 'center',
  },
  stateLayerWrapper: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateLayer: {
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_BORDER_RADIUS,
  },
  horizontalContainer: {
    height: BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: INDICATOR_HEIGHT,
    paddingHorizontal: 16,
  },
  horizontalIndicator: {
    borderRadius: INDICATOR_BORDER_RADIUS,
  },
  horizontalLabel: {
    marginLeft: ICON_LABEL_GAP,
    textAlign: 'center',
    ...(Platform.OS === 'web'
      ? {
          whiteSpace: 'nowrap',
        }
      : null),
  },
});
