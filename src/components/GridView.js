/* @flow */

import React, { PureComponent, PropTypes } from 'react';
import { Dimensions, ListView, StyleSheet, View } from 'react-native';
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
};

type DefaultProps = {
  initialLayout: Layout,
  getNumberOfColumns: (width: number) => number,
  spacing: number,
};

type State = {
  layout: Layout,
};

export default class GridView
  extends PureComponent<DefaultProps, Props, State> {
  static propTypes = {
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    spacing: PropTypes.number.isRequired,
    getNumberOfColumns: PropTypes.func.isRequired,
    renderSectionHeader: PropTypes.func,
    renderRow: PropTypes.func.isRequired,
    onLayout: PropTypes.func,
    contentContainerStyle: View.propTypes.style,
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

  _renderRow = (...args: any) => {
    const containerWidth = this.state.layout.width;
    const { getNumberOfColumns, spacing } = this.props;
    const style = {
      width: (containerWidth - spacing) / getNumberOfColumns(containerWidth) -
        spacing,
      margin: spacing / 2,
    };
    const row = this.props.renderRow(...args);
    if (!row) {
      return row;
    }
    return React.cloneElement(row, {
      style: [row.props.style, style],
    });
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
    return (
      <ListView
        {...this.props}
        key={`grid-${this.state.layout.width}`}
        onLayout={this._handleLayout}
        renderSectionHeader={this._renderSectionHeader}
        renderRow={this._renderRow}
        contentContainerStyle={[
          styles.grid,
          { padding: this.props.spacing / 2 },
          this.props.contentContainerStyle,
        ]}
        ref={this._setRef}
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
