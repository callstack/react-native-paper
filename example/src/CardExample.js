/* @flow */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Title,
  Caption,
  Paragraph,
  Colors,
  Card,
} from 'react-native-paper';

export default class RipplesExample extends Component {

  static title = 'Card';

  render() {
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Title>Ghost story</Title>
          <Caption>A tiny tale</Caption>
          <Paragraph>
            Two travellers sat alone in a train carriage. “Do you believe in ghosts?” asked one, by way of conversation. “Yes,” said the other, and vanished.
          </Paragraph>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
  },

  card: {
    padding: 16,
  },
});
