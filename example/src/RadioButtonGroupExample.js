/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Colors,
  withTheme,
  RadioButtonGroup,
  RadioButton,
  Paragraph,
} from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  value: string,
};

class RadioButtonGroupExample extends React.Component<Props, State> {
  static title = 'Radio button group';

  state = {
    value: 'first',
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}
      >
        <RadioButtonGroup
          value={this.state.value}
          onValueChange={value => this.setState({ value })}
        >
          <View style={styles.row}>
            <Paragraph>First</Paragraph>
            <RadioButton value="first" />
          </View>
          <View style={styles.row}>
            <Paragraph>Second</Paragraph>
            <RadioButton value="second" />
          </View>
        </RadioButtonGroup>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default withTheme(RadioButtonGroupExample);
