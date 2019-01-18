/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  ProgressBar,
  Paragraph,
  Colors,
  withTheme,
  type Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  progress: number,
  animating: boolean,
};

class ProgressBarExample extends React.Component<Props, State> {
  static title = 'Progress Bar';

  state = {
    progress: 0.3,
    animating: true,
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Button
          onPress={() => this.setState({ animating: !this.state.animating })}
        >
          Toggle animating
        </Button>
        <Button onPress={() => this.setState({ progress: Math.random() })}>
          Random progress
        </Button>
        <Paragraph>ProgressBar primary color</Paragraph>
        <ProgressBar
          progress={this.state.progress}
          animating={this.state.animating}
        />
        <Paragraph>ProgressBar custom color</Paragraph>
        <ProgressBar
          progress={this.state.progress}
          animating={this.state.animating}
          color={Colors.red800}
        />
        <Paragraph>ProgressBar indeterminate</Paragraph>
        <ProgressBar indeterminate animating={this.state.animating} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default withTheme(ProgressBarExample);
