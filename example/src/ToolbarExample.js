/* @flow */

import React, { Component } from 'react';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';
import { Colors, Button, Toolbar } from 'react-native-paper';

const MORE_ICON = Platform.OS === 'ios' ? 'more-horiz' : 'more-vert';

export default class ToolbarExample extends Component {
  static title = 'Toolbar';
  static navigationOptions = {
    header: null,
  };

  state = {
    showLeftIcon: true,
    showSearchIcon: Platform.OS !== 'ios',
    showMoreIcon: true,
    showSubtitle: Platform.OS !== 'ios',
  };

  render() {
    const {
      showLeftIcon,
      showSearchIcon,
      showMoreIcon,
      showSubtitle,
    } = this.state;

    return (
      <View style={styles.container}>
        <Toolbar
          dark
          statusBarHeight={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
        >
          {showLeftIcon && (
            <Toolbar.BackAction
              onPress={() => this.props.navigation.goBack()}
            />
          )}
          <Toolbar.Content
            title="Title"
            subtitle={showSubtitle ? 'Subtitle' : null}
          />
          {showSearchIcon && (
            <Toolbar.Action icon="search" onPress={() => {}} />
          )}
          {showMoreIcon && (
            <Toolbar.Action icon={MORE_ICON} onPress={() => {}} />
          )}
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
          <Button
            accent
            raised
            onPress={() =>
              this.setState({ showSearchIcon: !this.state.showSearchIcon })}
          >
            {`Search icon: ${showSearchIcon ? 'On' : 'Off'}`}
          </Button>
          <Button
            accent
            raised
            onPress={() =>
              this.setState({ showMoreIcon: !this.state.showMoreIcon })}
          >
            {`More icon: ${showMoreIcon ? 'On' : 'Off'}`}
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
