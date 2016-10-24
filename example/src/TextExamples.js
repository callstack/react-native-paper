/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
  Text,
} from 'react-native-paper';

export default class TextExamples extends Component {

  static title = 'Text Examples';

  render() {
    return (
      <View style={styles.container}>
        <Caption>Caption</Caption>
        <Headline>Headline</Headline>
        <Paragraph>Paragraph</Paragraph>
        <Subheading>Subheading</Subheading>
        <Title>Title</Title>
        <Text>Default Text</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
