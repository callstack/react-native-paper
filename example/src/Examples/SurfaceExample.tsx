import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const SurfaceExample = () => {
  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      {[1, 2, 4, 6, 12].map((i) => (
        <Surface key={i} style={[styles.surface, { elevation: i }]}>
          <Text>{i}</Text>
        </Surface>
      ))}
    </ScreenWrapper>
  );
};

SurfaceExample.title = 'Surface';

const styles = StyleSheet.create({
  content: {
    padding: 24,
    alignItems: 'center',
  },
  surface: {
    margin: 24,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SurfaceExample;
