/* @flow */

import Expo, { KeepAwake } from 'expo';
import * as React from 'react';
import { StatusBar } from 'react-native';
import {
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
} from 'react-native-paper';
import { DrawerNavigator } from 'react-navigation';
import RootNavigator from './src/RootNavigator';
import DrawerItems from './DrawerItems';
import type { Theme } from 'react-native-paper/types';

type State = {
  theme: Theme,
};

const App = DrawerNavigator(
  { Home: { screen: RootNavigator } },
  {
    contentComponent: ({ screenProps }) => (
      <DrawerItems toggleTheme={screenProps.toggleTheme} />
    ),
  }
);

class PaperExample extends React.Component<{}, State> {
  state = {
    theme: DefaultTheme,
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
  }

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
        <KeepAwake />
      </PaperProvider>
    );
  }
}

Expo.registerRootComponent(PaperExample);
