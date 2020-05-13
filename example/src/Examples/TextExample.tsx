import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
  useTheme,
} from 'react-native-paper';

const TextExample = () => {
  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Caption style={styles.text}>Caption</Caption>
      <Paragraph style={styles.text}>Paragraph</Paragraph>
      <Subheading style={styles.text}>Subheading</Subheading>
      <Title style={styles.text}>Title</Title>
      <Headline style={styles.text}>Headline</Headline>
    </View>
  );
};

TextExample.title = 'Typography';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  text: {
    marginVertical: 4,
  },
});

export default TextExample;
