/* @flow */

import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import { Toolbar } from 'react-native-paper';
import ExampleList, { examples } from './ExampleList';

const routes = Object.keys(examples)
  .map(id => ({ id, item: examples[id] }))
  .reduce((acc, { id, item }) => {
    const Comp = item;
    const Screen = props => <Comp {...props} />;

    Screen.navigationOptions = props => ({
      header: (
        <Toolbar>
          <Toolbar.BackAction onPress={() => props.navigation.goBack()} />
          <Toolbar.Content title={(Comp: any).title} />
        </Toolbar>
      ),
      /* $FlowFixMe */
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
        <Toolbar>
          <Toolbar.Action
            icon="menu"
            onPress={() => navigation.navigate('DrawerOpen')}
          />
          <Toolbar.Content title="Examples" />
        </Toolbar>
      ),
    }),
  }
);
