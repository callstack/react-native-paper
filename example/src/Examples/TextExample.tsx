import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

const TextExample = () => {
  const { isV3 } = useExampleTheme();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {!isV3 && (
          <>
            <Caption style={styles.text}>Caption</Caption>
            <Paragraph style={styles.text}>Paragraph</Paragraph>
            <Subheading style={styles.text}>Subheading</Subheading>
            <Title style={styles.text}>Title</Title>
            <Headline style={styles.text}>Headline</Headline>
          </>
        )}

        {isV3 && (
          <>
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
          </>
        )}
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
