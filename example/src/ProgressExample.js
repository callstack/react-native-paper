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
  state = {
    progress: 0,
    visible: true,
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      this.setState(state => {
        if (state.progress >= 1) {
          if (state.visible) {
            return { visible: false };
          } else {
            return { progress: 0 };
          }
        } else {
          if (state.visible) {
            return { progress: state.progress + 0.3 };
          } else {
            if (state.progress === 0) {
              return { visible: true };
            } else {
              return { progress: 0 };
            }
          }
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <View style={styles.container}>
        <Headline>Linear</Headline>

        <Subheading>Determinate</Subheading>
        <Progress.Linear
          progress={this.state.progress}
          visible={this.state.visible}
          style={styles.bar}
        />

        <Subheading>Indeterminate</Subheading>
        <Progress.Linear
          indeterminate
          visible={this.state.visible}
          style={styles.bar}
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

  bar: {
    marginVertical: 8,
  },
});

export default ProgressExample;
