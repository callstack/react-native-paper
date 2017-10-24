/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import { TextInput, withTheme } from 'react-native-paper';

class TextInputExample extends Component {
  static title = 'TextInput';
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };

  state = {
    text: '',
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <TextInput
          style={styles.inputContainerStyle}
          label="Normal input"
          placeholder="Type something"
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
    padding: 8,
  },
  inputContainerStyle: {
    margin: 8,
  },
});

export default withTheme(TextInputExample);
