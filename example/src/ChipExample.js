/* @flow */

import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Chip, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class ChipExample extends React.Component<Props> {
  static title = 'Chip';

  render() {
    const { colors } = this.props.theme;

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.row}>
          <Chip onPress={() => {}} style={styles.chip}>
            Simple Chip
          </Chip>
          <Chip onDelete={() => {}} style={styles.chip}>
            Chip with delete button
          </Chip>
          <Chip icon="info" style={styles.chip}>
            Chip with icon
          </Chip>
          <Chip
            icon={({ size }) => (
              <Image
                source={require('../assets/avatar.jpg')}
                style={{ height: size, width: size, borderRadius: size / 2 }}
              />
            )}
            onDelete={() => {}}
            style={styles.chip}
          >
            Chip with image
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
  },

  chip: {
    margin: 4,
  },
});

export default withTheme(ChipExample);
