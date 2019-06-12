
import * as React from 'react';
import { ToggleButton } from '..';

class ToggleButtonExample extends React.Component {
  state = {
    status: 'checked',
  };

  render() {
    return (
      <ToggleButton
        icon="bluetooth"
        value="bluetooth"
        // @ts-ignore
        status={this.state.status}
        onPress={value =>
          this.setState({
            // @ts-ignore
            status: value === 'checked' ? 'unchecked' : 'checked',
          })
        }
      />
    );
  }
}
