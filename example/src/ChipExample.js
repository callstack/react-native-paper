/* @flow */

import * as React from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Chip, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class ChipExample extends React.Component<Props> {
  static title = 'Chip';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.row}>
          <Chip
            onPress={() => {
              Alert.alert('Pressed', 'Chip pressed');
            }}
          >
            Example Chip
          </Chip>
        </View>
        <View style={styles.row}>
          <Chip
            onDelete={() => {
              Alert.alert('Delete', 'Delete pressed');
            }}
          >
            Example Chip
          </Chip>
        </View>
        <View style={styles.row}>
          <Chip icon="info">Example Chip</Chip>
        </View>
        <View style={styles.row}>
          <Chip
            icon={<Image source={require('../assets/avatar.png')} />}
            onDelete={() => {
              Alert.alert('Delete', 'Delete pressed');
            }}
          >
            Example Chip
          </Chip>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: 4,
  },
});

export default withTheme(ChipExample);
