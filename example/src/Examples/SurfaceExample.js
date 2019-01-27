/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Surface, withTheme, type Theme } from 'react-native-paper';

type Props = {
  theme: Theme,
};

class SurfaceExample extends React.Component<Props> {
  static title = 'Surface';

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
          <Surface key={i} style={[styles.surface, { elevation: i }]}>
            <Text>{i}</Text>
          </Surface>
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

  surface: {
    margin: 24,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withTheme(SurfaceExample);
