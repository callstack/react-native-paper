/* @flow */

import Expo from 'expo';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  NavigationProvider,
  StackNavigation,
} from '@expo/ex-navigation';
import {
  Colors,
  Drawer,
  Provider as PaperProvider,
} from 'react-native-paper';
import Router from './src/Router';


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

  _handleOpenDrawer = () => this.setState({ open: true })

  _handleCloseDrawer = () => this.setState({ open: false })

  _setDrawerItem = index => this.setState({ drawerItemIndex: index })

  _renderDrawerItems = () => {
    return (
      <View style={styles.drawerContent}>
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
      <PaperProvider>
        <NavigationProvider router={Router}>
          <Drawer
            onOpen={this._handleOpenDrawer}
            onClose={this._handleCloseDrawer}
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
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 25 : 22,
  },
});

Expo.registerRootComponent(App);
