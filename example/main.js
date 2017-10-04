/* @flow */

import Expo from 'expo';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import {
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
} from 'react-native-paper';
import { DrawerNavigator } from 'react-navigation';
import RootNavigator from './src/RootNavigator';
import DrawerItems from './DrawerItems';

StatusBar.setBarStyle('light-content');

const App = DrawerNavigator(
  { Home: { screen: RootNavigator } },
  {
    contentComponent: ({ screenProps }) => (
      <DrawerItems toggleTheme={screenProps.toggleTheme} />
    ),
  }
);

class PaperExample extends Component {
  state = {
    theme: DarkTheme,
  };

  _toggleTheme = () =>
    this.setState({
      theme: this.state.theme === DarkTheme ? DefaultTheme : DarkTheme,
    });

  render() {
    return (
      <PaperProvider theme={this.state.theme}>
        <App
          screenProps={{
            toggleTheme: this._toggleTheme,
            theme: this.state.theme,
          }}
        />
      </PaperProvider>
    );
  }
}

Expo.registerRootComponent(PaperExample);
