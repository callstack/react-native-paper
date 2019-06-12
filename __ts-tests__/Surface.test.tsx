
import * as React from 'react';
import { Surface, Text } from '..';
import { StyleSheet } from 'react-native';

const MyComponent = () => (
  <Surface style={styles.surface}>
     <Text>Surface</Text>
  </Surface>
);

export default MyComponent;

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
