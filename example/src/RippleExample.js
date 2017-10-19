/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { TouchableRipple, withTheme, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

class RippleExample extends Component {
  static title = 'Ripples';
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };

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
