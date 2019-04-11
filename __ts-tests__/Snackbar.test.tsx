
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar, Button } from '..';

interface MyComponentState {
  visible: boolean  
}

export default class MyComponent extends React.Component<{}, MyComponentState> {
  state = {
    visible: false,
  };

  render() {
    const { visible } = this.state;
    return (
      <View style={styles.container}>
        <Button
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
        >
          Hey there! I'm a Snackbar.
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
