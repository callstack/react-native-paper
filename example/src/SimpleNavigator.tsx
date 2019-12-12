import * as React from 'react';
import {
  createNavigatorFactory,
  useNavigationBuilder,
  DefaultNavigatorOptions,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { StackRouter, StackNavigationState } from '@react-navigation/routers';

export type SimpleNavigationProp = NavigationProp<
  ParamListBase,
  string,
  StackNavigationState,
  SimpleNavigatorOptions
>;

export type SimpleNavigatorOptions = {
  title?: string;
  headerShown?: boolean;
  header?: (props: {
    navigation: SimpleNavigationProp;
    scene: any;
    previous?: any;
  }) => React.ReactNode;
};

function SimpleNavigator(
  props: DefaultNavigatorOptions<SimpleNavigatorOptions>
) {
  const { state, descriptors } = useNavigationBuilder(StackRouter, props);
  const route = state.routes[state.index];
  const { render, options, navigation } = descriptors[route.key];

  return (
    <>
      {options.headerShown !== false &&
        options.header &&
        options.header({
          navigation,
          scene: { descriptor: descriptors[route.key] },
          previous:
            state.index === 0
              ? undefined
              : { descriptor: descriptors[state.routes[state.index - 1].key] },
        })}
      {render()}
    </>
  );
}

export const createSimpleNavigator = createNavigatorFactory<
  SimpleNavigatorOptions,
  typeof SimpleNavigator
>(SimpleNavigator);
