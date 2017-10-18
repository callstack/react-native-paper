/* @flow */

import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Colors, TextInput } from 'react-native-paper';

export default class TextInputExample extends Component {
  static title = 'TextInput';

  state = {
    text: '',
    errorTestText: '',
    hasError: false,
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
          helperText="Helper text"
          label="Disabled Input"
        />
        <TextInput
          style={styles.inputContainerStyle}
          label="Error input"
          placeholder="Type something & then unfocus"
          helperText="Helper: This will be replaced by error"
          value={this.state.errorTestText}
          onChangeText={errorTestText => this.setState({ errorTestText })}
          onBlur={() =>
            this.setState({ hasError: this.state.errorTestText !== 'fix' })}
          hasError={this.state.hasError}
          errorText="Error: Type fix to remove the error"
        />
        <TextInput
          disabled
          style={styles.inputContainerStyle}
          helperText="Helper: Disable styles should override error styles"
          label="Disabled with error"
          hasError
          errorText="Error: Type fix to remove the error"
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
