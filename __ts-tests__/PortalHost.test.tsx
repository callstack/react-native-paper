
import * as React from 'react';
import { Text } from 'react-native';
import { Portal } from '..';

export default class MyComponent extends React.Component {
  render() {
    return (
      <Portal.Host>
        <Text>Content of the app</Text>
      </Portal.Host>
    );
  }
}
