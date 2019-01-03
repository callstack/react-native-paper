/* @flow */

import * as React from 'react';
import { PlusMinusCounter, withTheme, Divider } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

type Props = {
  quantity: 1,
};

type State = {
  quantity: number,
};

class PlusMinusCounterExample extends React.Component<Props, State> {
  static title = 'Plus Minus Counter';

  render() {
    const { quantity } = this.props;
    return (
      <View style={styles.container}>
        <PlusMinusCounter
          style={{ marginBottom: 10 }}
          quantity={quantity}
          onChangeCounter={this.onChangeCounter}
        />
        <Divider style={{ marginBottom: 20 }} />
        <PlusMinusCounter
          style={{ marginBottom: 10 }}
          quantity={quantity}
          onChangeCounter={this.onChangeCounter}
        />
        <Divider style={{ marginBottom: 20 }} />
        <PlusMinusCounter
          style={{ marginBottom: 10 }}
          quantity={quantity}
          onChangeCounter={this.onChangeCounter}
        />
      </View>
    );
  }
  onChangeCounter = () => {
    // add your logic
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withTheme(PlusMinusCounterExample);
