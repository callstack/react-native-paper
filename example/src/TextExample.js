/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
  withTheme,
  type Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme,
};

class TextExample extends React.Component<Props> {
  static title = 'Typography';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Caption style={styles.text}>Caption</Caption>
        <Paragraph style={styles.text}>Paragraph</Paragraph>
        <Subheading style={styles.text}>Subheading</Subheading>
        <Title style={styles.text}>Title</Title>
        <Headline style={styles.text}>Headline</Headline>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  text: {
    marginVertical: 4,
  },
});

export default withTheme(TextExample);
