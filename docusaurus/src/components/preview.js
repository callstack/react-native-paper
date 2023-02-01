import * as React from 'react';
import { Button } from 'react-native-paper';

const MyComponent = () => (
  <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
    Doodle dome
  </Button>
);

export default MyComponent;