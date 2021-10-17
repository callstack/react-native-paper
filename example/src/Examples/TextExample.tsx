import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
} from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const TextExample = () => {
  return (
    <ScreenWrapper style={styles.container}>
      <Caption style={styles.text}>Caption</Caption>
      <Paragraph style={styles.text}>Paragraph</Paragraph>
      <Subheading style={styles.text}>Subheading</Subheading>
      <Title style={styles.text}>Title</Title>
      <Headline style={styles.text}>Headline</Headline>
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
