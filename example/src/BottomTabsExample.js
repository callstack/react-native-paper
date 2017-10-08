/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabs, Text, Paper } from 'react-native-paper';

const tabOptions = [
  {
    label: 'One',
    icon: 'adb',
  },
  {
    label: 'Two',
    icon: 'alarm',
  },
  {
    label: 'Three',
    icon: 'backup',
  },
];

export default class BottomTabsExample extends Component {
  static title = 'Bottom Tabs';

  state = {
    tabNumber: 0,
    shouldColorBg: false,
  };

  _handleTabChange = (newTabIndex /*, oldTabIndex */) => {
    this.setState(() => ({
      tabNumber: newTabIndex,
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <Paper style={styles.content}>
          <Text>Current Tab index:</Text>
          <Text>{this.state.tabNumber}</Text>
        </Paper>
        <BottomTabs
          onTabChange={this._handleTabChange}
          colorNavigationBackground
          tabs={tabOptions}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    height: 120,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 15,
  },
});
