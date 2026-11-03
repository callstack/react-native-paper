import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Surface, Text, Palette, List, IconButton } from 'react-native-paper';
import type { Elevation } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const elevationLevels: Elevation[] = [0, 1, 2, 3, 4, 5];

const AnimatedSurface = () => {
  const [index, setIndex] = React.useState(3);

  const level = elevationLevels[index];

  return (
    <View style={styles.scroll}>
      <Surface style={styles.surface} borderRadius={8} elevation={level}>
        <Text variant="bodySmall">{`Elevation ${level}`}</Text>
      </Surface>
      <View style={styles.actions}>
        <IconButton
          mode="contained-tonal"
          icon="minus"
          disabled={index === 0}
          onPress={() => setIndex(index - 1)}
        />
        <IconButton
          mode="contained-tonal"
          icon="plus"
          disabled={index === elevationLevels.length - 1}
          onPress={() => setIndex(index + 1)}
        />
      </View>
    </View>
  );
};

const SurfaceExample = () => {
  const elevationValues: Elevation[] = [0, 1, 2, 3, 4, 5];

  const renderSurface = (index: Elevation, mode: 'flat' | 'elevated') => (
    <Surface
      key={index}
      style={styles.surface}
      borderRadius={8}
      mode={mode}
      elevation={index}
    >
      <Text variant="bodySmall">{`Elevation ${index}`}</Text>
    </Surface>
  );

  return (
    <ScreenWrapper>
      <List.Section title="Elevated surface">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {elevationValues.map((elevation) =>
            renderSurface(elevation, 'elevated')
          )}
        </ScrollView>
      </List.Section>

      <List.Section title="Flat surface">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {elevationValues.map((elevation) => renderSurface(elevation, 'flat'))}
        </ScrollView>
      </List.Section>

      <List.Section title="Animated elevation">
        <AnimatedSurface />
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
            <Surface
              style={[styles.verticalSurface, styles.verticalSurfaceContent]}
            >
              <Text style={styles.centerText}>Top</Text>
            </Surface>
            <Surface
              style={[styles.verticalSurface, styles.verticalSurfaceContent]}
            >
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
  scroll: {
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  surface: {
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  horizontalSurfacesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    borderColor: Palette.tertiary50,
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
    borderColor: Palette.tertiary50,
    padding: 10,
    borderWidth: 1,
  },
  verticalSurface: {
    height: '48%',
  },
  verticalSurfaceContent: {
    justifyContent: 'center',
  },

  centerText: {
    textAlign: 'center',
  },
});

export default SurfaceExample;
