/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  VirtualizedList,
} from 'react-native';
import { grey200 } from '../styles/colors';

type Layout = {
  width: number,
};

type Props = {
  spacing: number,
  getNumberOfColumns: (width: number) => number,
  renderSectionHeader?: (...args: any) => any,
  initialLayout: Layout,
  onLayout?: Function,
  keyExtractor: () => string,
  renderItem: () => void,
};

type DefaultProps = {
  initialLayout: Layout,
  getNumberOfColumns: (width: number) => number,
  spacing: number,
};

type State = {
  layout: Layout,
};

export default class GridView extends PureComponent<
  DefaultProps,
  Props,
  State
> {
  static defaultProps = {
    initialLayout: { width: Dimensions.get('window').width },
    getNumberOfColumns: () => 1,
    spacing: 0,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      layout: props.initialLayout,
    };
  }

  state: State;

  _root: Object;

  /**
   * PUBLIC METHODS
   */

  scrollToIndex = index => {
    const containerWidth = this.state.layout.width;

    return this._root.scrollToIndex({
      index: Math.floor(index / (containerWidth / this._getWidthOfOneItem())),
    });
  };

  scrollToEnd = () => this._root.scrollToEnd(); // todo
  scrollToItem = () => this._root.scrollToItem(); // todo
  scrollToOffset = (...args) => this._root.scrollToOffset(...args); // todo

  /**
   * PRIVATE FUNCTIONS
   */

  _keyExtractor = data => {
    const { keyExtractor } = this.props;

    return Object.values(data)
      .map(keyExtractor)
      .join('-');
  };

  _renderItem = ({ item }) => {
    const { spacing, keyExtractor } = this.props;
    const style = {
      width: this._getWidthOfOneItem(),
      margin: spacing / 2,
    };

    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        {item.map(a => {
          const row = this.props.renderItem(a);

          if (!row) {
            return null;
          }

          return React.cloneElement(row, {
            key: keyExtractor(a),
            style: [row.props.style, style],
          });
        })}
      </View>
    );
  };

  _handleLayout = (e: any) => {
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }

    if (this.state.layout.width === e.nativeEvent.layout.width) {
      return;
    }

    const containerWidth = e.nativeEvent.layout.width;

    this.setState({
      layout: { width: containerWidth },
    });
  };

  _setRef = (c: Object) => (this._root = c);

  _getItemCount = data => {
    const containerWidth = this.state.layout.width;

    return Math.ceil(
      data.length /
        (containerWidth / (this._getWidthOfOneItem() + this.props.spacing))
    );
  };

  _getItem = (data, index) => {
    const containerWidth = this.state.layout.width;
    const itemWidth = this._getWidthOfOneItem();
    const numberOfItemsInRow = Math.floor(containerWidth / itemWidth);

    return data.slice(
      index * numberOfItemsInRow,
      index * numberOfItemsInRow + numberOfItemsInRow
    );
  };

  _getWidthOfOneItem = () => {
    const containerWidth = this.state.layout.width;
    const { getNumberOfColumns, spacing } = this.props;
    return (
      (containerWidth - spacing) / getNumberOfColumns(containerWidth) - spacing
    );
  };

  render() {
    const { data } = this.props;
    return (
      <VirtualizedList
        {...this.props}
        data={data}
        getItemCount={this._getItemCount}
        getItem={this._getItem}
        onLayout={this._handleLayout}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        ref={c => (this._root = c)}
      />
    );
  }
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    backgroundColor: grey200,
  },
});
