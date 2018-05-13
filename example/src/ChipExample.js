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
          <Chip onPress={() => {}} onDelete={() => {}}>
            Chip with delete button
          </Chip>
          <Chip icon="favorite">Chip with icon</Chip>
          <Chip
            avatar={<Image source={require('../assets/avatar.jpg')} />}
            onDelete={() => {}}
            style={styles.chip}
          >
            Chip with image
          </Chip>
        </View>
        <View style={styles.row}>
          <Chip>Simple Chip</Chip>
          <Chip selected>Selected chip</Chip>
          <Chip pressed>Pressed chip</Chip>
          <Chip icon="favorite" onDelete={() => {}} disabled>
            Disabled chip
          </Chip>
        </View>
        <View style={styles.row}>
          <Chip outlined>Chip with outline</Chip>
          <Chip outlined selected>
            Selected chip
          </Chip>
          <Chip outlined pressed>
            Pressed chip
          </Chip>
          <Chip icon="favorite" onDelete={() => {}} outlined disabled>
            Disabled chip
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
