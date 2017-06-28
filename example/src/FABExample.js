/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FAB } from 'react-native-paper';

export default class ButtonExample extends Component {
  static title = 'Floating Action Button';

  _handlePress = () => {};

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <FAB
            small
            icon="add"
            style={styles.fab}
            onPress={this._handlePress}
          />
          <FAB icon="add" style={styles.fab} onPress={this._handlePress} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    padding: 4,
  },

  row: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fab: {
    margin: 8,
  },
});
