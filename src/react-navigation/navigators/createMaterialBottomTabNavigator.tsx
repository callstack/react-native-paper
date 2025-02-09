import * as React from 'react';

import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  NavigatorTypeBagBase,
  ParamListBase,
  StaticConfig,
  TabActionHelpers,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  TypedNavigator,
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
  undefined,
  TabNavigationState<ParamListBase>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap,
  typeof MaterialBottomTabView
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

export default function <
  const ParamList extends ParamListBase,
  const NavigatorID extends string | undefined,
  const TypeBag extends NavigatorTypeBagBase = {
    ParamList: ParamList;
    NavigatorID: NavigatorID;
    State: TabNavigationState<ParamList>;
    ScreenOptions: MaterialBottomTabNavigationOptions;
    EventMap: MaterialBottomTabNavigationEventMap;
    NavigationList: {
      [RouteName in keyof ParamList]: MaterialBottomTabNavigatorProps;
    };
    Navigator: typeof MaterialBottomTabNavigator;
  },
  const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>
>(config?: Config): TypedNavigator<TypeBag, Config> {
  return createNavigatorFactory(MaterialBottomTabNavigator)(config);
}
