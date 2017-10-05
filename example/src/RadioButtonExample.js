/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Paragraph,
  RadioButton,
  Colors,
  TouchableRipple,
} from 'react-native-paper';

export default class RadioButtonExample extends Component {
  static title = 'Radio button';

  state = {
    checked: 'normal',
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableRipple onPress={() => this.setState({ checked: 'normal' })}>
          <View style={styles.row}>
            <Paragraph>Normal</Paragraph>
            <View pointerEvents="none">
              <RadioButton
                value="normal"
                checked={this.state.checked === 'normal'}
              />
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => this.setState({ checked: 'custom' })}>
          <View style={styles.row}>
            <Paragraph>Custom</Paragraph>
            <View pointerEvents="none">
              <RadioButton
                value="custom"
                color={Colors.blue500}
                checked={this.state.checked === 'custom'}
              />
            </View>
          </View>
        </TouchableRipple>
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
