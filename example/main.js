/* @flow */

import Expo from 'expo';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import {
  DrawerItem,
  DrawerSection,
  Provider as PaperProvider,
  withTheme,
  DarkTheme,
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
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };
  state = {
    open: false,
    drawerItemIndex: 0,
  };
  _setDrawerItem = index => this.setState({ drawerItemIndex: index });

  render() {
    const { theme: { colors: { paper } } } = this.props;
    return (
      <View style={[styles.drawerContent, { backgroundColor: paper }]}>
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
const ThemedDrawerItems = withTheme(DrawerItems);

const App = DrawerNavigator(
  { Home: { screen: RootNavigator } },
  { contentComponent: () => <ThemedDrawerItems /> }
);

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 22,
  },
});

Expo.registerRootComponent(() =>
  <PaperProvider theme={DarkTheme}>
    <App />
  </PaperProvider>
);
