/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  ListView,
  StyleSheet,
  ViewPropTypes,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import { grey200 } from '../styles/colors';

type Layout = {
  width: number,
};

type Props = {
  dataSource: ListView.DataSource,
  spacing: number,
  getNumberOfColumns: (width: number) => number,
  renderSectionHeader?: (...args: any) => any,
  renderRow: (...args: any) => any,
  initialLayout: Layout,
  onLayout?: Function,
  contentContainerStyle?: any,
  keyExtractor: () => string,
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
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    spacing: PropTypes.number.isRequired,
    getNumberOfColumns: PropTypes.func.isRequired,
    renderSectionHeader: PropTypes.func,
    renderRow: PropTypes.func.isRequired,
    onLayout: PropTypes.func,
    contentContainerStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    initialLayout: { width: Dimensions.get('window').width },
    getNumberOfColumns: () => 1,
    spacing: 0,
  };

  static DataSource = ListView.DataSource;

  constructor(props: Props) {
    super(props);

    this.state = {
      layout: props.initialLayout,
    };
  }

  state: State;

  scrollTo(options: any) {
    this._root.scrollTo(options);
  }

  _root: Object;

  _renderSectionHeader = (...args) => {
    const header = this.props.renderSectionHeader
      ? this.props.renderSectionHeader(...args)
      : null;
    if (!header) {
      return header;
    }
    const { width } = this.state.layout;
    return React.cloneElement(header, {
      style: [header.props.style, { width }],
    });
  };

  _keyExtractor = data => {
    const { keyExtractor } = this.props;

    return Object.values(data)
      .map(keyExtractor)
      .join('-');
  };

  _renderItem = ({ item }) => {
    const containerWidth = this.state.layout.width;
    const { getNumberOfColumns, spacing } = this.props;
    const style = {
      width:
        (containerWidth - spacing) / getNumberOfColumns(containerWidth) -
        spacing,
      margin: spacing / 2,
    };

    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {item.map(a => {
          const row = this.props.renderItem(a);

          if (!row) {
            return row;
          }

          return React.cloneElement(row, {
            key: a.id,
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

  render() {
    const data = [
      {
        id: 0,
        name: 'nula',
      },
      {
        id: 1,
        name: 'jednicka',
      },
      {
        id: 2,
        name: 'jednicka',
      },
      {
        id: 3,
        name: 'jednicka',
      },
      {
        id: 4,
        name: 'jednicka',
      },
    ];

    const getItemCount = data => {
      const containerWidth = this.state.layout.width;
      const { getNumberOfColumns, spacing } = this.props;
      const style = {
        width:
          (containerWidth - spacing) / getNumberOfColumns(containerWidth) -
          spacing,
        margin: spacing / 2,
      };

      return Math.ceil(style.width * data.length / containerWidth);
    };

    const getItem = (data, index) => {
      const containerWidth = this.state.layout.width;
      const { getNumberOfColumns, spacing } = this.props;
      const style = {
        width:
          (containerWidth - spacing) / getNumberOfColumns(containerWidth) -
          spacing,
        margin: spacing / 2,
      };

      console.log(
        index,
        Math.floor(containerWidth / style.width),
        data.slice(index, index + Math.floor(containerWidth / style.width))
      );

      return data.slice(
        index * Math.floor(containerWidth / style.width),
        index * Math.floor(containerWidth / style.width) +
          index +
          Math.floor(containerWidth / style.width)
      );
    };

    const keyExtractor = a => {
      return Object.values(a)
        .map(({ id }) => id)
        .join('-');
    };

    return (
      <VirtualizedList
        data={data}
        getItemCount={getItemCount}
        getItem={getItem}
        onLayout={this._handleLayout}
        renderItem={this._renderItem}
        keyExtractor={keyExtractor}
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
