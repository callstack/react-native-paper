import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Slider, Switch, Text, useTheme } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

type SliderSize = 'xs' | 's' | 'm' | 'l' | 'xl';
const SIZES: SliderSize[] = ['xs', 's', 'm', 'l', 'xl'];

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text
        variant="titleSmall"
        style={[styles.sectionTitle, { color: theme.colors.primary }]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
};

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const SliderExample = () => {
  const theme = useTheme();

  const [standardValue, setStandardValue] = React.useState(40);
  const [centeredValue, setCenteredValue] = React.useState(0);
  const [rangeValue, setRangeValue] = React.useState<[number, number]>([
    20, 75,
  ]);

  const [size, setSize] = React.useState<SliderSize>('m');
  const [vertical, setVertical] = React.useState(false);
  const [showIcon, setShowIcon] = React.useState(false);
  const [showStops, setShowStops] = React.useState(false);
  const [showValueIndicator, setShowValueIndicator] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const iconSource = showIcon ? 'volume-high' : undefined;
  const orientation = vertical ? 'vertical' : 'horizontal';

  return (
    <ScreenWrapper style={styles.container}>
      {/* Controls */}
      <Section title="Configuration">
        <Row label="Size">
          <View style={styles.sizeRow}>
            {SIZES.map((s) => (
              <Text
                key={s}
                onPress={() => setSize(s)}
                style={[
                  styles.sizeChip,
                  {
                    backgroundColor:
                      size === s
                        ? theme.colors.primaryContainer
                        : theme.colors.surfaceVariant,
                    color:
                      size === s
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {s.toUpperCase()}
              </Text>
            ))}
          </View>
        </Row>
        <Row label="Vertical">
          <Switch value={vertical} onValueChange={setVertical} />
        </Row>
        <Row label="Inset icon (m/l/xl)">
          <Switch value={showIcon} onValueChange={setShowIcon} />
        </Row>
        <Row label="Stop indicators (step=10)">
          <Switch value={showStops} onValueChange={setShowStops} />
        </Row>
        <Row label="Value indicator">
          <Switch
            value={showValueIndicator}
            onValueChange={setShowValueIndicator}
          />
        </Row>
        <Row label="Disabled">
          <Switch value={disabled} onValueChange={setDisabled} />
        </Row>
      </Section>

      {/* Sliders */}
      <Section title="Standard">
        <View
          style={[styles.sliderArea, vertical && styles.sliderAreaVertical]}
        >
          <Slider
            value={standardValue}
            onValueChange={setStandardValue}
            min={0}
            max={100}
            step={showStops ? 10 : 0}
            size={size}
            orientation={orientation}
            icon={iconSource}
            showStops={showStops}
            showValueIndicator={showValueIndicator}
            disabled={disabled}
            style={vertical ? styles.sliderVertical : styles.slider}
          />
        </View>
        <Text style={styles.valueText}>Value: {standardValue}</Text>
      </Section>

      <Section title="Centered">
        <View
          style={[styles.sliderArea, vertical && styles.sliderAreaVertical]}
        >
          <Slider.Centered
            value={centeredValue}
            onValueChange={setCenteredValue}
            min={-50}
            max={50}
            step={showStops ? 10 : 0}
            size={size}
            orientation={orientation}
            showStops={showStops}
            showValueIndicator={showValueIndicator}
            disabled={disabled}
            style={vertical ? styles.sliderVertical : styles.slider}
          />
        </View>
        <Text style={styles.valueText}>Value: {centeredValue}</Text>
      </Section>

      <Section title="Range">
        <View
          style={[styles.sliderArea, vertical && styles.sliderAreaVertical]}
        >
          <Slider.Range
            value={rangeValue}
            onValueChange={setRangeValue}
            min={0}
            max={100}
            step={showStops ? 10 : 0}
            size={size}
            orientation={orientation}
            showStops={showStops}
            showValueIndicator={showValueIndicator}
            disabled={disabled}
            style={vertical ? styles.sliderVertical : styles.slider}
          />
        </View>
        <Text style={styles.valueText}>
          Range: {rangeValue[0]} - {rangeValue[1]}
        </Text>
      </Section>
    </ScreenWrapper>
  );
};

SliderExample.title = 'Slider';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    flex: 1,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sizeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '600',
  },
  sliderArea: {
    marginTop: 8,
    marginBottom: 4,
  },
  sliderAreaVertical: {
    height: 200,
    alignItems: 'flex-start',
  },
  slider: {
    flex: 1,
  },
  sliderVertical: {
    height: '100%',
  },
  valueText: {
    opacity: 0.6,
    fontSize: 13,
    marginTop: 4,
  },
});

export default SliderExample;
