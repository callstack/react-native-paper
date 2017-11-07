// @flow

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Card, Text, GridView } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  items: Array<{ id: number }>,
};

const CARD_SIZE = 160;

export default class GridViewExample extends React.Component<Props, State> {
  static title = 'GridView';

  state = {
    items: [],
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
      items.push({ id: itemsLength + i });
    }

    this.setState({
      items,
    });
  };

  _renderItem = item => {
    return (
      <Card style={styles.tile}>
        <View style={styles.inner}>
          <Text style={styles.text}>{item.id}</Text>
        </View>
      </Card>
    );
  };

  _keyExtractor = item => item.id;

  _getNumberOfColumns = (width: number) => {
    return Math.floor(width / CARD_SIZE);
  };

  render() {
    return (
      <GridView
        {...this.props}
        spacing={8}
        getNumberOfColumns={this._getNumberOfColumns}
        data={this.state.items}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
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
