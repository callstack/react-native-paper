/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Card, Text, GridView } from 'react-native-paper';

const CARD_SIZE = 160;

export default class GridViewExample extends Component {
  static title = 'GridView';

  state = {
    items: [],
    dataSource: new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    }),
  };

  componentWillMount() {
    this._genRows();
  }

  _genRows = () => {
    const items = this.state.items.slice(0);
    const itemsLength = items.length;

    if (itemsLength >= 1000) {
      return;
    }

    for (let i = 0; i < 100; i++) {
      items.push(itemsLength + i);
    }

    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(items),
    });
  };

  _renderRow = index => {
    return (
      <Card style={styles.tile}>
        <View style={styles.inner}>
          <Text style={styles.text}>
            {index}
          </Text>
        </View>
      </Card>
    );
  };

  _getNumberOfColumns = (width: number) => {
    return Math.floor(width / CARD_SIZE);
  };

  render() {
    return (
      <GridView
        {...this.props}
        removeClippedSubviews={false}
        spacing={8}
        getNumberOfColumns={this._getNumberOfColumns}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        onEndReached={this._genRows}
      />
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    padding: 16,
    height: CARD_SIZE,
  },

  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 16,
    color: Colors.grey500,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
