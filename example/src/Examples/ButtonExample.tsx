import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button, Chip, List, Switch, Text, useTheme } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

type Mode = 'text' | 'outlined' | 'elevated' | 'filled' | 'tonal';
type SizeOption =
  | 'unset'
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large';
type ShapeOption = 'unset' | 'round' | 'square';
type IconPosition = 'leading' | 'trailing';

const MODES: Mode[] = ['filled', 'tonal', 'elevated', 'outlined', 'text'];
const SIZES: SizeOption[] = [
  'unset',
  'extra-small',
  'small',
  'medium',
  'large',
  'extra-large',
];
const SHAPES: ShapeOption[] = ['unset', 'round', 'square'];
const ICON_POSITIONS: IconPosition[] = ['leading', 'trailing'];

function OptionRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.optionRow}>
      <Text variant="labelLarge" style={styles.optionLabel}>
        {label}
      </Text>
      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            key={option}
            mode="outlined"
            compact
            showSelectedOverlay
            selected={value === option}
            onPress={() => onChange(option)}
            style={styles.chip}
          >
            {option}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const SwitchRow = ({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) => (
  <View style={styles.switchRow}>
    <Text variant="labelLarge">{label}</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const ButtonExample = () => {
  const theme = useTheme();
  const color = theme.colors.inversePrimary;

  // Playground state.
  const [mode, setMode] = React.useState<Mode>('filled');
  const [size, setSize] = React.useState<SizeOption>('unset');
  const [shape, setShape] = React.useState<ShapeOption>('unset');
  const [iconPosition, setIconPosition] =
    React.useState<IconPosition>('leading');
  const [showIcon, setShowIcon] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState(false);
  const [compact, setCompact] = React.useState(false);

  // Selected state for the static toggle showcase below.
  const [selectedToggles, setSelectedToggles] = React.useState<
    Record<string, boolean>
  >({});
  const toggle = (key: string) =>
    setSelectedToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ScreenWrapper>
      <List.Section title="Playground">
        <View style={styles.preview}>
          <Button
            mode={mode}
            size={size === 'unset' ? undefined : size}
            shape={shape === 'unset' ? undefined : shape}
            iconPosition={iconPosition}
            icon={showIcon ? 'camera' : undefined}
            disabled={disabled}
            loading={loading}
            selected={selected}
            // `compact` only affects the legacy (unset-size) button; the size
            // tokens own spacing once a size is set.
            compact={size === 'unset' && compact}
            onPress={() => {}}
            label="Play me"
          />
        </View>

        <OptionRow
          label="Mode"
          value={mode}
          options={MODES}
          onChange={setMode}
        />
        <OptionRow
          label="Size"
          value={size}
          options={SIZES}
          onChange={setSize}
        />
        <OptionRow
          label="Shape"
          value={shape}
          options={SHAPES}
          onChange={setShape}
        />

        <SwitchRow
          label="Show icon"
          value={showIcon}
          onValueChange={setShowIcon}
        />
        {showIcon && (
          <OptionRow
            label="Icon position"
            value={iconPosition}
            options={ICON_POSITIONS}
            onChange={setIconPosition}
          />
        )}
        <SwitchRow
          label="Disabled"
          value={disabled}
          onValueChange={setDisabled}
        />
        <SwitchRow label="Loading" value={loading} onValueChange={setLoading} />
        <SwitchRow
          label="Selected"
          value={selected}
          onValueChange={setSelected}
        />
        {/* `compact` is a no-op once a size is set, so only offer it for unset. */}
        {size === 'unset' && (
          <SwitchRow
            label="Compact"
            value={compact}
            onValueChange={setCompact}
          />
        )}
      </List.Section>

      <List.Section title="Modes">
        <View style={styles.row}>
          {MODES.map((m) => (
            <Button
              key={m}
              mode={m}
              onPress={() => {}}
              style={styles.button}
              label={m}
            />
          ))}
        </View>
      </List.Section>

      <List.Section title="States">
        <View style={styles.row}>
          <Button
            mode="filled"
            onPress={() => {}}
            style={styles.button}
            label="Enabled"
          />
          <Button
            mode="filled"
            disabled
            onPress={() => {}}
            style={styles.button}
            label="Disabled"
          />
          <Button
            mode="filled"
            loading
            onPress={() => {}}
            style={styles.button}
            label="Loading"
          />
        </View>
      </List.Section>

      <List.Section title="Size (expressive)">
        <View style={styles.row}>
          {SIZES.filter(
            (s): s is Exclude<SizeOption, 'unset'> => s !== 'unset'
          ).map((s) => (
            <Button
              key={s}
              mode="filled"
              size={s}
              icon="star"
              onPress={() => {}}
              style={styles.button}
              label={s}
            />
          ))}
        </View>
      </List.Section>

      <List.Section title="Shape (expressive)">
        {(['round', 'square'] as const).map((shapeVariant) => (
          <View key={shapeVariant} style={styles.row}>
            {(['extra-small', 'small', 'medium', 'large'] as const).map((s) => (
              <Button
                key={`${shapeVariant}-${s}`}
                mode="outlined"
                size={s}
                shape={shapeVariant}
                onPress={() => {}}
                style={styles.button}
                label={`${s} ${shapeVariant}`}
              />
            ))}
          </View>
        ))}
      </List.Section>

      <List.Section title="Toggle (expressive)">
        <View style={styles.row}>
          {(['outlined', 'text', 'tonal'] as const).map((m) => {
            const key = `toggle-${m}`;
            const isSelected = !!selectedToggles[key];
            return (
              <Button
                key={key}
                mode={m}
                size="small"
                shape="round"
                selected={isSelected}
                onPress={() => toggle(key)}
                style={styles.button}
                icon={isSelected ? 'check' : 'plus'}
                label={m}
              />
            );
          })}
        </View>
      </List.Section>

      <List.Section title="Custom">
        <View style={styles.row}>
          <Button
            mode="filled"
            buttonColor={color}
            onPress={() => {}}
            style={styles.button}
            label="Custom color"
          />
          <Button
            mode="outlined"
            icon={{
              uri: 'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400',
            }}
            onPress={() => {}}
            style={styles.button}
            label="Remote image"
          />
          <Button
            mode="outlined"
            icon={({ size: iconSize }) => (
              <Image
                source={require('../../assets/images/chameleon.jpg')}
                style={{
                  width: iconSize,
                  height: iconSize,
                  borderRadius: iconSize / 2,
                }}
                accessibilityIgnoresInvertColors
              />
            )}
            onPress={() => {}}
            style={styles.button}
            label="Custom component"
          />
          <Button
            icon="heart"
            mode="outlined"
            onPress={() => {}}
            style={styles.button}
            labelStyle={styles.fontStyles}
            label="Custom font"
          />
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.customRadius}
            label="Custom radius"
          />
        </View>
        <View style={styles.row}>
          <Button
            mode="filled"
            onPress={() => {}}
            style={styles.fullWidthButton}
            label="width: 100%"
          />
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

ButtonExample.title = 'Button';

const styles = StyleSheet.create({
  preview: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  optionLabel: {
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 12,
  },
  button: {
    margin: 4,
  },
  fontStyles: {
    fontWeight: '800',
    fontSize: 20,
  },
  customRadius: {
    margin: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 16,
  },
  fullWidthButton: {
    width: '100%',
    marginTop: 10,
  },
});

export default ButtonExample;
