/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Snackbar,
  Colors,
  withTheme,
  Button,
  type Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  visible: boolean,
};

class SnackbarExample extends React.Component<Props, State> {
  static title = 'Snackbar';

  state = {
    visible: false,
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
          mode="outlined"
          onPress={() => this.setState(state => ({ visible: !state.visible }))}
        >
          {this.state.visible ? 'Hide' : 'Show'}
        </Button>
        <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          action={{
            label: 'Undo',
            onPress: () => {
              // Do something
            },
          }}
          duration={Snackbar.DURATION_MEDIUM}
        >
          Hey there! I&apos;m a Snackbar.
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withTheme(SnackbarExample);
