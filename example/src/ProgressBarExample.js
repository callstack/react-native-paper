/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Paragraph, Colors } from 'react-native-paper';

export default class ProgressBarExample extends Component {
  static title = 'Progress bar';

  render() {
    return (
      <View style={styles.container}>
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
    padding: 16,
  },
});
