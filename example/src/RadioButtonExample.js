/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Paragraph, RadioButton, Colors } from 'react-native-paper';

export default class RadioButtonExample extends Component {
  static title = 'Radio button';

  state = {
    checkedNormal: true,
    checkedCustom: true,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Paragraph>Normal</Paragraph>
          <RadioButton
            checked={this.state.checkedNormal}
            onPress={() =>
              this.setState(state => ({ checkedNormal: !state.checkedNormal }))}
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Custom</Paragraph>
          <RadioButton
            color={Colors.blue500}
            checked={this.state.checkedCustom}
            onPress={() =>
              this.setState(state => ({ checkedCustom: !state.checkedCustom }))}
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Checked (Disabled)</Paragraph>
          <RadioButton checked disabled />
        </View>
        <View style={styles.row}>
          <Paragraph>Unchecked (Disabled)</Paragraph>
          <RadioButton checked={false} disabled />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
});
