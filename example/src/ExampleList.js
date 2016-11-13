/* @flow */

import React, {
  Component,
  PropTypes,
 } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors, TouchableRipple } from 'react-native-paper';
import ButtonExample from './ButtonExample';
import CardExample from './CardExample';
import CheckboxExample from './CheckboxExample';
import DividerExample from './DividerExample';
import PaperExample from './PaperExample';
import RippleExample from './RippleExample';
import RadioButtonExample from './RadioButtonExample';
import TextExample from './TextExample';

export const examples = {
  button: ButtonExample,
  card: CardExample,
  checkbox: CheckboxExample,
  divider: DividerExample,
  paper: PaperExample,
  ripple: RippleExample,
  radio: RadioButtonExample,
  text: TextExample,
};

export default class ExampleList extends Component {

  static route = {
    navigationBar: {
      title: 'Examples',
    },
  };

  static propTypes = {
    navigator: PropTypes.object,
  };

  render() {
    return (
      <View style={styles.list}>
        {Object.keys(examples).map(id => (
          <TouchableRipple
            key={id}
            style={styles.item}
            onPress={() => this.props.navigator.push(id)}
          >
            <Text style={styles.text}>{examples[id].title}</Text>
          </TouchableRipple>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomColor: Colors.grey300,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
