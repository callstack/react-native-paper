/* @flow */

import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { withTheme } from '../core/theming';

type Props = {
  quantity: 1,
  onChangeCounter: number => mixed,
};

type State = {
  quantity: number,
};

/**
 * PlusMinusCounter is a simple counter.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/PlusMinusCounter.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { PlusMinusCounter } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *
 *   render() {
 * const { quantity } = this.props;
 * return (
 *  <View style={styles.container}>
 *     <PlusMinusCounter quantity={quantity} onChangeCounter={this.onChangeCounter} />
 *   </View>
 *  );
 * }
 * onChangeCounter = (quantity) => {
 * // add your logic
 * }
 * }
 * ```
 */

class PlusMinusCounter extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.quantity !== 'undefined') {
      this.setState({ quantity: nextProps.quantity });
    }
  }

  increase = () => {
    if (this.state.quantity) {
      this.props.onChangeCounter(this.state.quantity + 1);
      this.setState({ quantity: this.state.quantity + 1 });
    }
  };

  reduced = () => {
    if (this.state.quantity > 1) {
      this.props.onChangeCounter(this.state.quantity - 1);
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  render() {
    const hitSlop = { top: 20, right: 10, bottom: 20, left: 10 };
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnUp}
          hitSlop={hitSlop}
          onPress={this.increase}
        >
          <AntDesign name="plussquare" size={20} color="#228B22" />
        </TouchableOpacity>
        <Text style={styles.text}>{this.state.quantity}</Text>
        <TouchableOpacity
          style={styles.btnDown}
          hitSlop={hitSlop}
          onPress={this.reduced}
        >
          <AntDesign name="minussquare" size={20} color="#FF0000" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 35,
    backgroundColor: '#f7f8fa',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
  },
  text: {
    fontSize: 25,
  },
  btnUp: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDown: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTheme(PlusMinusCounter);
