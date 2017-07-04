/* @flow */

import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Colors, Paper } from 'react-native-paper';

export default class RipplesExample extends Component {
  static title = 'Paper';

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {[1, 2, 4, 6, 12].map(i => {
          return (
            <Paper key={i} elevation={i} style={styles.paper}>
              <Text>
                {i}
              </Text>
            </Paper>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
  },

  content: {
    padding: 24,
    alignItems: 'center',
  },

  paper: {
    margin: 24,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
