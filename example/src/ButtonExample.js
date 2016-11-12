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

export default class ButtonExample extends Component {

  static title = 'Button';

  state = {
    loading: true,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Button>Simple</Button>
          <Button primary>Primary</Button>
          <Button color={Colors.pink500}>Custom</Button>
        </View>
        <View style={styles.row}>
          <Button raised>Raised</Button>
          <Button raised primary>Primary</Button>
          <Button raised color={Colors.pink500}>Custom</Button>
        </View>
        <View style={styles.row}>
          <Button icon='add-a-photo'>Icon</Button>
          <Button
            raised
            primary
            icon='file-download'
            loading={this.state.loading}
            onPress={() => this.setState(state => ({ loading: !state.loading }))}
          >
            Loading
          </Button>
        </View>
        <View style={styles.row}>
          <Button disabled icon='my-location'>Disabled</Button>
          <Button
            disabled
            loading
            raised
          >
            Loading
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    padding: 8,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
