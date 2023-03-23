import * as React from 'react';
import { Platform, StyleSheet, View, Text as NativeText } from 'react-native';

import { useFonts } from 'expo-font';
import {
  configureFonts,
  MD3LightTheme,
  Provider,
  Banner,
  Text,
} from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const defaultFont = Platform.select({
  ios: 'SF Pro',
  android: 'Roboto',
  default: 'sans-serif',
});

const TextTester = () => {
  const [loaded] = useFonts({
    Inter: require('../../assets/fonts/Inter-VariableFont.ttf'),
  });

  const theme = loaded
    ? {
        ...MD3LightTheme,
        fonts: configureFonts({
          config: {
            fontFamily: 'Inter',
          },
        }),
      }
    : MD3LightTheme;

  return (
    <ScreenWrapper>
      <Provider theme={theme}>
        <Banner visible={true}>
          Although React Native Paper supports fontWeight and fontStyle
          properties, variable fonts have some serious limitations in React
          Native. If you consider using a variable font anyway, please test
          rendering on all target platforms.
        </Banner>
        <View style={styles.container}>
          <View style={styles.section}>
            <NativeText>Inter Regular (variable font)</NativeText>
            <Text style={styles.example}>Sphinx of blue quartz</Text>

            <NativeText>{defaultFont} Regular (OS default font)</NativeText>
            <NativeText style={styles.example}>
              Sphinx of blue quartz
            </NativeText>
          </View>

          <View style={styles.section}>
            <NativeText>Inter Bold (variable font)</NativeText>
            <Text style={[styles.example, styles.bold]}>
              Sphinx of blue quartz
            </Text>

            <NativeText>{defaultFont} Bold (OS default font)</NativeText>
            <NativeText style={[styles.example, styles.bold]}>
              Sphinx of blue quartz
            </NativeText>
          </View>

          <View style={styles.section}>
            <NativeText>Inter Italic (variable font)</NativeText>
            <Text style={[styles.example, styles.italic]}>
              Sphinx of blue quartz
            </Text>

            <NativeText>{defaultFont} Italic (OS default font)</NativeText>
            <NativeText style={[styles.example, styles.italic]}>
              Sphinx of blue quartz
            </NativeText>
          </View>

          <View style={styles.section}>
            <NativeText>Inter Bold italic (variable font)</NativeText>
            <Text style={[styles.example, styles.bold, styles.italic]}>
              Sphinx of blue quartz
            </Text>

            <NativeText>{defaultFont} Bold italic (OS default font)</NativeText>
            <NativeText style={[styles.example, styles.bold, styles.italic]}>
              Sphinx of blue quartz
            </NativeText>
          </View>
        </View>
      </Provider>
    </ScreenWrapper>
  );
};

TextTester.title = 'Typography: Variable fonts';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    paddingBottom: 20,
  },
  example: {
    marginBottom: 5,
    fontSize: 30,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});

export default TextTester;
