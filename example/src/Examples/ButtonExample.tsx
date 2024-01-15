import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button, List, Text } from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

const ButtonExample = () => {
  const theme = useExampleTheme();

  const color = theme.isV3 ? theme.colors.inversePrimary : theme.colors.accent;

  return (
    <ScreenWrapper>
      <List.Section title={`Text button ${theme.isV3 ? '(text)' : ''}`}>
        <View style={styles.row}>
          <Button onPress={() => {}} style={styles.button}>
            Default
          </Button>
          <Button textColor={color} onPress={() => {}} style={styles.button}>
            Custom
          </Button>
          <Button disabled onPress={() => {}} style={styles.button}>
            Disabled
          </Button>
          <Button icon="camera" onPress={() => {}} style={styles.button}>
            Icon
          </Button>
          <Button loading onPress={() => {}} style={styles.button}>
            Loading
          </Button>
          <Button
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            contentStyle={styles.flexReverse}
          >
            Icon right
          </Button>
        </View>
      </List.Section>
      {theme.isV3 && (
        <List.Section title="Contained-tonal button (tonal)">
          <View style={styles.row}>
            <Button
              mode="contained-tonal"
              onPress={() => {}}
              style={styles.button}
            >
              Default
            </Button>
            <Button
              mode="contained-tonal"
              buttonColor={color}
              onPress={() => {}}
              style={styles.button}
            >
              Custom
            </Button>
            <Button
              mode="contained-tonal"
              disabled
              onPress={() => {}}
              style={styles.button}
            >
              Disabled
            </Button>
            <Button
              mode="contained-tonal"
              icon="camera"
              onPress={() => {}}
              style={styles.button}
            >
              Icon
            </Button>
            <Button
              mode="contained-tonal"
              loading
              onPress={() => {}}
              style={styles.button}
            >
              Loading
            </Button>
            <Button
              mode="contained-tonal"
              icon="camera"
              onPress={() => {}}
              style={styles.button}
              contentStyle={styles.flexReverse}
            >
              Icon right
            </Button>
          </View>
        </List.Section>
      )}
      <List.Section title={`Outlined button ${theme.isV3 ? '(outlined)' : ''}`}>
        <View style={styles.row}>
          <Button mode="outlined" onPress={() => {}} style={styles.button}>
            Default
          </Button>
          <Button
            mode="outlined"
            textColor={color}
            onPress={() => {}}
            style={styles.button}
          >
            Custom
          </Button>
          <Button
            mode="outlined"
            disabled
            onPress={() => {}}
            style={styles.button}
          >
            Disabled
          </Button>
          <Button
            mode="outlined"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
          >
            Icon
          </Button>
          <Button
            mode="outlined"
            loading
            onPress={() => {}}
            style={styles.button}
          >
            Loading
          </Button>
          <Button
            mode="outlined"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            contentStyle={styles.flexReverse}
          >
            Icon right
          </Button>
        </View>
      </List.Section>
      <List.Section title={`Contained button ${theme.isV3 ? '(filled)' : ''}`}>
        <View style={styles.row}>
          <Button mode="contained" onPress={() => {}} style={styles.button}>
            Default
          </Button>
          <Button
            mode="contained"
            buttonColor={color}
            onPress={() => {}}
            style={styles.button}
          >
            Custom
          </Button>
          <Button
            mode="contained"
            disabled
            onPress={() => {}}
            style={styles.button}
          >
            Disabled
          </Button>
          <Button
            mode="contained"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
          >
            Icon
          </Button>
          <Button
            mode="contained"
            loading
            onPress={() => {}}
            style={styles.button}
          >
            Loading
          </Button>
          <Button
            mode="contained"
            icon="camera"
            onPress={() => {}}
            style={styles.button}
            contentStyle={styles.flexReverse}
          >
            Icon right
          </Button>
        </View>
      </List.Section>
      {theme.isV3 && (
        <List.Section title={'Elevated button (elevated)'}>
          <View style={styles.row}>
            <Button mode="elevated" onPress={() => {}} style={styles.button}>
              Default
            </Button>
            <Button
              mode="elevated"
              buttonColor={color}
              onPress={() => {}}
              style={styles.button}
            >
              Custom
            </Button>
            <Button
              mode="elevated"
              disabled
              onPress={() => {}}
              style={styles.button}
            >
              Disabled
            </Button>
            <Button
              mode="elevated"
              icon="camera"
              onPress={() => {}}
              style={styles.button}
            >
              Icon
            </Button>
            <Button
              mode="elevated"
              loading
              onPress={() => {}}
              style={styles.button}
            >
              Loading
            </Button>
            <Button
              mode="elevated"
              icon="camera"
              onPress={() => {}}
              style={styles.button}
              contentStyle={styles.flexReverse}
            >
              Icon right
            </Button>
          </View>
        </List.Section>
      )}
      <List.Section title="Custom">
        <View style={styles.row}>
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
            icon={require('../../assets/images/favorite.png')}
            onPress={() => {}}
            style={styles.button}
          >
            Required asset
          </Button>
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
          >
            Custom component
          </Button>
          <Button
            icon="heart"
            mode="outlined"
            onPress={() => {}}
            style={styles.button}
            labelStyle={[styles.fontStyles, theme.isV3 && styles.md3FontStyles]}
          >
            Custom Font
          </Button>
          <Button mode="outlined" onPress={() => {}} style={styles.button}>
            <Text variant="titleLarge">Custom text</Text>
          </Button>
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.customRadius}
          >
            Custom radius
          </Button>
          <Button mode="contained" onPress={() => {}} style={styles.noRadius}>
            Without radius
          </Button>
        </View>

        <View style={styles.row}>
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.flexGrow1Button}
          >
            flex-grow: 1
          </Button>
        </View>
        <View style={styles.row}>
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.width100PercentButton}
          >
            width: 100%
          </Button>
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
              >
                Compact {mode}
              </Button>
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
  },
  button: {
    margin: 4,
  },
  flexReverse: {
    flexDirection: 'row-reverse',
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
});

export default ButtonExample;
