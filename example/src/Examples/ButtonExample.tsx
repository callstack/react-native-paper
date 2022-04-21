import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, List, useTheme } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const ButtonExample = () => {
  const theme = useTheme();

  const color = theme.isV3 ? theme.colors.inversePrimary : theme.colors.accent;

  return (
    <ScreenWrapper>
      <List.Section title={`Text button ${theme.isV3 ? '(text)' : ''}`}>
        <View style={styles.row}>
          <Button onPress={() => {}} style={styles.button}>
            Default
          </Button>
          <Button color={color} onPress={() => {}} style={styles.button}>
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
              color={color}
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
            color={color}
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
            color={color}
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
              color={color}
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
});

export default ButtonExample;
