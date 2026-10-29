import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { Text, TouchableRipple, Button, Divider } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const RippleExample = () => {
  const [pressCount, setPressCount] = React.useState(0);
  const [debouncedPressCount, setDebouncedPressCount] = React.useState(0);
  const [lastPressTime, setLastPressTime] = React.useState<number | null>(null);

  const handleNormalPress = () => {
    const now = Date.now();
    setPressCount((prev) => prev + 1);
    setLastPressTime(now);
  };

  const handleDebouncedPress = () => {
    const now = Date.now();
    setDebouncedPressCount((prev) => prev + 1);
    setLastPressTime(now);
  };

  const resetCounters = () => {
    setPressCount(0);
    setDebouncedPressCount(0);
    setLastPressTime(null);
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Basic TouchableRipple
          </Text>
          <TouchableRipple
            style={styles.basicRipple}
            onPress={() => {}}
            rippleColor="rgba(0, 0, 0, .32)"
          >
            <View pointerEvents="none">
              <Text variant="bodyMedium">Press anywhere</Text>
            </View>
          </TouchableRipple>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Debounce Test
          </Text>
          
          <View style={styles.statsContainer}>
            <Text variant="bodyLarge">Normal Presses: {pressCount}</Text>
            <Text variant="bodyLarge">Debounced Presses: {debouncedPressCount}</Text>
            {lastPressTime && (
              <Text variant="bodyMedium" style={styles.timeText}>
                Last Press: {new Date(lastPressTime).toLocaleTimeString()}
              </Text>
            )}
          </View>

          <Text variant="bodySmall" style={styles.instructionText}>
            Try clicking rapidly on both buttons to see the difference:
          </Text>

          <TouchableRipple
            onPress={handleNormalPress}
            style={[styles.testButton, styles.normalButton]}
            rippleColor="rgba(33, 150, 243, 0.32)"
          >
            <View style={styles.buttonContent}>
              <Text variant="titleSmall" style={styles.normalButtonText}>
                Normal Button
              </Text>
              <Text variant="bodySmall" style={styles.buttonSubtext}>
                No debounce - all clicks counted
              </Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={handleDebouncedPress}
            debounce={500} // 500ms debounce
            style={[styles.testButton, styles.debouncedButton]}
            rippleColor="rgba(76, 175, 80, 0.32)"
          >
            <View style={styles.buttonContent}>
              <Text variant="titleSmall" style={styles.debouncedButtonText}>
                Debounced Button (500ms)
              </Text>
              <Text variant="bodySmall" style={styles.buttonSubtext}>
                Rapid clicks ignored within 500ms
              </Text>
            </View>
          </TouchableRipple>

          <Button mode="outlined" onPress={resetCounters} style={styles.resetButton}>
            Reset Counters
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

RippleExample.title = 'TouchableRipple';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  basicRipple: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  divider: {
    marginVertical: 16,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 16,
  },
  timeText: {
    marginTop: 8,
    color: '#666',
  },
  instructionText: {
    marginBottom: 16,
    color: '#666',
    textAlign: 'center',
  },
  testButton: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  normalButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  debouncedButton: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  buttonContent: {
    alignItems: 'center',
  },
  normalButtonText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  debouncedButtonText: {
    color: '#388e3c',
    fontWeight: 'bold',
  },
  buttonSubtext: {
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 8,
  },
});

export default RippleExample;
