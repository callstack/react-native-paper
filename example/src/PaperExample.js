/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Paper, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class PaperExample extends React.Component<Props> {
  static title = 'Paper';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.content}
      >
        {[1, 2, 4, 6, 12].map(i => (
          <Paper key={i} style={[styles.paper, { elevation: i }]}>
            <Text>{i}</Text>
          </Paper>
        ))}
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
