import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button, List, useTheme } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const ButtonExample = () => {
  const theme = useTheme();

  const color = theme.colors.inversePrimary;

  const [selectedToggles, setSelectedToggles] = React.useState<
    Record<string, boolean>
  >({});

  const toggle = (key: string) =>
    setSelectedToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ScreenWrapper>
      <List.Section title="Text button (text)">
        <View style={styles.row}>
          <Button onPress={() => {}} style={styles.button} label="Default" />
          <Button
            textColor={color}
            onPress={() => {}}
            style={styles.button}
            label="Custom"
          />
          <Button
            disabled
            onPress={() => {}}
            style={styles.button}
            label="Disabled"
          />
          <Button
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            label="Icon"
          />
          <Button
            loading
            onPress={() => {}}
            style={styles.button}
            label="Loading"
          />
          <Button
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            iconPosition="trailing"
            label="Icon right"
          />
        </View>
      </List.Section>
      <List.Section title="Contained-tonal button (tonal)">
        <View style={styles.row}>
          <Button
            mode="contained-tonal"
            onPress={() => {}}
            style={styles.button}
            label="Default"
          />
          <Button
            mode="contained-tonal"
            buttonColor={color}
            onPress={() => {}}
            style={styles.button}
            label="Custom"
          />
          <Button
            mode="contained-tonal"
            disabled
            onPress={() => {}}
            style={styles.button}
            label="Disabled"
          />
          <Button
            mode="contained-tonal"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            label="Icon"
          />
          <Button
            mode="contained-tonal"
            loading
            onPress={() => {}}
            style={styles.button}
            label="Loading"
          />
          <Button
            mode="contained-tonal"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            iconPosition="trailing"
            label="Icon right"
          />
        </View>
      </List.Section>
      <List.Section title="Outlined button (outlined)">
        <View style={styles.row}>
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.button}
            label="Default"
          />
          <Button
            mode="outlined"
            textColor={color}
            onPress={() => {}}
            style={styles.button}
            label="Custom"
          />
          <Button
            mode="outlined"
            disabled
            onPress={() => {}}
            style={styles.button}
            label="Disabled"
          />
          <Button
            mode="outlined"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            label="Icon"
          />
          <Button
            mode="outlined"
            loading
            onPress={() => {}}
            style={styles.button}
            label="Loading"
          />
          <Button
            mode="outlined"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            iconPosition="trailing"
            label="Icon right"
          />
        </View>
      </List.Section>
      <List.Section title="Contained button (filled)">
        <View style={styles.row}>
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.button}
            label="Default"
          />
          <Button
            mode="contained"
            buttonColor={color}
            onPress={() => {}}
            style={styles.button}
            label="Custom"
          />
          <Button
            mode="contained"
            disabled
            onPress={() => {}}
            style={styles.button}
            label="Disabled"
          />
          <Button
            mode="contained"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            label="Icon"
          />
          <Button
            mode="contained"
            loading
            onPress={() => {}}
            style={styles.button}
            label="Loading"
          />
          <Button
            mode="contained"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            iconPosition="trailing"
            label="Icon right"
          />
        </View>
      </List.Section>
      <List.Section title="Elevated button (elevated)">
        <View style={styles.row}>
          <Button
            mode="elevated"
            onPress={() => {}}
            style={styles.button}
            label="Default"
          />
          <Button
            mode="elevated"
            buttonColor={color}
            onPress={() => {}}
            style={styles.button}
            label="Custom"
          />
          <Button
            mode="elevated"
            disabled
            onPress={() => {}}
            style={styles.button}
            label="Disabled"
          />
          <Button
            mode="elevated"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            label="Icon"
          />
          <Button
            mode="elevated"
            loading
            onPress={() => {}}
            style={styles.button}
            label="Loading"
          />
          <Button
            mode="elevated"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            iconPosition="trailing"
            label="Icon right"
          />
        </View>
      </List.Section>
      <List.Section title="Custom">
        <View style={styles.row}>
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
            icon={require('../../assets/images/favorite.png')}
            onPress={() => {}}
            style={styles.button}
            label="Required asset"
          />
          <Button
            mode="outlined"
            icon={({ size }) => (
              <Image
                source={require('../../assets/images/chameleon.jpg')}
                style={{ width: size, height: size, borderRadius: size / 2 }}
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
            labelStyle={[styles.fontStyles, styles.md3FontStyles]}
            label="Custom Font"
          />
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.button}
            labelStyle={theme.fonts.titleLarge}
            label="Custom text"
          />
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.customRadius}
            label="Custom radius"
          />
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.noRadius}
            label="Without radius"
          />
          <Button
            mode="contained-tonal"
            onPress={() => {}}
            style={{ borderRadius: styles.customRadiusAndPadding.borderRadius }}
            contentStyle={styles.customRadiusAndPadding}
            label="Custom radius and padding"
          />
        </View>

        <View style={styles.row}>
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.flexGrow1Button}
            label="flex-grow: 1"
          />
        </View>
        <View style={styles.row}>
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.width100PercentButton}
            label="width: 100%"
          />
        </View>
      </List.Section>
      <List.Section title="Compact">
        <View style={styles.row}>
          {(
            [
              'text',
              'outlined',
              'contained',
              'elevated',
              'contained-tonal',
            ] as const
          ).map((mode) => {
            return (
              <Button
                key={mode}
                mode={mode}
                compact
                onPress={() => {}}
                style={styles.button}
                icon="camera"
                label={`Compact ${mode}`}
              />
            );
          })}
        </View>
      </List.Section>
      <List.Section title="Size (expressive)">
        <View style={styles.row}>
          {(
            ['extra-small', 'small', 'medium', 'large', 'extra-large'] as const
          ).map((size) => (
            <Button
              key={size}
              mode="contained"
              size={size}
              icon="star"
              onPress={() => {}}
              style={styles.button}
              label={size}
            />
          ))}
        </View>
      </List.Section>
      <List.Section title="Shape (expressive)">
        <View style={styles.row}>
          {(['extra-small', 'small', 'medium', 'large'] as const).map(
            (size) => (
              <Button
                key={`round-${size}`}
                mode="outlined"
                size={size}
                shape="round"
                onPress={() => {}}
                style={styles.button}
                label={`${size} round`}
              />
            )
          )}
        </View>
        <View style={styles.row}>
          {(['extra-small', 'small', 'medium', 'large'] as const).map(
            (size) => (
              <Button
                key={`square-${size}`}
                mode="outlined"
                size={size}
                shape="square"
                onPress={() => {}}
                style={styles.button}
                label={`${size} square`}
              />
            )
          )}
        </View>
      </List.Section>
      <List.Section title="Toggle (expressive)">
        <View style={styles.row}>
          {(['outlined', 'text', 'contained-tonal'] as const).map((mode) => {
            const key = `toggle-${mode}`;
            const selected = !!selectedToggles[key];
            return (
              <Button
                key={key}
                mode={mode}
                size="small"
                shape="round"
                selected={selected}
                onPress={() => toggle(key)}
                style={styles.button}
                icon={selected ? 'check' : 'plus'}
                label={mode}
              />
            );
          })}
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

ButtonExample.title = 'Button';

const styles = StyleSheet.create({
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
  md3FontStyles: {
    lineHeight: 32,
  },
  fontStyles: {
    fontWeight: '800',
    fontSize: 24,
  },
  flexGrow1Button: {
    flexGrow: 1,
    marginTop: 10,
  },
  width100PercentButton: {
    width: '100%',
    marginTop: 10,
  },
  customRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 16,
  },
  noRadius: {
    borderRadius: 0,
  },
  customRadiusAndPadding: {
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default ButtonExample;
