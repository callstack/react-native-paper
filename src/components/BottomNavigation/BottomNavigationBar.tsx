import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { ColorValue } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import useLatestCallback from 'use-latest-callback';

import BottomNavigationItem from './BottomNavigationItem';
import { NavigationBarTokens } from './tokens';
import type { BarProps, BaseRoute } from './types';
import { resolveItemLayout } from './utils';
import { useInternalTheme } from '../../core/theming';
import useIsKeyboardShown from '../../utils/useIsKeyboardShown';
import useLayout from '../../utils/useLayout';

/**
 * A navigation bar which can easily be integrated with [React Navigation's Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator/).
 *
 * ## Usage
 * ### without React Navigation
 * ```js
 * import React from 'react';
 * import { useState } from 'react';
 * import { View } from 'react-native';
 * import { BottomNavigation, Text, Provider } from 'react-native-paper';
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
 *     </View>
 *   );
 * }
 *
 * export default function MyComponent() {
 *   const [index, setIndex] = useState(0);
 *
 *   const routes = [
 *     { key: 'home', title: 'Home', focusedIcon: 'home' },
 *     { key: 'settings', title: 'Settings', focusedIcon: 'cog' },
 *   ];
 *
 *   return (
 *     <Provider>
 *       {index === 0 ? <HomeScreen /> : <SettingsScreen />}
 *       <BottomNavigation.Bar
 *         navigationState={{ index, routes }}
 *         onTabPress={({ route }) => {
 *           const newIndex = routes.findIndex((r) => r.key === route.key);
 *           if (newIndex !== -1) {
 *             setIndex(newIndex);
 *           }
 *         }}
 *       />
 *     </Provider>
 *   );
 * }
 * ```
 */
const BottomNavigationBar = <Route extends BaseRoute>({
  navigationState,
  renderIcon,
  renderLabel,
  renderTouchable,
  getLabelText = ({ route }: { route: Route }) => route.title,
  getBadge = ({ route }: { route: Route }) => route.badge,
  getAccessibilityLabel = ({ route }: { route: Route }) => route['aria-label'],
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
  itemLayout = 'auto',
  safeAreaInsets,
  labelMaxFontSizeMultiplier = 1,
  compact: compactProp,
  testID,
  theme: themeOverrides,
}: BarProps<Route>) => {
  const theme = useInternalTheme(themeOverrides);
  const { bottom, left, right } = useSafeAreaInsets();
  const { scale } = theme.animation;
  const compact = compactProp ?? false;
  const shifting = shiftingProp ?? false;

  const visibleAnim = useSharedValue(1);
  const [layout, onLayout] = useLayout();
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  const handleKeyboardShow = useLatestCallback(() => {
    setKeyboardVisible(true);
    visibleAnim.value = withTiming(0, {
      duration: theme.motion.duration.short3 * scale,
    });
  });

  const handleKeyboardHide = useLatestCallback(() => {
    visibleAnim.value = withTiming(
      1,
      { duration: theme.motion.duration.short2 * scale },
      (finished) => {
        if (finished) {
          scheduleOnRN(setKeyboardVisible, false);
        }
      }
    );
  });

  useIsKeyboardShown({
    onShow: handleKeyboardShow,
    onHide: handleKeyboardHide,
  });

  const resolvedLayout = resolveItemLayout({
    itemLayout,
    width: layout.width,
  });

  const eventForIndex = useLatestCallback((index: number) => {
    const event = {
      route: navigationState.routes[index],
      defaultPrevented: false,
      preventDefault: () => {
        event.defaultPrevented = true;
      },
    };

    return event;
  });

  const handleItemPress = useLatestCallback((index: number) => {
    onTabPress(eventForIndex(index));
  });

  const handleItemLongPress = useLatestCallback((index: number) => {
    onTabLongPress?.(eventForIndex(index));
  });

  const getLabelTextStable = useLatestCallback(getLabelText);
  const getBadgeStable = useLatestCallback(getBadge);
  const getAccessibilityLabelStable = useLatestCallback(getAccessibilityLabel);
  const getTestIDStable = useLatestCallback(getTestID);
  const renderIconStable = useLatestCallback(renderIcon ?? (() => null));
  const renderLabelStable = useLatestCallback(renderLabel ?? (() => null));

  const { routes } = navigationState;
  const flattenedStyle = StyleSheet.flatten(style);
  const customBackground =
    flattenedStyle &&
    typeof flattenedStyle === 'object' &&
    'backgroundColor' in flattenedStyle
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- flattened style may carry a background override.
        (flattenedStyle.backgroundColor as ColorValue | undefined)
      : undefined;
  const backgroundColor =
    customBackground ?? theme.colors[NavigationBarTokens.colors.container];

  const maxTabWidth =
    routes.length > 3
      ? NavigationBarTokens.minTabWidth
      : NavigationBarTokens.maxTabWidth;
  const maxTabBarWidth = maxTabWidth * routes.length;

  const insets = {
    left: safeAreaInsets?.left ?? left,
    right: safeAreaInsets?.right ?? right,
    bottom: safeAreaInsets?.bottom ?? bottom,
  };

  const keyboardStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(
            visibleAnim.value,
            [0, 1],
            [layout.height, 0]
          ),
        },
      ],
    }),
    [layout.height]
  );

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.bar,
        keyboardHidesNavigationBar ? keyboardStyle : null,
        keyboardHidesNavigationBar && keyboardVisible ? styles.barHidden : null,
        style,
        layout.measured
          ? keyboardHidesNavigationBar && keyboardVisible
            ? styles.pointerEventsNone
            : styles.pointerEventsAuto
          : styles.pointerEventsNone,
      ]}
      onLayout={onLayout}
    >
      <View style={[styles.barContent, { backgroundColor }]}>
        <View
          style={[
            styles.items,
            resolvedLayout === 'horizontal'
              ? styles.horizontalItems
              : styles.verticalItems,
            {
              marginBottom: insets.bottom,
              marginHorizontal: Math.max(insets.left, insets.right),
            },
            compact && { maxWidth: maxTabBarWidth },
          ]}
          role="tablist"
        >
          {routes.map((route, index) => (
            <BottomNavigationItem
              key={route.key}
              route={route}
              focused={navigationState.index === index}
              labeled={labeled}
              shifting={shifting}
              itemLayout={resolvedLayout}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              renderIcon={renderIcon ? renderIconStable : undefined}
              renderLabel={renderLabel ? renderLabelStable : undefined}
              renderTouchable={renderTouchable}
              getLabelText={getLabelTextStable}
              getBadge={getBadgeStable}
              getAccessibilityLabel={getAccessibilityLabelStable}
              getTestID={getTestIDStable}
              onPress={() => handleItemPress(index)}
              onLongPress={
                onTabLongPress ? () => handleItemLongPress(index) : undefined
              }
              labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
              activeIndicatorStyle={activeIndicatorStyle}
              animationEasing={animationEasing}
              theme={theme}
            />
          ))}
        </View>
      </View>
    </Animated.View>
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
  barHidden: {
    position: 'absolute',
  },
  barContent: {
    alignItems: 'center',
    overflow: 'visible',
    minHeight: NavigationBarTokens.containerHeight,
  },
  items: {
    flexDirection: 'row',
    minHeight: NavigationBarTokens.containerHeight,
    ...(Platform.OS === 'web'
      ? {
          width: '100%',
        }
      : null),
  },
  verticalItems: {
    alignItems: 'stretch',
  },
  horizontalItems: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointerEventsNone: {
    pointerEvents: 'none',
  },
  pointerEventsAuto: {
    pointerEvents: 'auto',
  },
});
