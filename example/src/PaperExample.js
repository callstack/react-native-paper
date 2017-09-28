/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Paper, withTheme } from 'react-native-paper';

class PaperExample extends Component {
  static title = 'Paper';
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.content}
      >
        {[1, 2, 4, 6, 12].map(i => {
          return (
            <Paper key={i} elevation={i} style={styles.paper}>
              <Text>{i}</Text>
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

export default withTheme(PaperExample);
