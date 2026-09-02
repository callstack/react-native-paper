import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button, Chip, List, Switch, Text, useTheme } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

type Mode = 'text' | 'outlined' | 'elevated' | 'filled' | 'tonal';
type Size = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';
type Shape = 'round' | 'square';
type IconPosition = 'leading' | 'trailing';
/**
 * `selected` is nullable: leaving it undefined is a plain button, which MD3
 * colours differently from a toggle that happens to be unselected. A boolean
 * switch can't express all three, so this is a three-way.
 */
type ToggleState = 'off' | 'unselected' | 'selected';

const MODES: Mode[] = ['filled', 'tonal', 'elevated', 'outlined', 'text'];
const SIZES: Size[] = [
  'extra-small',
  'small',
  'medium',
  'large',
  'extra-large',
];
const SHAPES: Shape[] = ['round', 'square'];
const ICON_POSITIONS: IconPosition[] = ['leading', 'trailing'];
const TOGGLE_STATES: ToggleState[] = ['off', 'unselected', 'selected'];

const selectedFor = (state: ToggleState) =>
  state === 'off' ? undefined : state === 'selected';

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
  const [size, setSize] = React.useState<Size>('small');
  const [shape, setShape] = React.useState<Shape>('round');
  const [iconPosition, setIconPosition] =
    React.useState<IconPosition>('leading');
  const [showIcon, setShowIcon] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [toggleState, setToggleState] = React.useState<ToggleState>('off');
  const [animateShape, setAnimateShape] = React.useState(true);

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
            size={size}
            shape={shape}
            iconPosition={iconPosition}
            icon={showIcon ? 'camera' : undefined}
            disabled={disabled}
            loading={loading}
            selected={selectedFor(toggleState)}
            animateShape={animateShape}
            onPress={() => {}}
          >
            Play me
          </Button>
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
        <OptionRow
          label="Toggle"
          value={toggleState}
          options={TOGGLE_STATES}
          onChange={setToggleState}
        />
        <SwitchRow
          label="Animate shape"
          value={animateShape}
          onValueChange={setAnimateShape}
        />
      </List.Section>

      <List.Section title="Modes">
        <View style={styles.row}>
          {MODES.map((m) => (
            <Button key={m} mode={m} onPress={() => {}} style={styles.button}>
              {m}
            </Button>
          ))}
        </View>
      </List.Section>

      <List.Section title="States">
        <View style={styles.row}>
          <Button mode="filled" onPress={() => {}} style={styles.button}>
            Enabled
          </Button>
          <Button
            mode="filled"
            disabled
            onPress={() => {}}
            style={styles.button}
          >
            Disabled
          </Button>
          <Button
            mode="filled"
            loading
            onPress={() => {}}
            style={styles.button}
          >
            Loading
          </Button>
        </View>
      </List.Section>

      <List.Section title="Size (expressive)">
        <View style={styles.row}>
          {SIZES.map((s) => (
            <Button
              key={s}
              mode="filled"
              size={s}
              icon="star"
              onPress={() => {}}
              style={styles.button}
            >
              {s}
            </Button>
          ))}
        </View>
      </List.Section>

      <List.Section title="Shape (expressive)">
        {SHAPES.map((shapeVariant) => (
          <View key={shapeVariant} style={styles.row}>
            {SIZES.map((s) => (
              <Button
                key={`${shapeVariant}-${s}`}
                mode="outlined"
                size={s}
                shape={shapeVariant}
                onPress={() => {}}
                style={styles.button}
              >
                {`${s} ${shapeVariant}`}
              </Button>
            ))}
          </View>
        ))}
      </List.Section>

      <List.Section title="Toggle (expressive)">
        <View style={styles.row}>
          {MODES.map((m) => {
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
              >
                {m}
              </Button>
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
          >
            Custom color
          </Button>
          <Button
            mode="filled"
            textColor={theme.colors.onTertiaryContainer}
            buttonColor={theme.colors.tertiaryContainer}
            onPress={() => {}}
            style={styles.button}
          >
            Custom label color
          </Button>
          <Button
            mode="tonal"
            rippleColor={theme.colors.error}
            onPress={() => {}}
            style={styles.button}
          >
            Custom ripple
          </Button>
          <Button
            mode="outlined"
            icon={{
              uri: 'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400',
            }}
            onPress={() => {}}
            style={styles.button}
          >
            Remote image
          </Button>
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
          >
            Custom component
          </Button>
          <Button
            icon="heart"
            mode="outlined"
            onPress={() => {}}
            style={styles.button}
            labelStyle={styles.fontStyles}
          >
            Custom font
          </Button>
          <Button
            mode="outlined"
            shape="square"
            onPress={() => {}}
            style={styles.button}
            theme={{ shapes: { corner: { medium: 4 } } }}
          >
            Custom radius
          </Button>
        </View>
        <View style={styles.row}>
          <Button
            mode="filled"
            onPress={() => {}}
            style={styles.fullWidthButton}
          >
            width: 100%
          </Button>
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
  fullWidthButton: {
    width: '100%',
    marginTop: 10,
  },
});

export default ButtonExample;
