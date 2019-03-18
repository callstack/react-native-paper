
import * as React from 'react';
import { Switch } from '..';

export default class MyComponent extends React.Component {
  state = {
    isSwitchOn: false,
  };

  render() {
    const { isSwitchOn } = this.state;
    return (
      <Switch
        value={isSwitchOn}
        onValueChange={() =>
          { this.setState({ isSwitchOn: !isSwitchOn }); }
        }
      />
    );
  }
}
