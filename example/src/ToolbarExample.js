/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Toolbar } from 'react-native-paper';

export default class ToolbarExample extends Component {
  
  static title = 'Toolbar';
  static navigationOptions = {
    header: null,
  };
  
  render() {
    return (
      <View style={styles.container} >
        <Toolbar translucent>
          {/*<Toolbar.Action icon={icon} onPress={} />*/}
          <Toolbar.Content
            title="Title"
            subTitle="Subtitle"
            dark
          />
          {/*<Toolbar.ActionGroup>*/}
            {/*<Toolbar.Action icon={icon} onPress={} />*/}
            {/*<Toolbar.Action icon={icon} onPress={} />*/}
          {/*</Toolbar.ActionGroup>*/}
        </Toolbar>
        <View style={styles.content} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
  },
  content: {
    flex: 1,
    padding: 4,
  }
});
