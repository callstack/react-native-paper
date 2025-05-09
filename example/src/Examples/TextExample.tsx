import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import {
  configureFonts,
  MD3LightTheme,
  PaperProvider,
  customText,
} from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const Text = customText<'customVariant'>();

const TextExample = () => {
  const fontConfig = {
    customVariant: {
      fontFamily: Platform.select({
        ios: 'Noteworthy',
        default: 'serif',
      }),
      fontWeight: '400',
      letterSpacing: Platform.select({
        ios: 7,
        default: 4.6,
      }),
      lineHeight: 54,
      fontSize: 40,
    },
  } as const;

  const theme = {
    ...MD3LightTheme,
    fonts: configureFonts({ config: fontConfig }),
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.text} variant="displayLarge">
          Display Large
        </Text>
        <Text style={styles.text} variant="displayMedium">
          Display Medium
        </Text>
        <Text style={styles.text} variant="displaySmall">
          Display small
        </Text>

        <Text style={styles.text} variant="headlineLarge">
          Headline Large
        </Text>
        <Text style={styles.text} variant="headlineMedium">
          Headline Medium
        </Text>
        <Text style={styles.text} variant="headlineSmall">
          Headline Small
        </Text>

        <Text style={styles.text} variant="titleLarge">
          Title Large
        </Text>
        <Text style={styles.text} variant="titleMedium">
          Title Medium
        </Text>
        <Text style={styles.text} variant="titleSmall">
          Title Small
        </Text>

        <Text style={styles.text} variant="labelLarge">
          Label Large
        </Text>
        <Text style={styles.text} variant="labelMedium">
          Label Medium
        </Text>
        <Text style={styles.text} variant="labelSmall">
          Label Small
        </Text>

        <Text style={styles.text} variant="bodyLarge">
          Body Large
        </Text>
        <Text style={styles.text} variant="bodyMedium">
          Body Medium
        </Text>
        <Text style={styles.text} variant="bodySmall">
          Body Small
        </Text>

        <PaperProvider theme={theme}>
          <Text style={styles.text} variant="customVariant">
            Custom Variant
          </Text>
        </PaperProvider>
      </View>
    </ScreenWrapper>
  );
};

TextExample.title = 'Typography';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    marginVertical: 4,
  },
});

export default TextExample;
