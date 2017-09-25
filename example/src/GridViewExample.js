/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Colors, Card, Text, GridView } from 'react-native-paper';

const CARD_SIZE = 160;

export default class GridViewExample extends Component {
  static title = 'GridView';

  state = {
    items: [],
  };

  componentWillMount() {
    this.genRows();
  }

  genRows = () => {
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
    });
  };

  renderItem = id => {
    return (
      <Card style={styles.tile}>
        <View style={styles.inner}>
          <Text style={styles.text}>{id}</Text>
        </View>
      </Card>
    );
  };

  keyExtractor = id => {
    return id;
  };

  getNumberOfColumns = (width: number) => {
    return Math.floor(width / CARD_SIZE);
  };

  render() {
    return (
      <View>
        <Button
          title={'Scroll to tile with index 5'}
          onPress={() => this.ref.scrollToIndex(5)}
        />

        <GridView
          {...this.props}
          spacing={8}
          getNumberOfColumns={this.getNumberOfColumns}
          data={this.state.items}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ref={ref => (this.ref = ref)}
          onEndReached={this.genRows}
        />
      </View>
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
