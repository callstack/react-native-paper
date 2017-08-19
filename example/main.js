/* @flow */

import Expo from 'expo';
import React, { Component } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import {
  DrawerItem,
  DrawerSection,
  Provider as PaperProvider,
} from 'react-native-paper';
import { DrawerNavigator } from 'react-navigation';
import RootNavigator from './src/RootNavigator';

StatusBar.setBarStyle('light-content');

const DrawerItemsData = [
  { label: 'Inbox', icon: 'inbox', key: 0 },
  { label: 'Starred', icon: 'star', key: 1 },
  { label: 'Sent mail', icon: 'send', key: 2 },
  { label: 'A very long title that will be truncated', icon: 'delete', key: 3 },
  { label: 'No Icon', key: 4 },
];

class DrawerItems extends Component {
  state = {
    open: false,
    drawerItemIndex: 0,
  };

  _setDrawerItem = index => this.setState({ drawerItemIndex: index });

  render() {
    return (
      <View style={styles.drawerContent}>
        <DrawerSection label="Subheader">
          {DrawerItemsData.map((props, index) =>
            <DrawerItem
              {...props}
              key={props.key}
              active={this.state.drawerItemIndex === index}
              onPress={() => this._setDrawerItem(index)}
            />
          )}
        </DrawerSection>
      </View>
    );
  }
}

const App = DrawerNavigator(
  { Home: { screen: RootNavigator } },
  { contentComponent: () => <DrawerItems /> }
);

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 25 : 22,
  },
});

Expo.registerRootComponent(() =>
  <PaperProvider>
    <App onNavigationStateChange={null} />
  </PaperProvider>
);
