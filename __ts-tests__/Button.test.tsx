
import * as React from 'react';
import { Button } from '..';

const MyComponent = () => (
  <Button icon="add-a-photo" mode="contained" onPress={() => console.log('Pressed')}>
    Press me
  </Button>
);

export default MyComponent;
