
import * as React from 'react';
import { Chip } from '..';

const MyComponent = () => (
  <Chip icon="info" selectedColor="#fff" onPress={() => console.log('Pressed')}>Example Chip</Chip>
);

export default MyComponent;
