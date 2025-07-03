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

function MaterialBottomTabNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  screenListeners,
  screenOptions,
  ...rest
}: MaterialBottomTabNavigatorProps) {
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

/**
 * @deprecated `createMaterialBottomTabNavigator` has been deprecated since `react-native-paper@5.14.0`.
 * Please use `@react-navigation/bottom-tabs` version `7.x` or higher and combine it with `BottomNavigation.Bar` for a Material Design look.
 */
export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap,
  typeof MaterialBottomTabNavigator
>(MaterialBottomTabNavigator);
