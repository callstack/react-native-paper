import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Progress,
  Headline,
  Subheading,
} from 'react-native-paper';

class ProgressExample extends React.Component {
  constructor(props) {
    super(props);

    this.interval = setInterval(() => {
      const visible = this.state.progress <= 1;
      const progress = this.state.progress < 1.2 ? this.state.progress + 0.1 : 0;
      this.setState({ progress, visible });
    }, 700);

    this.state = {
      progress: 0,
      visible: true,
    };
  }

  state = {
    interval: null,
    progress: 0,
    visible: true,
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <View style={styles.container}>
        <Headline style={styles.text}>Linear</Headline>

        <Subheading style={styles.text}>Determinate</Subheading>
        <Progress.Linear
          progress={this.state.progress}
          visible={this.state.visible}
          style={styles.progressBar}
        />

        <Subheading style={styles.text}>Indeterminate</Subheading>
        <Progress.Linear
          indeterminate
          visible={this.state.visible}
          style={styles.progressBar}
        />

      </View>
    );
  }
}

ProgressExample.title = 'Progress';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  progressBar: {
    width: 300,
    height: 6,
  },
  text: {
    marginVertical: 4,
  },
});

export default ProgressExample;
