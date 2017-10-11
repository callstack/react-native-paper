/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform } from 'react-native';
import {
  DrawerItem,
  DrawerSection,
  withTheme,
  Checkbox,
  TouchableRipple,
  Paragraph,
  Colors,
} from 'react-native-paper';

const DrawerItemsData = [
  { label: 'Inbox', icon: 'inbox', key: 0 },
  { label: 'Starred', icon: 'star', key: 1 },
  { label: 'Sent mail', icon: 'send', key: 2 },
  { label: 'Colored label', icon: 'color-lens', key: 3 },
  { label: 'A very long title that will be truncated', icon: 'delete', key: 4 },
];

class DrawerItems extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    toggleTheme: PropTypes.func.isRequired,
  };

  state = {
    open: false,
    drawerItemIndex: 0,
    isDark: true,
  };

  _setDrawerItem = index => this.setState({ drawerItemIndex: index });

  _toggleTheme = () => {
    this.props.toggleTheme();
    this.setState({ isDark: !this.state.isDark });
  };

  render() {
    const { theme: { colors: { paper } } } = this.props;
    return (
      <View style={[styles.drawerContent, { backgroundColor: paper }]}>
        <DrawerSection label="Subheader">
          {DrawerItemsData.map((props, index) => (
            <DrawerItem
              {...props}
              key={props.key}
              color={props.key === 3 ? Colors.tealA200 : null}
              active={this.state.drawerItemIndex === index}
              onPress={() => this._setDrawerItem(index)}
            />
          ))}
          <TouchableRipple onPress={this._toggleTheme}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Paragraph>Dark Theme</Paragraph>
              <View pointerEvents="none">
                <Checkbox checked={this.state.isDark} />
              </View>
            </View>
          </TouchableRipple>
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
