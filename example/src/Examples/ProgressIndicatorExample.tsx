import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Button,
  Chip,
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  LinearProgressIndicator,
  LinearWavyProgressIndicator,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  cancelAnimation,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import ScreenWrapper from '../ScreenWrapper';

const behaviors = ['determinate', 'indeterminate'] as const;
const thicknesses = ['4', '6', '8'] as const;

type Behavior = (typeof behaviors)[number];
type Thickness = (typeof thicknesses)[number];

type ChipRowProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

const ChipRow = <T extends string>({
  label,
  options,
  value,
  onChange,
}: ChipRowProps<T>) => (
  <View style={styles.chipRow}>
    <Text variant="labelLarge" style={styles.chipRowLabel}>
      {label}
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRowContent}
    >
      {options.map((option) => (
        <Chip
          key={option}
          selected={option === value}
          showSelectedOverlay
          onPress={() => onChange(option)}
        >
          {option}
        </Chip>
      ))}
    </ScrollView>
  </View>
);

const ProgressIndicatorExample = () => {
  const [behavior, setBehavior] = React.useState<Behavior>('indeterminate');
  const [thickness, setThickness] = React.useState<Thickness>('4');
  const progress = useSharedValue(0);

  const { colors } = useTheme();
  const indeterminate = behavior === 'indeterminate';
  const thicknessValue = Number(thickness);

  const FILL_DURATION = 5000;

  const startProgress = () => {
    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withTiming(1, { duration: FILL_DURATION });
  };

  const handleBehaviorChange = (next: Behavior) => {
    setBehavior(next);
    if (next === 'determinate') {
      startProgress();
    } else {
      cancelAnimation(progress);
    }
  };

  React.useEffect(() => () => cancelAnimation(progress), [progress]);

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <ChipRow
        label="Behavior"
        options={behaviors}
        value={behavior}
        onChange={handleBehaviorChange}
      />
      <ChipRow
        label="Thickness"
        options={thicknesses}
        value={thickness}
        onChange={setThickness}
      />

      <View style={styles.buttons}>
        <Button disabled={indeterminate} onPress={startProgress}>
          Start progress
        </Button>
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">Linear</Text>
        <LinearProgressIndicator
          progress={progress}
          indeterminate={indeterminate}
          thickness={thicknessValue}
          accessibilityLabel="Linear progress indicator example"
        />
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">Linear wavy</Text>
        <LinearWavyProgressIndicator
          progress={progress}
          indeterminate={indeterminate}
          thickness={thicknessValue}
          accessibilityLabel="Linear wavy progress indicator example"
        />
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">Linear with custom colors</Text>
        <LinearProgressIndicator
          progress={progress}
          indeterminate={indeterminate}
          thickness={thicknessValue}
          color={colors.tertiary}
          trackColor={colors.tertiaryContainer}
          accessibilityLabel="Linear progress indicator with custom colors"
        />
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">Circular</Text>
        <View style={styles.circularRow}>
          <CircularProgressIndicator
            progress={progress}
            indeterminate={indeterminate}
            thickness={thicknessValue}
            accessibilityLabel="Circular progress indicator example"
          />
          <CircularProgressIndicator
            progress={progress}
            indeterminate={indeterminate}
            thickness={thicknessValue}
            color={colors.tertiary}
            trackColor={colors.tertiaryContainer}
            accessibilityLabel="Circular progress indicator with custom colors"
          />
        </View>
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">Circular wavy</Text>
        <View style={styles.circularRow}>
          <CircularWavyProgressIndicator
            progress={progress}
            indeterminate={indeterminate}
            thickness={thicknessValue}
            accessibilityLabel="Circular wavy progress indicator example"
          />
          <CircularWavyProgressIndicator
            progress={progress}
            indeterminate={indeterminate}
            thickness={thicknessValue}
            color={colors.tertiary}
            trackColor={colors.tertiaryContainer}
            accessibilityLabel="Circular wavy progress indicator with custom colors"
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

ProgressIndicatorExample.title = 'Progress Indicator';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  chipRow: {
    paddingVertical: 4,
  },
  chipRowLabel: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  chipRowContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  buttons: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  circularRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
});

export default ProgressIndicatorExample;
