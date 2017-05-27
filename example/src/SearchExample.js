/* @flow */

import React, { Component } from 'react';
import { SearchBar } from 'react-native-paper';

export default class SearchExample extends Component {
  static title = 'Search';

  state = {
    query: '',
  };

  _onChangeSearch = query => this.setState({ query });

  render() {
    return (
      <SearchBar
        placeholder="Search"
        onChangeText={this._onChangeSearch}
        value={this.state.query}
      />
    );
  }
}
