/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Colors, FAB, withTheme } from 'react-native-paper';

class ButtonExample extends Component {
  static title = 'Floating Action Button';
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };

  _handlePress = () => {};

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
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

export default withTheme(ButtonExample);
