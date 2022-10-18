import * as React from 'react';
import { StyleSheet } from 'react-native';

import { MD3Elevation, Surface, Text } from 'react-native-paper';

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
});

export default SurfaceExample;
