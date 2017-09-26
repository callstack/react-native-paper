/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, StyleSheet, VirtualizedList } from 'react-native';
import { grey200 } from '../styles/colors';

type Layout = {
  width: number,
};

type Props = {
  /**
   * Item's spacing
   */
  spacing: number,
  /**
   * Function which determine number of columns.
   */
  getNumberOfColumns: (width: number) => number,
  /**
   * Data for the list
   */
  data: Array<any>,
  /**
   * Function which should return ID base on the item.
   */
  keyExtractor: (item: any) => string,
  contentContainerStyle: ?Object,
  /**
   * Component for rendering item
   */
  renderItem: (item: any) => React$Element<*>,
  initialLayout: Layout,
  onLayout?: Function,
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
  static propTypes = {
    data: PropTypes.array.isRequired,

    spacing: PropTypes.number.isRequired,

    getNumberOfColumns: PropTypes.func.isRequired,

    renderItem: PropTypes.func.isRequired,

    keyExtractor: PropTypes.func.isRequired,
    onLayout: PropTypes.func,
    initialLayout: PropTypes.object,
  };

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

  _root: VirtualizedList;

  scrollToIndex = (index: number) => {
    const containerWidth = this.state.layout.width;

    return this._root.scrollToIndex({
      index: Math.floor(index / (containerWidth / this._getWidthOfOneItem())),
    });
  };

  scrollToItem = (item: any) => {
    const { data, keyExtractor } = this.props;
    const containerWidth = this.state.layout.width;

    const index = data.findIndex(
      item_ => keyExtractor(item_) === keyExtractor(item)
    );

    return this._root.scrollToIndex({
      index: Math.floor(index / (containerWidth / this._getWidthOfOneItem())),
    });
  };

  scrollToEnd = () => this._root.scrollToEnd();

  scrollToOffset = (offset: number, animated: boolean = true) =>
    this._root.scrollToOffset({
      animated,
      offset,
    });

  _keyExtractor = data => {
    const { keyExtractor } = this.props;

    return Object.values(data)
      .map(keyExtractor)
      .join('-');
  };

  _renderItem = ({ item: items }) => {
    const { spacing, keyExtractor, renderItem } = this.props;
    const style = {
      width: this._getWidthOfOneItem(),
      margin: spacing / 2,
    };

    return (
      <View
        style={[
          styles.grid,
          { padding: this.props.spacing / 2 },
          this.props.contentContainerStyle,
        ]}
      >
        {items.map(item => {
          const itemElement = renderItem(item);
          return React.cloneElement(itemElement, {
            key: keyExtractor(item),
            style: [itemElement.props.style, style],
          });
        })}
      </View>
    );
  };

  _handleLayout = (e: any) => {
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }

    const layoutWidth = Math.round(e.nativeEvent.layout.width);

    if (this.state.layout.width === layoutWidth) {
      return;
    }

    this.setState({
      layout: { width: layoutWidth },
    });
  };

  _getItemCount = data => {
    const containerWidth = this.state.layout.width;

    return Math.ceil(
      data.length /
        Math.floor(
          containerWidth / (this._getWidthOfOneItem() + this.props.spacing)
        )
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
    alignItems: 'flex-start',
    backgroundColor: grey200,
  },
});
