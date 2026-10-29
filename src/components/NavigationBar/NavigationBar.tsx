import * as React from 'react';
import { Platform, StyleSheet, Pressable, View } from 'react-native';
import type { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native';

import Animated, {
  cubicBezier,
  type CSSStyle,
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BAR_HEIGHT,
  colorRoles,
  ICON_LABEL_GAP,
  ICON_SIZE,
  HORIZONTAL_INDICATOR_HEIGHT,
  INDICATOR_HEIGHT,
  INDICATOR_WIDTH,
  MAX_TAB_WIDTH,
  MIN_TAB_WIDTH,
  NO_LABEL_BAR_HEIGHT,
} from './tokens';
import {
  getActiveTintColor,
  getInactiveTintColor,
  getLabelColor,
  getStateLayerColor,
} from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { Theme, ThemeProp } from '../../theme/types';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import useIsKeyboardShown from '../../utils/useIsKeyboardShown';
import useLayout from '../../utils/useLayout';
import Badge from '../Badge';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type BaseRoute = {
  key: string;
  title?: string;
  focusedIcon?: IconSource;
  unfocusedIcon?: IconSource;
  badge?: string | number | boolean;
  'aria-label'?: string;
  testID?: string;
};

type NavigationState<Route extends BaseRoute> = {
  index: number;
  routes: Route[];
};

type TouchableProps<Route extends BaseRoute> = TouchableRippleProps & {
  key: string;
  route: Route;
  children: React.ReactNode;
  borderless?: boolean;
  centered?: boolean;
  rippleColor?: ColorValue;
  onKeyDown?: (event: TabKeyboardEvent) => void;
};

type TabKeyboardEvent = {
  key: string;
  currentTarget: unknown;
  preventDefault: () => void;
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
   * - `aria-label`: accessibility label for the tab button
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
   * Uses `route['aria-label']`, falling back to the label text (`getLabelText`)
   * so icon-only tabs keep an accessible name.
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
  onTabPress: (props: { route: Route }) => void;
  /**
   * Function to execute on tab long press. It receives the route for the pressed tab
   */
  onTabLongPress?: (props: { route: Route }) => void;
  /**
   * Custom color for icon and label in the active tab.
   */
  activeColor?: string;
  /**
   * Custom color for icon and label in the inactive tab.
   */
  inactiveColor?: string;
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
  style?: StyleProp<ViewStyle>;
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
  const { direction } = useLocale();

  const [hovered, setHovered] = React.useState(false);
  const [keyboardFocused, setKeyboardFocused] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const reduceMotion = useReduceMotion();

  const indicatorTransition: CSSStyle<ViewStyle> = {
    opacity: focused ? 1 : 0,
    transitionDuration: reduceMotion ? 0 : theme.motion.duration.medium2,
    transitionProperty: ['opacity', 'transform'],
    transitionTimingFunction: cubicBezier(...theme.motion.easing.emphasized),
  };

  const stackedIndicatorStyle: CSSStyle<ViewStyle> = {
    ...indicatorTransition,
    transform: [{ scaleX: focused ? 1 : 0.5 }],
  };

  const horizontalIndicatorStyle: CSSStyle<ViewStyle> = {
    ...indicatorTransition,
    transform: [{ scale: focused ? 1 : 0.8 }],
  };

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

  const stateLayerColor = getStateLayerColor({
    theme,
    pressed,
    keyboardFocused,
    hovered,
  });

  // React Native Web activates only `button`s with Space and keeps `role="tab"`
  // out of the tab order, so Space and the arrow keys the tabs pattern expects
  // are handled here. Native focus systems do not deliver these keys.
  const handleKeyDown = (event: TabKeyboardEvent) => {
    const { currentTarget, key } = event;

    if (!(currentTarget instanceof HTMLElement)) return;

    const tabs =
      currentTarget.parentElement?.querySelectorAll<HTMLElement>(
        '[role="tab"]'
      );

    if (!tabs || tabs.length === 0) return;

    const index = Array.prototype.indexOf.call(tabs, currentTarget);
    const step = direction === 'rtl' ? -1 : 1;
    let nextIndex: number | undefined;

    switch (key) {
      // `Enter` is activated by React Native Web, `Space` is not
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        onPress();
        return;
      case 'ArrowRight':
        nextIndex = (index + step + tabs.length) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - step + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    if (nextIndex !== undefined && nextIndex !== index) {
      event.preventDefault();
      tabs[nextIndex]?.focus();
    }
  };

  const itemTestID = getTestID({ route });

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
        focused ? route.focusedIcon : (route.unfocusedIcon ?? route.focusedIcon)
      }
      color={iconColor}
      size={ICON_SIZE}
    />
  );

  const tabBadge = (
    <View style={[styles.badgeContainer, badgeStyle]}>
      {typeof badge === 'boolean' ? (
        <Badge visible={badge} />
      ) : (
        <Badge visible={badge != null}>{badge}</Badge>
      )}
    </View>
  );

  const renderTabLabel = (
    labelStyle: StyleProp<TextStyle>,
    numberOfLines?: number
  ) =>
    renderLabel ? (
      renderLabel({ route, focused, color: labelColor })
    ) : (
      <Text
        maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        numberOfLines={numberOfLines}
        ellipsizeMode={numberOfLines ? 'tail' : undefined}
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
          style={[
            styles.stackedIndicator,
            { backgroundColor: colors[colorRoles.activeIndicator] },
            stackedIndicatorStyle,
            activeIndicatorStyle,
          ]}
        />
        <View pointerEvents="none" style={styles.stateLayerWrapper}>
          <View style={[styles.stateLayer, stateLayerColor]} />
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
          style={[
            StyleSheet.absoluteFill,
            styles.horizontalIndicator,
            { backgroundColor: colors[colorRoles.activeIndicator] },
            horizontalIndicatorStyle,
            activeIndicatorStyle,
          ]}
        />
        <View
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
        {renderTabLabel(styles.horizontalLabel, 1)}
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
    onFocus: (event) => {
      if (isKeyboardFocusEvent(event)) {
        setKeyboardFocused(true);
      }
    },
    onBlur: () => setKeyboardFocused(false),
    testID: itemTestID,
    'aria-label': getAccessibilityLabel({ route }),
    role: Platform.OS === 'ios' ? 'button' : 'tab',
    'aria-selected': focused,
    focusable: Platform.OS === 'web' ? true : undefined,
    onKeyDown: Platform.OS === 'web' ? handleKeyDown : undefined,
    style: horizontal ? styles.horizontalTouchable : styles.item,
    children: horizontal ? horizontalContent : stackedContent,
  });
};

/**
 * The Material Design 3 flexible navigation bar. It can easily be integrated
 * with [React Navigation's Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator/).
 *
 * Set the `variant` prop to `'horizontal'` to lay items out horizontally
 * (icon beside label) in medium-width windows.
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
    route['aria-label'] ?? getLabelText({ route }),
  getTestID = ({ route }: { route: Route }) => route.testID,
  activeColor,
  inactiveColor,
  keyboardHidesNavigationBar = Platform.OS === 'android',
  style,
  activeIndicatorStyle,
  labeled = true,
  variant = 'stacked',
  onTabPress,
  onTabLongPress,
  safeAreaInsets,
  labelMaxFontSizeMultiplier = 1,
  compact: compactProp,
  testID,
  theme: themeOverrides,
}: Props<Route>) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors, motion } = theme;
  const { bottom, left, right } = useSafeAreaInsets();
  const compact = compactProp ?? false;

  const reduceMotion = useReduceMotion();
  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  /**
   * Visibility of the navigation bar, visible state is 1 and invisible is 0.
   */
  const visible = useSharedValue(1);

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
    visible.value = withTiming(0, {
      // The bar slides out, so accelerate (exit).
      duration: motion.duration.short3,
      easing: Easing.bezier(...motion.easing.standardAccelerate),
      reduceMotion: reanimatedReduceMotion,
    });
  }, [motion, reanimatedReduceMotion, visible]);

  const handleKeyboardHide = React.useCallback(() => {
    visible.value = withTiming(
      1,
      {
        // The bar slides back in, so decelerate (enter).
        duration: motion.duration.short2,
        easing: Easing.bezier(...motion.easing.standardDecelerate),
        reduceMotion: reanimatedReduceMotion,
      },
      (finished) => {
        if (finished) {
          runOnJS(setKeyboardVisible)(false);
        }
      }
    );
  }, [motion, reanimatedReduceMotion, visible]);

  // Slide the bar down by its own height when the keyboard hides it.
  const barAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - visible.value) * layout.height }],
  }));

  useIsKeyboardShown({
    onShow: handleKeyboardShow,
    onHide: handleKeyboardHide,
  });

  const eventForIndex = (index: number) => {
    return { route: navigationState.routes[index] };
  };

  const { routes } = navigationState;

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
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: colors[colorRoles.container] },
        style,
        // When the keyboard hides the bar, slide it down by its own height and
        // absolutely position it so the content can sit below.
        keyboardHidesNavigationBar ? barAnimatedStyle : null,
        keyboardHidesNavigationBar && keyboardVisible ? styles.absolute : null,
      ]}
      pointerEvents={
        layout.measured
          ? keyboardHidesNavigationBar && keyboardVisible
            ? 'none'
            : 'auto'
          : 'none'
      }
      onLayout={onLayout}
      testID={testID}
    >
      <View style={styles.barContent}>
        <View
          key={`items-${variant === 'horizontal' && labeled ? 'horizontal' : 'stacked'}`}
          style={[
            styles.items,
            variant === 'horizontal' && labeled ? styles.horizontalItems : null,
            {
              marginBottom: insets.bottom,
              marginHorizontal: Math.max(insets.left, insets.right),
            },
            compact && {
              maxWidth: maxTabBarWidth,
            },
          ]}
          role={'tablist'}
        >
          {routes.map((route, index) => {
            const focused = navigationState.index === index;

            return (
              <NavigationBarItem
                key={route.key}
                route={route}
                focused={focused}
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
                theme={theme}
              />
            );
          })}
        </View>
      </View>
    </Animated.View>
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
  absolute: {
    position: 'absolute',
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
  horizontalTouchable: {
    flexGrow: 0,
    flexShrink: 1,
    maxWidth: MAX_TAB_WIDTH,
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
    borderRadius: cornerFull,
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
    borderRadius: cornerFull,
    overflow: 'hidden',
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
    height: HORIZONTAL_INDICATOR_HEIGHT,
    paddingHorizontal: 16,
  },
  horizontalIndicator: {
    borderRadius: cornerFull,
    overflow: 'hidden',
  },
  horizontalLabel: {
    flexShrink: 1,
    marginLeft: ICON_LABEL_GAP,
    textAlign: 'center',
    ...(Platform.OS === 'web'
      ? {
          whiteSpace: 'nowrap',
        }
      : null),
  },
  horizontalItems: {
    justifyContent: 'center',
  },
});
