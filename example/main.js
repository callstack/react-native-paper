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
import { Colors, ThemeProvider, Drawer, TouchableRipple } from 'react-native-paper';
import { MaterialIcons as Icon } from '@exponent/vector-icons';
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
        <Drawer.DrawerGroup label='Components'>
          <Drawer.DrawerItem label='Ahmed' icon='airplay' />
          <Drawer.DrawerItem label='Ahmed' icon='airplay' active />
          <Drawer.DrawerItem label='Ahmed' />
          <Drawer.DrawerItem label='Ahmed' icon='airplay' />
        </Drawer.DrawerGroup>
      </View>
    );
  };

  render() {
    return (
      <ThemeProvider>
        <NavigationProvider router={Router}>
          <Drawer
            drawerWidth={(screenWidth * 80) / 100}
            onDrawerClose={this._closeDrawer}
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
