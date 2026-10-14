import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Card,
  Divider,
  RangeSlider,
  Slider,
  Surface,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const SliderExample = () => {
  const theme = useTheme();

  // State values for various slider configurations
  const [continuousVal, setContinuousVal] = React.useState(45);
  const [discreteVal, setDiscreteVal] = React.useState(30);
  const [centeredVal, setCenteredVal] = React.useState(15);
  const [rangeVals, setRangeVals] = React.useState<[number, number]>([25, 75]);
  const [volumeVal, setVolumeVal] = React.useState(60);
  const [brightnessVal, setBrightnessVal] = React.useState(80);
  const [temperatureVal, setTemperatureVal] = React.useState(22);
  const [alwaysVisibleVal, setAlwaysVisibleVal] = React.useState(24);
  const [tertiaryVal, setTertiaryVal] = React.useState(70);
  const [disableAll, setDisableAll] = React.useState(false);

  // Custom tertiary theme for demonstrating theming capabilities
  const tertiaryTheme = React.useMemo(
    () => ({
      colors: {
        primary: theme.colors.tertiary,
        onPrimary: theme.colors.onTertiary,
        primaryContainer: theme.colors.tertiaryContainer,
        secondary: theme.colors.tertiary,
        surfaceContainerHighest: theme.colors.surfaceVariant,
      },
    }),
    [theme]
  );

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      {/* Intro Header */}
      <Surface style={styles.headerSurface} elevation={1}>
        <Text variant="headlineSmall" style={styles.title}>
          Material Design 3 Sliders
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sliders let users make selections from a range of values. Conforms to
          M3 specification with 16dp track, 4dp handle, 6dp gap, and stop
          indicators.
        </Text>
      </Surface>

      {/* Global Disable Toggle */}
      <View style={styles.toggleRow}>
        <Text variant="labelLarge">Disable all sliders</Text>
        <Switch value={disableAll} onValueChange={setDisableAll} />
      </View>

      <Divider style={styles.divider} />

      {/* 1. Continuous Slider */}
      <Card style={styles.card} mode="outlined">
        <Card.Title
          title="Continuous (Standard)"
          subtitle={`Current Value: ${Math.round(continuousVal)}`}
        />
        <Card.Content>
          <Text variant="bodySmall" style={styles.description}>
            Allows selection of a continuous value along a smooth range.
          </Text>
          <Slider
            value={continuousVal}
            onValueChange={setContinuousVal}
            min={0}
            max={100}
            disabled={disableAll}
            formatValueIndicator={(v) => `${Math.round(v)}%`}
          />
        </Card.Content>
      </Card>

      {/* 2. Value Indicator Formats & Behaviors */}
      <Card style={styles.card} mode="outlined">
        <Card.Title title="Value Indicator Formats & Behaviors" />
        <Card.Content>
          <Text variant="bodySmall" style={styles.description}>
            Always visible label with temperature formatting (°C):
          </Text>
          <Slider
            style={styles.visibleSlider}
            value={alwaysVisibleVal}
            onValueChange={setAlwaysVisibleVal}
            min={15}
            max={35}
            step={1}
            labelBehavior="visible"
            formatValueIndicator={(v) => `${v}°C`}
            disabled={disableAll}
          />

          <View style={styles.spacing} />

          <Text variant="bodySmall" style={styles.description}>
            {'Hidden value indicator (labelBehavior="gone"): '}
          </Text>
          <Slider
            value={temperatureVal}
            onValueChange={setTemperatureVal}
            min={0}
            max={50}
            labelBehavior="gone"
            disabled={disableAll}
          />
        </Card.Content>
      </Card>

      {/* 3. Discrete Slider with Steps & Tick Marks */}
      <Card style={styles.card} mode="outlined">
        <Card.Title
          title="Discrete (Stops & Tick Marks)"
          subtitle={`Current Value: ${discreteVal} (Step: 10)`}
        />
        <Card.Content>
          <Text variant="bodySmall" style={styles.description}>
            Restricts selection to predetermined steps with M3 stop indicators.
          </Text>
          <Slider
            value={discreteVal}
            onValueChange={setDiscreteVal}
            min={0}
            max={100}
            step={10}
            showTickMarks
            disabled={disableAll}
            formatValueIndicator={(v) => `${v}`}
          />
        </Card.Content>
      </Card>

      {/* 3. Centered Slider */}
      <Card style={styles.card} mode="outlined">
        <Card.Title
          title="Centered Slider"
          subtitle={`Balance: ${centeredVal > 0 ? `+${centeredVal}` : centeredVal}`}
        />
        <Card.Content>
          <Text variant="bodySmall" style={styles.description}>
            Active track originates from the center (origin: 0, range: -50 to
            +50).
          </Text>
          <Slider
            value={centeredVal}
            onValueChange={setCenteredVal}
            min={-50}
            max={50}
            step={5}
            centered
            origin={0}
            showTickMarks
            disabled={disableAll}
            formatValueIndicator={(v) => (v > 0 ? `+${v} dB` : `${v} dB`)}
          />
        </Card.Content>
      </Card>

      {/* 4. Range Slider */}
      <Card style={styles.card} mode="outlined">
        <Card.Title
          title="Range Slider (Dual Thumbs)"
          subtitle={`Selected: $${rangeVals[0]} – $${rangeVals[1]}`}
        />
        <Card.Content>
          <Text variant="bodySmall" style={styles.description}>
            Selects a minimum and maximum range between two independent handles.
          </Text>
          <RangeSlider
            values={rangeVals}
            onValueChange={setRangeVals}
            min={0}
            max={100}
            step={5}
            minSeparation={10}
            showTickMarks
            disabled={disableAll}
            formatValueIndicator={(v) => `$${v}`}
          />
        </Card.Content>
      </Card>

      {/* 5. With Icons */}
      <Card style={styles.card} mode="outlined">
        <Card.Title title="With Leading & Trailing Icons" />
        <Card.Content>
          <Text variant="bodySmall" style={styles.description}>
            Volume control:
          </Text>
          <Slider
            value={volumeVal}
            onValueChange={setVolumeVal}
            min={0}
            max={100}
            startIcon="volume-low"
            endIcon="volume-high"
            disabled={disableAll}
            formatValueIndicator={(v) => `${Math.round(v)}%`}
          />

          <View style={styles.spacing} />

          <Text variant="bodySmall" style={styles.description}>
            Display brightness:
          </Text>
          <Slider
            value={brightnessVal}
            onValueChange={setBrightnessVal}
            min={10}
            max={100}
            startIcon="brightness-4"
            endIcon="brightness-7"
            disabled={disableAll}
            formatValueIndicator={(v) => `${Math.round(v)}%`}
          />
        </Card.Content>
      </Card>

      {/* 7. Theming & Custom Colors */}
      <Card style={styles.card} mode="outlined">
        <Card.Title
          title="Theming (Tertiary Scheme)"
          subtitle={`Value: ${tertiaryVal}`}
        />
        <Card.Content>
          <Text variant="bodySmall" style={styles.description}>
            Custom theme with tertiary color roles and step ticks:
          </Text>
          <Slider
            value={tertiaryVal}
            onValueChange={setTertiaryVal}
            min={0}
            max={100}
            step={10}
            showTickMarks
            theme={tertiaryTheme}
            disabled={disableAll}
            formatValueIndicator={(v) => `${v}`}
          />
        </Card.Content>
      </Card>

      {/* 8. Disabled State Showcase */}
      <Card style={styles.card} mode="outlined">
        <Card.Title title="Disabled States" />
        <Card.Content>
          <Text variant="bodySmall" style={styles.description}>
            Disabled Continuous:
          </Text>
          <Slider value={40} disabled />

          <View style={styles.spacing} />

          <Text variant="bodySmall" style={styles.description}>
            Disabled Discrete with Ticks:
          </Text>
          <Slider
            value={60}
            min={0}
            max={100}
            step={20}
            showTickMarks
            disabled
          />

          <View style={styles.spacing} />

          <Text variant="bodySmall" style={styles.description}>
            Disabled Range:
          </Text>
          <RangeSlider values={[30, 70]} min={0} max={100} disabled />
        </Card.Content>
      </Card>
    </ScreenWrapper>
  );
};

SliderExample.title = 'Slider';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  headerSurface: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    opacity: 0.8,
    lineHeight: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  divider: {
    marginVertical: 12,
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 12,
    opacity: 0.75,
  },
  spacing: {
    height: 16,
  },
  visibleSlider: {
    marginTop: 48,
    marginBottom: 8,
  },
});

export default SliderExample;
