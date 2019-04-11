
import * as React from 'react';
import { TextInput } from '..';

export default class MyComponent extends React.Component {
  state = {
    text: ''
  };

  render(){
    return (
      <TextInput
        label='Email'
        value={this.state.text}
        onChangeText={text => this.setState({ text })}
      />
    );
  }
}
