/* @flow */

import Exponent from 'exponent';
import React, { Component } from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import {
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import { Colors, ThemeProvider, Drawer } from 'react-native-paper';
import Router from './src/Router';

const {
  width: screenWidth,
} = Dimensions.get('window');

class App extends Component {
  state = {
    open: false,
  }
  _openDrawer = () => {
    this.setState({ open: true });
  }
  _closeDrawer = () => {
    this.setState({ open: false });
  }
  _renderDrawerItems = () => {
    return (
      <View style={{ flex: 1 }}>
        <Drawer.Group label='Components'>
          <Drawer.Item label='Ahmed' icon='airplay' />
          <Drawer.Item label='Ahmed' icon='airplay' active />
          <Drawer.Item label='Ahmed' />
          <Drawer.Item label='Kalam kteeer gedannnnnnn udfgdhsfgjhdsfgjdhsgf sdhfg ds' icon='airplay' />
        </Drawer.Group>
      </View>
    );
  };

  render() {
    return (
      <ThemeProvider>
        <NavigationProvider router={Router}>
          <Drawer
            drawerWidth={(screenWidth * 80) / 100}
            onOpen={this._openDrawer}
            onClose={this._closeDrawer}
            open={this.state.open}
            navigationView={this._renderDrawerItems()}
          >
            <StackNavigation
              defaultRouteConfig={{
                navigationBar: {
                  title: 'Examples',
                  tintColor: Colors.white,
                  backgroundColor: Colors.indigo500,
                },
              }}
              initialRoute={Router.getRoute('home')}
            />
          </Drawer>
        </NavigationProvider>
      </ThemeProvider>
    );
  }
}
Exponent.registerRootComponent(App);
