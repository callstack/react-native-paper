/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Colors,
  withTheme,
  RadioButton,
  Paragraph,
  type Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  value: string,
};

class RadioButtonGroupExample extends React.Component<Props, State> {
  static title = 'Radio Button Group';

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
        <RadioButton.Group
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
        </RadioButton.Group>
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
