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
import ScreenWrapper from '../ScreenWrapper';

const SectionHeader = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <Text variant="titleLarge" style={styles.sectionHeader}>
      {children}
    </Text>
  );
};

const TextExample = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <SectionHeader>Old text components:</SectionHeader>

        <Caption style={styles.text}>Caption</Caption>
        <Paragraph style={styles.text}>Paragraph</Paragraph>
        <Subheading style={styles.text}>Subheading</Subheading>
        <Title style={styles.text}>Title</Title>
        <Headline style={styles.text}>Headline</Headline>

        <SectionHeader>Text component:</SectionHeader>

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

        <Text style={styles.text} variant="bodyLarge">
          Body Large
        </Text>
        <Text style={styles.text} variant="bodyMedium">
          Body Medium
        </Text>
        <Text style={styles.text} variant="bodySmall">
          Body Small
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
      </View>
    </ScreenWrapper>
  );
};

TextExample.title = 'Typography';

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    opacity: 0.6,
  },
  container: {
    padding: 16,
  },
  text: {
    marginVertical: 4,
  },
});

export default TextExample;
