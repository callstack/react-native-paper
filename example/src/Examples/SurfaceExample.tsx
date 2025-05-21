import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Elevation, Surface, Text, Colors, List } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const SurfaceExample = () => {
  const elevationValues = Array.from({ length: 6 });

  const renderSurface = (index: number, mode: 'flat' | 'elevated') => (
    <Surface
      key={index}
      style={styles.surface}
      mode={mode}
      elevation={index as Elevation}
    >
      <Text variant="bodyLarge">
        `Elevation ${index === 1 ? '(default)' : ''} ${index}`
      </Text>
    </Surface>
  );

  return (
    <ScreenWrapper>
      <List.Section title="Elevated surface">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {elevationValues.map((_, index) => renderSurface(index, 'elevated'))}
        </ScrollView>
      </List.Section>

      <List.Section title="Flat surface">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {elevationValues.map((_, index) => renderSurface(index, 'flat'))}
        </ScrollView>
      </List.Section>

      <List.Section title="Layout">
        <View style={styles.content}>
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
        </View>
      </List.Section>
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 200,
    width: 200,
  },
  horizontalSurfacesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    borderColor: Colors.tertiary50,
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
    borderColor: Colors.tertiary50,
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
