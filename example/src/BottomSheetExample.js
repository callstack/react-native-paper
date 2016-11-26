/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Colors,
  BottomSheet,
  Divider,
} from 'react-native-paper';

export default class CheckboxExample extends Component {
  static title = 'Bottom sheet';

  state = {
    visible: false,
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          raised
          primary
          onPress={() => this.setState({ visible: true })}
        >
          Show bottom sheet
        </Button>
        <BottomSheet visible={this.state.visible} onRequestClose={() => this.setState({ visible: false })}>
          <BottomSheet.List title='Create'>
            <BottomSheet.ListItem icon='insert-drive-file' label='File' />
            <BottomSheet.ListItem icon='folder' label='Folder' />
          </BottomSheet.List>
          <Divider />
          <BottomSheet.List>
            <BottomSheet.ListItem icon='share' label='Share' />
            <BottomSheet.ListItem icon='backup' label='Upload' />
            <BottomSheet.ListItem icon='content-copy' label='Copy' />
            <BottomSheet.ListItem icon='print' label='Print this page' />
          </BottomSheet.List>
        </BottomSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
