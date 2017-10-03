/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  Animated,
  VirtualizedList,
} from 'react-native';
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
  itemWidth: Animated.Value,
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
      itemWidth: new Animated.Value(0),
    };
  }

  state: State;

  _root: VirtualizedList;

  scrollToIndex = (params: Object) => this._root.scrollToIndex(params);
  scrollToItem = (params: Object) => this._root.scrollToItem(params);
  scrollToEnd = (params?: Object) => this._root.scrollToEnd(params);
  scrollToOffset = (params: Object) => this._root.scrollToOffset(params);

  _renderItem = ({ item }) => {
    const { spacing, renderItem } = this.props;

    const style = {
      width: this.state.itemWidth,
      margin: spacing / 2,
    };

    return <Animated.View style={style}>{renderItem(item)}</Animated.View>;
  };

  _handleLayout = (e: any) => {
    const { getNumberOfColumns, spacing } = this.props;

    if (this.props.onLayout) {
      this.props.onLayout(e);
    }

    const layoutWidth = Math.round(e.nativeEvent.layout.width);

    this.state.itemWidth.setValue(
      (layoutWidth - spacing) / getNumberOfColumns(layoutWidth) - spacing
    );

    if (this.state.layout.width === layoutWidth) {
      return;
    }

    this.setState({
      layout: { width: layoutWidth },
    });
  };

  _getItemCount = (data: Array<any>) => data.length;

  _getItem = (data, index) => data[index];

  _getWidthOfOneItem = () => {
    const containerWidth = this.state.layout.width;
    const { getNumberOfColumns, spacing } = this.props;
    return (
      (containerWidth - spacing) / getNumberOfColumns(containerWidth) - spacing
    );
  };

  render() {
    const { data, keyExtractor, spacing, contentContainerStyle } = this.props;
    return (
      <VirtualizedList
        {...this.props}
        data={data}
        getItemCount={this._getItemCount}
        getItem={this._getItem}
        onLayout={this._handleLayout}
        renderItem={this._renderItem}
        keyExtractor={keyExtractor}
        ref={c => (this._root = c)}
        contentContainerStyle={[
          styles.grid,
          { padding: spacing / 2 },
          contentContainerStyle,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  grid: {
    flexWrap: 'wrap', // Warning is misleading https://github.com/facebook/react-native/issues/15772
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: grey200,
  },
});
