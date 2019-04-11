
import * as React from 'react';
import { View } from 'react-native';
import { ToggleButton } from '..';

export default class MyComponent extends React.Component {
  state = {
    value: 'left',
  };

  render() {
    return(
      <ToggleButton.Group
        onValueChange={value => this.setState({ value })}
        value={this.state.value}
      >
          <ToggleButton icon="format-align-left" value="left" />
          <ToggleButton icon="format-align-right" value="right" />
      </ToggleButton.Group>
    )
  }
}
