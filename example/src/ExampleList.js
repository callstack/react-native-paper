/* @flow */

import React, {
  Component,
  PropTypes,
 } from 'react';
import {
  ListView,
  Text,
  StyleSheet,
} from 'react-native';
import {
  Colors,
  TouchableRipple,
  Divider,
} from 'react-native-paper';
import ButtonExample from './ButtonExample';
import CardExample from './CardExample';
import CheckboxExample from './CheckboxExample';
import DialogExample from './DialogExample';
import DividerExample from './DividerExample';
import GridViewExample from './GridViewExample';
import PaperExample from './PaperExample';
import RippleExample from './RippleExample';
import RadioButtonExample from './RadioButtonExample';
import TextExample from './TextExample';

export const examples = {
  button: ButtonExample,
  card: CardExample,
  checkbox: CheckboxExample,
  dialog: DialogExample,
  divider: DividerExample,
  grid: GridViewExample,
  paper: PaperExample,
  ripple: RippleExample,
  radio: RadioButtonExample,
  text: TextExample,
};

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const dataSource = ds.cloneWithRows(Object.keys(examples));

export default class ExampleList extends Component {

  static route = {
    navigationBar: {
      title: 'Examples',
    },
  };

  static propTypes = {
    navigator: PropTypes.object,
  };

  _renderRow = id => (
    <TouchableRipple style={styles.item} onPress={() => this.props.navigator.push(id)}>
      <Text style={styles.text}>{examples[id].title}</Text>
    </TouchableRipple>
  );

  _renderSeparator = (sectionId, rowId) => <Divider key={rowId}/>;

  render() {
    return (
      <ListView
        style={styles.container}
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
