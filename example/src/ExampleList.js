/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView } from 'react-native';
import { Divider, withTheme } from 'react-native-paper';
import ExampleListRow from './ExampleListRow';
import ButtonExample from './ButtonExample';
import FABExample from './FABExample';
import CardExample from './CardExample';
import CheckboxExample from './CheckboxExample';
import DialogExample from './DialogExample';
import DividerExample from './DividerExample';
import GridViewExample from './GridViewExample';
import PaperExample from './PaperExample';
import RippleExample from './RippleExample';
import RadioButtonExample from './RadioButtonExample';
import TextExample from './TextExample';
import ToolbarExample from './ToolbarExample';
import SearchBarExample from './SearchBarExample';
import ProgressBarExample from './ProgressBarExample';
import SwitchExample from './SwitchExample';

export const examples = {
  button: ButtonExample,
  fab: FABExample,
  card: CardExample,
  checkbox: CheckboxExample,
  dialog: DialogExample,
  divider: DividerExample,
  grid: GridViewExample,
  paper: PaperExample,
  ripple: RippleExample,
  radio: RadioButtonExample,
  toolbar: ToolbarExample,
  text: TextExample,
  searchbar: SearchBarExample,
  progressbar: ProgressBarExample,
  switch: SwitchExample,
};

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const dataSource = ds.cloneWithRows(Object.keys(examples));

class ExampleList extends Component {
  static navigationOptions = {
    title: 'Examples',
  };

  static propTypes = {
    theme: PropTypes.object.isRequired,
    navigation: PropTypes.object,
  };

  _renderRow = id => (
    <ExampleListRow
      title={examples[id].title}
      onPress={() => this.props.navigation.navigate(id)}
    />
  );

  _renderSeparator = (sectionId, rowId) => <Divider key={rowId} />;

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <ListView
        contentContainerStyle={{ backgroundColor: background }}
        dataSource={dataSource}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
      />
    );
  }
}

export default withTheme(ExampleList);
