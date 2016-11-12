/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Colors,
  Button,
} from 'react-native-paper';

export default class ButtonsExample extends Component {

  static title = 'Button';

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Button>Simple</Button>
          <Button primary>Primary</Button>
          <Button
            dark
            style={styles.button}
          >
            Custom
          </Button>
        </View>
        <View style={styles.row}>
          <Button raised>Raised</Button>
          <Button raised primary>Primary</Button>
          <Button
            raised
            dark
            style={styles.button}
          >
            Custom
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    backgroundColor: Colors.pink500,
  },
});
