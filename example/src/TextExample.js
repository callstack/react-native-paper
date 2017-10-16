/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
  withTheme,
} from 'react-native-paper';

class TextExample extends Component {
  static title = 'Typography';

  render() {
    const { theme: { colors: { background } } } = this.props;
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
