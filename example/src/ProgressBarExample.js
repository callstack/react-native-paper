/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
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
};

class ProgressBarExample extends React.Component<Props, State> {
  static title = 'Progress Bar';

  state = {
    progress: 0,
  };

  componentDidMount() {
    this._interval = setInterval(
      () =>
        this.setState(state => ({
          progress: state.progress < 1 ? state.progress + 0.01 : 0,
        })),
      16
    );
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _interval: IntervalID;

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Paragraph>ProgressBar primary color</Paragraph>
        <ProgressBar progress={this.state.progress} />
        <Paragraph>ProgressBar custom color</Paragraph>
        <ProgressBar progress={this.state.progress} color={Colors.red800} />
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
