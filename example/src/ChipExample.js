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
          <Chip onPress={() => {}} onDelete={() => {}} style={styles.chip}>
            Chip with delete button
          </Chip>
          <Chip icon="favorite" style={styles.chip}>
            Chip with icon
          </Chip>
          <Chip
            avatar={<Image source={require('../assets/avatar.jpg')} />}
            onDelete={() => {}}
            style={styles.chip}
          >
            Chip with image
          </Chip>
          <Chip
            avatar={<Image source={require('../assets/avatar.jpg')} />}
            onDelete={() => {}}
            style={styles.chip}
            selected
          >
            Selected with image
          </Chip>
        </View>
        <View style={styles.row}>
          <Chip style={styles.chip}>Simple Chip</Chip>
          <Chip selected style={styles.chip}>
            Selected chip
          </Chip>
          <Chip
            icon="favorite"
            onDelete={() => {}}
            disabled
            style={styles.chip}
          >
            Disabled chip
          </Chip>
        </View>
        <View style={styles.row}>
          <Chip mode="outlined" style={styles.chip}>
            Chip with outline
          </Chip>
          <Chip mode="outlined" selected style={styles.chip}>
            Selected chip
          </Chip>
          <Chip
            icon="favorite"
            onDelete={() => {}}
            mode="outlined"
            disabled
            style={styles.chip}
          >
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
