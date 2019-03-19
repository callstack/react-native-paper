
import * as React from 'react';
import { Portal, Text } from '..';

export default class MyComponent extends React.Component {
  render() {
    return (
      <Portal>
        <Text>This is rendered at a different place</Text>
      </Portal>
    );
  }
}
