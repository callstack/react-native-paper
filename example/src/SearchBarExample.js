/* @flow */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, SearchBar } from 'react-native-paper';

export default class SearchExample extends Component {
  static title = 'SearchBar';

  state = {
    firstQuery: '',
    secondQuery: '',
    thirdQuery: '',
  };

  render() {
    return (
      <View>
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
          iconName="arrow-back"
        />
        <SearchBar
          placeholder="Search"
          onChangeText={query => this.setState({ thirdQuery: query })}
          value={this.state.thirdQuery}
          onIconPress={() => {}}
          iconName="menu"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  caption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
