import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Chip,
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  FAB,
  LinearProgressIndicator,
  LinearWavyProgressIndicator,
  List,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  cancelAnimation,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import ScreenWrapper from '../ScreenWrapper';

const sizes = ['small', 'medium', 'large'] as const;
const shapes = ['flat', 'wavy'] as const;

type Size = (typeof sizes)[number];
type Shape = (typeof shapes)[number];

// Linear keeps the same thickness scale; circular grows its diameter on top of that. Flat and
// wavy circular have different baselines (40 vs 48dp), so each shape has its own size scale.
const sizeMap: Record<
  Size,
  { thickness: number; flatSize: number; wavySize: number }
> = {
  small: { thickness: 4, flatSize: 40, wavySize: 48 },
  medium: { thickness: 6, flatSize: 44, wavySize: 52 },
  large: { thickness: 8, flatSize: 48, wavySize: 56 },
};

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
  const [determinate, setDeterminate] = React.useState(true);
  const [size, setSize] = React.useState<Size>('small');
  const [shape, setShape] = React.useState<Shape>('flat');
  const [running, setRunning] = React.useState(false);
  const progress = useSharedValue(0);

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const indeterminate = !determinate;

  const { thickness, flatSize, wavySize } = sizeMap[size];
  const wavy = shape === 'wavy';
  const Linear = wavy ? LinearWavyProgressIndicator : LinearProgressIndicator;
  const Circular = wavy
    ? CircularWavyProgressIndicator
    : CircularProgressIndicator;
  const circularSize = wavy ? wavySize : flatSize;

  const linearWavyHeight = Math.max(10, thickness + 2 * 3);
  const linearPad = wavy ? 0 : (linearWavyHeight - thickness) / 2;
  const circularPad = wavy ? 0 : (wavySize - flatSize) / 2;

  const fabPadding = 16;
  const FILL_DURATION = 3000;

  const start = () => {
    const from = progress.value >= 1 ? 0 : progress.value;
    progress.value = from;
    progress.value = withTiming(
      1,
      { duration: FILL_DURATION * (1 - from) },
      (finished) => {
        if (finished) {
          scheduleOnRN(setRunning, false);
        }
      }
    );
    setRunning(true);
  };

  const pause = () => {
    cancelAnimation(progress);
    setRunning(false);
  };

  const handleFabPress = () => {
    if (running) {
      pause();
    } else {
      start();
    }
  };

  const handleDeterminateChange = (next: boolean) => {
    setDeterminate(next);
    if (next) {
      start();
    } else {
      cancelAnimation(progress);
      setRunning(false);
    }
  };

  React.useEffect(() => () => cancelAnimation(progress), [progress]);

  return (
    <View style={styles.screen}>
      <ScreenWrapper
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + fabPadding + 96 },
        ]}
      >
        <List.Item
          title="Determinate Mode"
          right={() => (
            <Switch
              value={determinate}
              onValueChange={handleDeterminateChange}
            />
          )}
        />
        <ChipRow label="Size" options={sizes} value={size} onChange={setSize} />
        <ChipRow
          label="Shape"
          options={shapes}
          value={shape}
          onChange={setShape}
        />

        <View style={styles.row}>
          <Text variant="bodyMedium">Linear</Text>
          <View style={{ paddingVertical: linearPad }}>
            <Linear
              progress={progress}
              indeterminate={indeterminate}
              thickness={thickness}
              accessibilityLabel="Linear progress indicator example"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ paddingVertical: linearPad }}>
            <Linear
              progress={progress}
              indeterminate={indeterminate}
              thickness={thickness}
              color={colors.tertiary}
              trackColor={colors.tertiaryContainer}
              accessibilityLabel="Linear progress indicator with custom colors"
            />
          </View>
        </View>

        <View style={styles.row}>
          <Text variant="bodyMedium">Circular</Text>
          <View style={[styles.circularRow, { paddingVertical: circularPad }]}>
            <Circular
              progress={progress}
              indeterminate={indeterminate}
              size={circularSize}
              thickness={thickness}
              accessibilityLabel="Circular progress indicator example"
            />
            <Circular
              progress={progress}
              indeterminate={indeterminate}
              size={circularSize}
              thickness={thickness}
              color={colors.tertiary}
              trackColor={colors.tertiaryContainer}
              accessibilityLabel="Circular progress indicator with custom colors"
            />
          </View>
        </View>
      </ScreenWrapper>
      <View
        pointerEvents="box-none"
        style={[
          styles.fabContainer,
          {
            bottom: insets.bottom + fabPadding,
            left: insets.left + fabPadding,
            right: insets.right + fabPadding,
          },
        ]}
      >
        <FAB
          icon={running ? 'pause' : 'play'}
          size="large"
          visible={determinate}
          onPress={handleFabPress}
          accessibilityLabel={running ? 'Pause progress' : 'Start progress'}
        />
      </View>
    </View>
  );
};

ProgressIndicatorExample.title = 'Progress Indicator';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
  fabContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ProgressIndicatorExample;
