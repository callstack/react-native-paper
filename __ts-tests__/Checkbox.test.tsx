
import * as React from 'react';
import { Checkbox } from '..';

export default class MyComponent extends React.Component {
  state = {
    checked: false,
  };

  render() {
    const { checked } = this.state;
    return (
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => { this.setState({ checked: !checked }); }}
      />
    );
  }
}
