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

    const interval = setInterval(() => {
      const progress = this.state.progress < 1 ? this.state.progress + 0.1 : 0;
      this.setState({ progress });
    }, 1000);

    this.state = {
      interval,
      progress: 0,
    };
  }

  state = {
    interval: null,
    progress: 0,
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    return (
      <View style={styles.container}>
        <Headline style={styles.text}>Linear</Headline>

        <Subheading style={styles.text}>Determinate</Subheading>
        <Progress.Linear progress={this.state.progress} style={styles.progressBar} />

        <Subheading style={styles.text}>Indeterminate</Subheading>
        <Progress.Linear indeterminate style={styles.progressBar} />

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
