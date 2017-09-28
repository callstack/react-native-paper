/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform } from 'react-native';
import { DrawerItem, DrawerSection, withTheme } from 'react-native-paper';

const DrawerItemsData = [
  { label: 'Inbox', icon: 'inbox', key: 0 },
  { label: 'Starred', icon: 'star', key: 1 },
  { label: 'Sent mail', icon: 'send', key: 2 },
  { label: 'A very long title that will be truncated', icon: 'delete', key: 3 },
];

class DrawerItems extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    toggleTheme: PropTypes.func.isRequired,
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
          {DrawerItemsData.map((props, index) => (
            <DrawerItem
              {...props}
              key={props.key}
              active={this.state.drawerItemIndex === index}
              onPress={() => this._setDrawerItem(index)}
            />
          ))}
          <DrawerItem
            label="Toggle Theme"
            key={4}
            onPress={this.props.toggleTheme}
          />
        </DrawerSection>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 22,
  },
});

export default withTheme(DrawerItems);
