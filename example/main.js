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

const DrawerItems = [
  { label: 'Inbox', icon: 'inbox', key: 0 },
  { label: 'Starred', icon: 'star', key: 1 },
  { label: 'Sent mail', icon: 'send', key: 2 },
  { label: 'A very long title that will be truncated', icon: 'delete', key: 3 },
  { label: 'No Icon', key: 4 },
];

class App extends Component {
  state = {
    open: false,
    drawerItemIndex: 0,
  }
  _openDrawer = () => this.setState({ open: true })

  _closeDrawer = () => this.setState({ open: false })

  _setDrawerItem = index => this.setState({ drawerItemIndex: index })

  _renderDrawerItems = () => {
    return (
      <View style={{ flex: 1, marginTop: 22 }}>
        <Drawer.Section label='Subheader'>
          {DrawerItems.map((props, index) => (
            <Drawer.Item
              {...props}
              key={props.key}
              active={this.state.drawerItemIndex === index}
              onPress={() => this._setDrawerItem(index)}
            />))}
        </Drawer.Section>
      </View>
    );
  };

  render() {
    return (
      <ThemeProvider>
        <NavigationProvider router={Router}>
          <Drawer
            width={(screenWidth * 80) / 100}
            onOpen={this._openDrawer}
            onClose={this._closeDrawer}
            open={this.state.open}
            content={this._renderDrawerItems()}
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
