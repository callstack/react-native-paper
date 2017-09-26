/* @flow */

import React, { Component } from 'react';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';
import { Colors, Button, Toolbar } from 'react-native-paper';

export default class ToolbarExample extends Component {
  static title = 'Toolbar';
  static navigationOptions = {
    header: null,
  };

  state = {
    showLeftIcon: true,
    showSubtitle: true,
  };

  render() {
    const { showLeftIcon, showSubtitle } = this.state;

    return (
      <View style={styles.container}>
        <Toolbar
          dark
          statusBarHeight={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
        >
          {showLeftIcon && (
            <Toolbar.Action
              icon="arrow-back"
              onPress={() => this.props.navigation.goBack()}
            />
          )}
          <Toolbar.Content
            title="Title"
            subtitle={showSubtitle ? 'Subtitle' : null}
          />
          <Toolbar.Action icon="search" onPress={() => {}} />
          <Toolbar.Action icon="more-vert" onPress={() => {}} />
        </Toolbar>
        <View style={styles.content}>
          <Button
            accent
            raised
            onPress={() =>
              this.setState({ showLeftIcon: !this.state.showLeftIcon })}
          >
            {`Left icon: ${showLeftIcon ? 'On' : 'Off'}`}
          </Button>
          <Button
            accent
            raised
            onPress={() =>
              this.setState({ showSubtitle: !this.state.showSubtitle })}
          >
            {`Subtitle: ${showSubtitle ? 'On' : 'Off'}`}
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
