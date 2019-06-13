import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  ProgressBar,
  Paragraph,
  Colors,
  withTheme,
  Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme;
};

type State = {
  progress: number;
  visible: boolean;
};

class ProgressBarExample extends React.Component<Props, State> {
  static title = 'Progress Bar';

  state = {
    progress: 0.3,
    visible: true,
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Button onPress={() => this.setState({ visible: !this.state.visible })}>
          Toggle visible
        </Button>
        <Button onPress={() => this.setState({ progress: Math.random() })}>
          Random progress
        </Button>

        <View style={styles.row}>
          <Paragraph>Default ProgressBar </Paragraph>
          <ProgressBar
            progress={this.state.progress}
            visible={this.state.visible}
          />
        </View>

        <View style={styles.row}>
          <Paragraph>Indeterminate ProgressBar</Paragraph>
          <ProgressBar indeterminate visible={this.state.visible} />
        </View>

        <View style={styles.row}>
          <Paragraph>ProgressBar with custom color</Paragraph>
          <ProgressBar
            progress={this.state.progress}
            visible={this.state.visible}
            color={Colors.red800}
          />
        </View>

        <View style={styles.row}>
          <Paragraph>ProgressBar with custom background color</Paragraph>
          <ProgressBar
            progress={this.state.progress}
            visible={this.state.visible}
            color={Colors.red800}
            style={{ backgroundColor: Colors.teal500 }}
          />
        </View>

        <View style={styles.row}>
          <Paragraph>ProgressBar with custom height</Paragraph>
          <ProgressBar
            progress={this.state.progress}
            visible={this.state.visible}
            style={{ height: 20 }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  row: {
    marginVertical: 10,
  },
});

export default withTheme(ProgressBarExample);
