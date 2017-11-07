/* @flow */
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableRipple, withTheme, Paragraph } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class RippleExample extends React.Component<Props> {
  static title = 'Ripples';

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.row}>
          <TouchableRipple
            onPress={() => {}}
            rippleColor="rgba(0, 0, 0, .32)"
            borderless
          >
            <Icon name="fingerprint" size={50} />
          </TouchableRipple>
        </View>
        <TouchableRipple onPress={() => {}} rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.row}>
            <Paragraph>Press me</Paragraph>
          </View>
        </TouchableRipple>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default withTheme(RippleExample);
