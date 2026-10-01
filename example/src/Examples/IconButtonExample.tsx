import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Chip,
  IconButton,
  List,
  Palette,
  Text,
  useTheme,
} from 'react-native-paper';
import type {
  IconButtonMode,
  IconButtonShape,
  IconButtonSize,
  IconButtonWidth,
} from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const modes: IconButtonMode[] = ['standard', 'filled', 'tonal', 'outlined'];
const sizes: IconButtonSize[] = [
  'extraSmall',
  'small',
  'medium',
  'large',
  'extraLarge',
];
const widths: IconButtonWidth[] = ['narrow', 'default', 'wide'];
const shapes: IconButtonShape[] = ['round', 'square'];

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

const IconButtonExample = () => {
  const { colors } = useTheme();
  const [mode, setMode] = React.useState<IconButtonMode>('filled');
  const [size, setSize] = React.useState<IconButtonSize>('small');
  const [width, setWidth] = React.useState<IconButtonWidth>('default');
  const [shape, setShape] = React.useState<IconButtonShape>('round');
  const [selected, setSelected] = React.useState(false);
  const [toggles, setToggles] = React.useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <List.Section title="Playground">
        <ChipRow
          label="Color"
          options={modes}
          value={mode}
          onChange={setMode}
        />
        <ChipRow label="Size" options={sizes} value={size} onChange={setSize} />
        <ChipRow
          label="Width"
          options={widths}
          value={width}
          onChange={setWidth}
        />
        <ChipRow
          label="Shape"
          options={shapes}
          value={shape}
          onChange={setShape}
        />
        <View style={styles.playgroundRow}>
          <IconButton
            icon={selected ? 'camera' : 'camera-outline'}
            mode={mode}
            size={size}
            width={width}
            shape={shape}
            selected={selected}
            onPress={() => setSelected((value) => !value)}
            accessibilityLabel="Playground icon button"
          />
          <IconButton
            icon="camera"
            mode={mode}
            size={size}
            width={width}
            shape={shape}
            disabled
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            mode={mode}
            size={size}
            width={width}
            shape={shape}
            loading
            onPress={() => {}}
          />
        </View>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          Press the first button to toggle. Pressed and selected states morph
          the container shape.
        </Text>
      </List.Section>

      <List.Section title="Color styles">
        {modes.map((colorMode) => (
          <View key={colorMode} style={styles.colorRow}>
            <Text variant="labelLarge" style={styles.colorLabel}>
              {colorMode}
            </Text>
            <IconButton
              icon="star-outline"
              mode={colorMode}
              onPress={() => {}}
            />
            <IconButton
              icon="star-outline"
              mode={colorMode}
              selected={false}
              onPress={() => toggle(`${colorMode}-off`)}
            />
            <IconButton
              icon="star"
              mode={colorMode}
              selected
              onPress={() => {}}
            />
            <IconButton
              icon="star-outline"
              mode={colorMode}
              disabled
              onPress={() => {}}
            />
          </View>
        ))}
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          Default, toggle off, toggle on, disabled.
        </Text>
      </List.Section>

      <List.Section title="Sizes">
        <View style={styles.row}>
          {sizes.map((item) => (
            <IconButton
              key={item}
              icon="plus"
              mode="filled"
              size={item}
              onPress={() => {}}
              accessibilityLabel={`${item} icon button`}
            />
          ))}
        </View>
      </List.Section>

      <List.Section title="Widths">
        <View style={styles.row}>
          {widths.map((item) => (
            <IconButton
              key={item}
              icon="plus"
              mode="tonal"
              width={item}
              onPress={() => {}}
              accessibilityLabel={`${item} width icon button`}
            />
          ))}
        </View>
      </List.Section>

      <List.Section title="Shapes">
        <View style={styles.row}>
          <IconButton
            icon={toggles.round ? 'heart' : 'heart-outline'}
            mode="filled"
            shape="round"
            selected={!!toggles.round}
            onPress={() => toggle('round')}
          />
          <IconButton
            icon={toggles.square ? 'heart' : 'heart-outline'}
            mode="filled"
            shape="square"
            selected={!!toggles.square}
            onPress={() => toggle('square')}
          />
        </View>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          Round (default) and square. Toggle inverts the resting shape.
        </Text>
      </List.Section>

      <List.Section title="Custom">
        <View style={styles.row}>
          <IconButton
            icon="lock"
            iconColor={Palette.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="heart"
            mode="filled"
            containerColor={Palette.tertiary60}
            onPress={() => {}}
          />
          <IconButton
            icon="eye"
            mode="outlined"
            shape="square"
            onPress={() => {}}
          />
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

IconButtonExample.title = 'Icon Button';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chipRowLabel: {
    width: 56,
    marginRight: 8,
  },
  chipRowContent: {
    gap: 8,
    paddingVertical: 4,
  },
  playgroundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorLabel: {
    width: 88,
  },
});

export default IconButtonExample;
