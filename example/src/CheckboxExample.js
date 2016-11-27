/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Paragraph,
  Checkbox,
  Colors,
} from 'react-native-paper';

export default class CheckboxExample extends Component {

  static title = 'Checkbox';

  state = {
    checkedNormal: true,
    checkedCustom: true,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Paragraph>Normal</Paragraph>
          <Checkbox
            checked={this.state.checkedNormal}
            onPress={() => this.setState(state => ({ checkedNormal: !state.checkedNormal }))}
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Custom</Paragraph>
          <Checkbox
            color={Colors.blue500}
            checked={this.state.checkedCustom}
            onPress={() => this.setState(state => ({ checkedCustom: !state.checkedCustom }))}
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Checked (Disabled)</Paragraph>
          <Checkbox checked disabled />
        </View>
        <View style={styles.row}>
          <Paragraph>Unchecked (Disabled)</Paragraph>
          <Checkbox checked={false} disabled />
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
