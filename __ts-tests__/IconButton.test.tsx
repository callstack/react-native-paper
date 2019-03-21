
import * as React from 'react';
import { IconButton, Colors } from '..';

const MyComponent = () => (
  <IconButton
    icon="add-a-photo"
    color={Colors.red500}
    size={20}
    onPress={() => console.log('Pressed')}
  />
);

export default MyComponent;
