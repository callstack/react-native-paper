/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { TouchableRipple, withTheme, Paragraph } from 'react-native-paper';

class RippleExample extends Component {
  static title = 'Ripples';
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <TouchableRipple
        style={[styles.container, { backgroundColor: background }]}
        onPress={() => {}}
      >
        <View>
          <Paragraph>Press me</Paragraph>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withTheme(RippleExample);
