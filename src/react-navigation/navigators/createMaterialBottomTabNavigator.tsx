import * as React from 'react';

import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  ParamListBase,
  TabActionHelpers,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';

import type {
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationEventMap,
  MaterialBottomTabNavigationOptions,
} from '../types';
import MaterialBottomTabView from '../views/MaterialBottomTabView';

export type MaterialBottomTabNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap
> &
  TabRouterOptions &
  MaterialBottomTabNavigationConfig;

// This is just Docusaurus can parse the type and show it in the docs
export type Props = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };

  /**
   * Event which fires on long pressing on the tab in the tab bar.
   */
  onTabLongPress: { data: undefined; canPreventDefault: true };

  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Color of the tab bar when this tab is active. Only used when `shifting` is `true`.
   */
  tabBarColor?: string;

  /**
   * Label text of the tab displayed in the navigation bar. When undefined, scene title is used.
   */
  tabBarLabel?: string;

  /**
   * String referring to an icon in the `MaterialCommunityIcons` set, or a
   * function that given { focused: boolean, color: string } returns a React.Node to display in the navigation bar.
   */
  tabBarIcon?:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);

  /**
   * Badge to show on the tab icon, can be `true` to show a dot, `string` or `number` to show text.
   */
  tabBarBadge?: boolean | number | string;

  /**
   * Accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   */
  tabBarAccessibilityLabel?: string;

  /**
   * ID to locate this tab button in tests.
   */
  tabBarButtonTestID?: string;
} & MaterialBottomTabNavigatorProps;

/**
 * A material-design themed tab bar on the bottom of the screen that lets you switch between different routes with animation. Routes are lazily initialized - their screen components are not mounted until they are first focused.
 *
 * This is a convenient wrapper which provides prebuilt [React Navigation's Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator/) integration so users can easily import it and use and don’t want to deal with setting up a custom tab bar.
 * :::info
 * To use `createMaterialBottomTabNavigator` ensure that you have installed [`@react-navigation/native` and its dependencies (follow this guide)](https://reactnavigation.org/docs/getting-started),
 * :::
 *
 *  <div class="screenshots">
 *   <img class="medium" src="screenshots/material-bottom-tabs.gif" />
 *  </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
 *
 * const Tab = createMaterialBottomTabNavigator();
 *
 * function MyTabs() {
 *   return (
 *     <Tab.Navigator>
 *       <Tab.Screen name="Home" component={HomeScreen} />
 *       <Tab.Screen name="Settings" component={SettingsScreen} />
 *     </Tab.Navigator>
 *   );
 * }
 * export default MyTabs;
 *
 * ```
 */
function MaterialBottomTabNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  screenListeners,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      MaterialBottomTabNavigationOptions,
      MaterialBottomTabNavigationEventMap
    >(TabRouter, {
      id,
      initialRouteName,
      backBehavior,
      children,
      screenListeners,
      screenOptions,
    });

  return (
    <NavigationContent>
      <MaterialBottomTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

MaterialBottomTabNavigator.displayName = 'createMaterialBottomTabNavigator';
export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap,
  React.ComponentType<MaterialBottomTabNavigatorProps> /** Hack to sutisfies TS given the Prop type created for Docusaurus */
>(
  MaterialBottomTabNavigator as React.ComponentType<MaterialBottomTabNavigatorProps>
);
