/* @flow */

import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native';
import {
  Toolbar,
  ToolbarContent,
  ToolbarAction,
  ToolbarBackAction,
} from 'react-native-paper';
import ExampleList, { examples } from './ExampleList';

const routes = Object.keys(examples)
  .map(id => ({ id, item: examples[id] }))
  .reduce((acc, { id, item }) => {
    const Comp = item;
    const Screen = props => <Comp {...props} />;

    Screen.navigationOptions = props => ({
      header: (
        <Toolbar
          dark
          statusBarHeight={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
        >
          <ToolbarBackAction onPress={() => props.navigation.goBack()} />
          <ToolbarContent title={(Comp: any).title} />
        </Toolbar>
      ),
      ...(typeof Comp.navigationOptions === 'function'
        ? Comp.navigationOptions(props)
        : Comp.navigationOptions),
    });

    return {
      ...acc,
      [id]: { screen: Screen },
    };
  }, {});

export default StackNavigator(
  {
    home: { screen: ExampleList },
    ...routes,
  },
  {
    navigationOptions: ({ navigation }) => ({
      header: (
        <Toolbar
          dark
          statusBarHeight={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
        >
          <ToolbarAction
            icon="menu"
            onPress={() => navigation.navigate('DrawerOpen')}
          />
          <ToolbarContent title="Examples" />
        </Toolbar>
      ),
    }),
  }
);
