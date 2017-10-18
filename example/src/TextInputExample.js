/* @flow */

import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Colors, TextInput } from 'react-native-paper';

export default class TextInputExample extends Component {
  static title = 'TextInput';

  state = {
    text: '',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.inputContainerStyle}
          label="Normal input"
          placeholder="Type something"
          helperText="Helper text"
          value={this.state.text}
          onChangeText={text => this.setState({ text })}
        />
        <TextInput
          disabled
          style={styles.inputContainerStyle}
          label="Disabled Input"
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 8,
  },
  inputContainerStyle: {
    margin: 8,
  },
});
