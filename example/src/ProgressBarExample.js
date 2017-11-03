/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Paragraph, Colors, withTheme } from 'react-native-paper';

class ProgressBarExample extends Component {
  static title = 'Progress bar';
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Paragraph>ProgressBar primary color</Paragraph>
        <ProgressBar progress={0.5} />
        <Paragraph>ProgressBar custom color</Paragraph>
        <ProgressBar progress={0.5} color={Colors.red800} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default withTheme(ProgressBarExample);
