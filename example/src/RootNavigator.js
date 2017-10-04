/* @flow */

import React from 'react';
import Expo from 'expo';
import { StackNavigator } from 'react-navigation';
import { Colors } from 'react-native-paper';
import ExampleList, { examples } from './ExampleList';

const routes = Object.keys(examples)
  .map(id => ({ id, item: examples[id] }))
  .reduce((acc, { id, item }) => {
    const Comp = item;
    const Screen = props => <Comp {...props} />;

    Screen.navigationOptions = {
      title: Comp.title,
      /* $FlowFixMe */
      ...Comp.navigationOptions,
    };

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
    navigationOptions: {
      headerTintColor: Colors.white,
      headerStyle: {
        backgroundColor: Colors.indigo500,
        paddingTop: Expo.Constants.statusBarHeight,
        height: 56 + Expo.Constants.statusBarHeight,
      },
    },
  }
);
