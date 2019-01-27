/* @flow */

import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  type Theme,
} from 'react-native';
import { TextInput, HelperText, withTheme } from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  text: string,
  name: string,
  outlinedText: string,
};

class TextInputExample extends React.Component<Props, State> {
  static title = 'TextInput';

  state = {
    text: '',
    name: '',
    outlinedText: '',
  };

  _isUsernameValid = () => /^[a-zA-Z]*$/.test(this.state.name);

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior="padding"
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={[styles.container, { backgroundColor: background }]}
          keyboardShouldPersistTaps={'always'}
          removeClippedSubviews={false}
        >
          <TextInput
            style={styles.inputContainerStyle}
            label="Flat input"
            placeholder="Type something"
            value={this.state.text}
            onChangeText={text => this.setState({ text })}
          />
          <TextInput
            disabled
            style={styles.inputContainerStyle}
            label="Disabled flat input"
          />
          <TextInput
            mode="outlined"
            style={styles.inputContainerStyle}
            label="Outlined input"
            placeholder="Type something"
            value={this.state.outlinedText}
            onChangeText={outlinedText => this.setState({ outlinedText })}
          />
          <TextInput
            mode="outlined"
            disabled
            style={styles.inputContainerStyle}
            label="Disabled outlined input"
          />
          <View style={styles.inputContainerStyle}>
            <TextInput
              label="Input with helper text"
              placeholder="Enter username, only letters"
              value={this.state.name}
              error={!this._isUsernameValid()}
              onChangeText={name => this.setState({ name })}
            />
            <HelperText type="error" visible={!this._isUsernameValid()}>
              Error: Only letters are allowed
            </HelperText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  wrapper: {
    flex: 1,
  },
  inputContainerStyle: {
    margin: 8,
  },
});

export default withTheme(TextInputExample);
