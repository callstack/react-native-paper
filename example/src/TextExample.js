/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
} from 'react-native-paper';

export default class TextExample extends Component {
  static title = 'Typography';

  render() {
    return (
      <View style={styles.container}>
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
  },
  text: {
    marginVertical: 4,
  },
});
