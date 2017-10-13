/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Colors, Caption, SearchBar, withTheme } from 'react-native-paper';

class SearchExample extends Component {
  static title = 'Search bar';
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };

  state = {
    firstQuery: '',
    secondQuery: '',
    thirdQuery: '',
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
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

export default withTheme(SearchExample);
