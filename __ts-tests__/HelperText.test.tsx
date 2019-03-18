import * as React from 'react';
import { HelperText, TextInput } from '..';
import { View } from 'react-native';
export default class MyComponent extends React.Component {
  state = {
    text: ''
  };

  render(){
    return (
      <View>
        <TextInput
          label="Email"
          value={this.state.text}
          onChangeText={text => this.setState({ text })}
        />
        <HelperText
          type="error"
          visible={this.state.text.indexOf('@')!==-1}
        >
          Email address is invalid!
        </HelperText>
      </View>
    );
  }
}
