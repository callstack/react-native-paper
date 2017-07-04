/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Button, Toolbar } from 'react-native-paper';

export default class ToolbarExample extends Component {
  static title = 'Toolbar';
  static navigationOptions = {
    header: null,
  };

  state = {
    showSubTitle: true,
  };

  render() {
    const { showSubTitle } = this.state;

    return (
      <View style={styles.container}>
        <Toolbar translucent>
          <Toolbar.Action
            dark
            icon="arrow-back"
            onPress={() => this.props.navigation.goBack()}
          />
          <Toolbar.Content
            dark
            title="Title"
            subTitle={showSubTitle ? 'Subtitle' : null}
          />
          <Toolbar.Action dark icon="search" onPress={() => {}} />
          <Toolbar.Action dark icon="more-vert" onPress={() => {}} />
        </Toolbar>
        <View style={styles.content}>
          <Button
            accent
            raised
            onPress={() =>
              this.setState({ showSubTitle: !this.state.showSubTitle })}
          >
            {`Subtitle: ${showSubTitle ? 'On' : 'Off'}`}
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
  },
  content: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
