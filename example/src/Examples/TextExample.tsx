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

const TextExample = () => {
  return (
    <ScreenWrapper style={styles.container}>
      <Headline style={styles.text}>Material 2 components:</Headline>

      <Caption style={styles.text}>Caption</Caption>
      <Paragraph style={styles.text}>Paragraph</Paragraph>
      <Subheading style={styles.text}>Subheading</Subheading>
      <Title style={styles.text}>Title</Title>
      <Headline style={styles.text}>Headline</Headline>

      <Headline style={styles.text}>Material 3 components:</Headline>

      <Text variant="body-large">body-large variant</Text>
      <Text variant="body-medium">body-medium variant</Text>
      <Text variant="body-small">body-small variant</Text>

      <Text variant="display-large">display-large variant</Text>
      <Text variant="display-medium">display-medium variant</Text>
      <Text variant="display-small">display-small variant</Text>

      <Text variant="headline-large">headline-large variant</Text>
      <Text variant="headline-medium">headline-medium variant</Text>
      <Text variant="headline-small">headline-small variant</Text>

      <Text variant="title-large">title-large variant</Text>
      <Text variant="title-medium">title-medium variant</Text>
      <Text variant="title-small">title-small variant</Text>

      <Text variant="label-large">label-large variant</Text>
      <Text variant="label-medium">label-medium variant</Text>
      <Text variant="label-small">label-small variant</Text>
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
