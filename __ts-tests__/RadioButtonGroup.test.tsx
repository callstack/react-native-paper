
import * as React from 'react';
import { View } from 'react-native';
import { RadioButton, Text } from '..';

export default class MyComponent extends React.Component {
  state = {
    value: 'first',
  };

  render() {
    return(
      <RadioButton.Group
        onValueChange={value => this.setState({ value })}
        value={this.state.value}
      >
        <View>
          <Text>First</Text>
          <RadioButton value="first" />
        </View>
        <View>
          <Text>Second</Text>
          <RadioButton value="second" />
        </View>
      </RadioButton.Group>
    )
  }
}
