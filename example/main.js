/* @flow */

import Exponent from 'exponent';
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import { Colors, ThemeProvider, Drawer } from 'react-native-paper';
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
  render() {
    return (
      <ThemeProvider>
        <NavigationProvider router={Router}>
        <Drawer
          drawerWidth={(screenWidth * 80) / 100}
          onDrawerClose={this._closeDrawer}
          open={this.state.open}
          navigationView={<View style={{ flex: 1 }}>
            <Drawer.DrawerItem text='Ahmed' icon='airplay' />
            <Drawer.DrawerItem text='Ahmed' icon='airplay' active />
            <Drawer.DrawerItem text='Ahmed' icon='airplay' />
            <Drawer.DrawerItem text='Ahmed' icon='airplay' />
          </View>}
        >
          <StackNavigation
            defaultRouteConfig={{
              navigationBar: {
                title: 'Examples',
                tintColor: Colors.white,
                backgroundColor: Colors.indigo500,
                renderLeft: () => (
                  <TouchableOpacity
                    onPress={this._openDrawer}
                    style={{ margin: 8 }}
                  >
                    <Icon
                      name='menu'
                      size={24}
                      color='white'
                    />
                  </TouchableOpacity>
                  ),
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
