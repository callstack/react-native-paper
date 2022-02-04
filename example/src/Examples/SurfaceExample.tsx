import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Surface, useTheme, MD3Elevation } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const v2Elevation = [undefined, 1, 2, 4, 8, 12];

const SurfaceExample = () => {
  const { isV3 } = useTheme();

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Surface
          key={i}
          style={[
            styles.surface,
            isV3 ? styles.v3Surface : { elevation: v2Elevation[i] },
          ]}
          elevation={i as MD3Elevation}
        >
          <Text variant="body-large">
            Elevation {i === 1 && '(default)'} {i}
          </Text>
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
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  v3Surface: {
    borderRadius: 16,
    height: 200,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SurfaceExample;
