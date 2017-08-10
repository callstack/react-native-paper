/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Paragraph, Checkbox, Colors, withTheme } from 'react-native-paper';

class CheckboxExample extends Component {
  static title = 'Checkbox';
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };

  state = {
    checkedNormal: true,
    checkedCustom: true,
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.row}>
          <Paragraph>Normal</Paragraph>
          <Checkbox
            checked={this.state.checkedNormal}
            onPress={() =>
              this.setState(state => ({ checkedNormal: !state.checkedNormal }))}
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Custom</Paragraph>
          <Checkbox
            color={Colors.blue500}
            checked={this.state.checkedCustom}
            onPress={() =>
              this.setState(state => ({ checkedCustom: !state.checkedCustom }))}
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
    padding: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
});

export default withTheme(CheckboxExample);
