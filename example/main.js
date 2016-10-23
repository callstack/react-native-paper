/* @flow */

import Exponent from 'exponent';
import React, { Component } from 'react';
import {
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import { ThemeProvider } from 'react-native-paper';
import Router from './src/Router';

class App extends Component {
  render() {
    return (
      <ThemeProvider>
        <NavigationProvider router={Router}>
          <StackNavigation initialRoute={Router.getRoute('home')} />
        </NavigationProvider>
      </ThemeProvider>
    );
  }
}

Exponent.registerRootComponent(App);
