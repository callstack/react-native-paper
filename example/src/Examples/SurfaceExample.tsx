import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { MD3Elevation, Surface, Text, MD3Colors } from 'react-native-paper';

import { useExampleTheme } from '..';
import { isWeb } from '../../utils';
import ScreenWrapper from '../ScreenWrapper';

const SurfaceExample = () => {
  const { isV3 } = useExampleTheme();

  const v2Elevation = [1, 2, 4, 8, 12];
  const baseElevation = isV3 ? Array.from({ length: 6 }) : v2Elevation;

  return (
    <ScreenWrapper
      contentContainerStyle={[styles.content, isWeb && styles.webContent]}
    >
      {baseElevation.map((e, i) => (
        <Surface
          key={i}
          style={[
            styles.surface,
            isV3 ? styles.v3Surface : { elevation: v2Elevation[i] },
          ]}
          {...(isV3 && { elevation: i as MD3Elevation })}
        >
          <Text variant="bodyLarge">
            {isV3 ? `Elevation ${i === 1 ? '(default)' : ''} ${i}` : `${e}`}
          </Text>
        </Surface>
      ))}

      <View style={styles.horizontalSurfacesContainer}>
        <Surface style={styles.horizontalSurface}>
          <Text style={styles.centerText}>Left</Text>
        </Surface>
        <Surface style={styles.horizontalSurface}>
          <Text style={styles.centerText}>Right</Text>
        </Surface>
      </View>
      <View style={styles.verticalSurfacesContainer}>
        <Surface style={styles.verticalSurface}>
          <Text style={styles.centerText}>Top</Text>
        </Surface>
        <Surface style={styles.verticalSurface}>
          <Text style={styles.centerText}>Bottom</Text>
        </Surface>
      </View>
    </ScreenWrapper>
  );
};

SurfaceExample.title = 'Surface';

const styles = StyleSheet.create({
  content: {
    padding: 24,
    alignItems: 'center',
  },
  webContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 0,
  },
  surface: {
    margin: 24,
    height: 80,
    width: 80,
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

  horizontalSurfacesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    borderColor: MD3Colors.tertiary50,
    padding: 10,
    borderWidth: 1,
  },
  horizontalSurface: {
    width: '48%',
  },

  verticalSurfacesContainer: {
    height: 400,
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 100,
    borderColor: MD3Colors.tertiary50,
    padding: 10,
    borderWidth: 1,
  },
  verticalSurface: {
    height: '48%',
    justifyContent: 'center',
  },

  centerText: {
    textAlign: 'center',
  },
});

export default SurfaceExample;
