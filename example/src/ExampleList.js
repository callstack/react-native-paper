/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, Text, StyleSheet } from 'react-native';
import { Colors, TouchableRipple, Divider } from 'react-native-paper';
import ButtonExample from './ButtonExample';
import FABExample from './FABExample';
import CardExample from './CardExample';
import CheckboxExample from './CheckboxExample';
import DividerExample from './DividerExample';
import GridViewExample from './GridViewExample';
import PaperExample from './PaperExample';
import RippleExample from './RippleExample';
import RadioButtonExample from './RadioButtonExample';
import TextExample from './TextExample';
import ToolbarExample from './ToolbarExample';
import SearchBarExample from './SearchBarExample';
import ProgressBarExample from './ProgressBarExample';

export const examples = {
  button: ButtonExample,
  fab: FABExample,
  card: CardExample,
  checkbox: CheckboxExample,
  divider: DividerExample,
  grid: GridViewExample,
  paper: PaperExample,
  ripple: RippleExample,
  radio: RadioButtonExample,
  toolbar: ToolbarExample,
  text: TextExample,
  searchbar: SearchBarExample,
  progressbar: ProgressBarExample,
};

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const dataSource = ds.cloneWithRows(Object.keys(examples));

export default class ExampleList extends Component {
  static navigationOptions = {
    title: 'Examples',
  };

  static propTypes = {
    navigation: PropTypes.object,
  };

  _renderRow = id =>
    <TouchableRipple
      style={styles.item}
      onPress={() => this.props.navigation.navigate(id)}
    >
      <Text style={styles.text}>
        {examples[id].title}
      </Text>
    </TouchableRipple>;

  _renderSeparator = (sectionId, rowId) => <Divider key={rowId} />;

  render() {
    return (
      <ListView
        dataSource={dataSource}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
