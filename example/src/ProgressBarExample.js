/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

export default class ProgressBarExample extends Component {
  static title = 'Progress bar';

  render() {
    return (
      <View style={styles.container}>
        <ProgressBar progress={0} />
        <ProgressBar progress={0.2} color="red" />
        <ProgressBar progress={0.4} />
        <ProgressBar progress={0.6} />
        <ProgressBar progress={0.8} />
        <ProgressBar progress={1} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
