/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FAB, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class ButtonExample extends React.Component<Props> {
  static title = 'Floating Action Button';

  _handlePress = () => {};

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
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
