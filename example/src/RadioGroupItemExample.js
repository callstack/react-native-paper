/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioGroupItem, Colors, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  checked: boolean,
  index: number,
};

class RadioGroupItemExample extends React.Component<Props, State> {
  static title = 'Radio group item';

  state = {
    checked: true,
    index: 0,
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    const { index } = this.state;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}
      >
        <RadioGroupItem
          onPress={() => this.setState({ index: 0 })}
          label="Default"
          checked={index === 0}
          value="first"
        />
        <RadioGroupItem
          onPress={() => this.setState({ index: 1 })}
          label="Custom"
          checked={index === 1}
          color={Colors.blue500}
          labelStyle={{
            fontSize: 16,
            marginVertical: 4,
            color: Colors.blue500,
          }}
          value="second"
        />
        <RadioGroupItem
          onPress={() => this.setState({ index: 0 })}
          label="Checked disabled"
          checked
          disabled
          value="third"
        />
        <RadioGroupItem
          onPress={() => this.setState({ index: 1 })}
          label="Unchecked disabled"
          checked={false}
          disabled
          value="fourth"
        />
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
});

export default withTheme(RadioGroupItemExample);
