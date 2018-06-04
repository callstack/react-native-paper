/* @flow */

import Expo, { KeepAwake } from 'expo';
import * as React from 'react';
import { StatusBar } from 'react-native';
import {
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
} from 'react-native-paper';
import createReactContext from 'create-react-context';
import { createDrawerNavigator } from 'react-navigation';
import RootNavigator from './src/RootNavigator';
import DrawerItems from './DrawerItems';
import type { Theme } from 'react-native-paper/types';

type State = {
  theme: Theme,
};

const ThemeToggleContext: any = createReactContext();

const App = createDrawerNavigator(
  { Home: { screen: RootNavigator } },
  {
    contentComponent: () => (
      <ThemeToggleContext.Consumer>
        {toggleTheme => <DrawerItems toggleTheme={toggleTheme} />}
      </ThemeToggleContext.Consumer>
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
    this.setState(state => ({
      theme: state.theme === DarkTheme ? DefaultTheme : DarkTheme,
    }));

  render() {
    return (
      <PaperProvider theme={this.state.theme}>
        <ThemeToggleContext.Provider value={this._toggleTheme}>
          <App
            persistenceKey={
              process.env.NODE_ENV !== 'production'
                ? 'NavigationStateDEV'
                : null
            }
          />
        </ThemeToggleContext.Provider>
        <KeepAwake />
      </PaperProvider>
    );
  }
}

Expo.registerRootComponent(PaperExample);
