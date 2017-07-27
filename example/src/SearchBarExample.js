/* @flow */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Caption, SearchBar } from 'react-native-paper';

export default class SearchExample extends Component {
  static title = 'Search bar';

  state = {
    firstQuery: '',
    secondQuery: '',
    thirdQuery: '',
  };

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Search"
          onChangeText={query => this.setState({ firstQuery: query })}
          value={this.state.firstQuery}
        />
        <Caption style={styles.caption}>Clickable icon</Caption>
        <SearchBar
          placeholder="Search"
          onChangeText={query => this.setState({ secondQuery: query })}
          value={this.state.secondQuery}
          onIconPress={() => this.props.navigation.goBack()}
          icon="arrow-back"
        />
        <SearchBar
          placeholder="Search"
          onChangeText={query => this.setState({ thirdQuery: query })}
          value={this.state.thirdQuery}
          onIconPress={/* In real code, this will open the drawer */ () => {}}
          icon="menu"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
  },
  caption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
