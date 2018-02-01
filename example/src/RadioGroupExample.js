/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  RadioButton,
  Colors,
  withTheme,
  RadioGroup,
  withRadioGroup,
} from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  value: 'first' | 'second',
};

const Radio = withRadioGroup(RadioButton);

class RadioGroupExample extends React.Component<Props, State> {
  static title = 'Radio group';

  state = {
    value: 'first',
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}
      >
        <RadioGroup
          onValueChange={value => this.setState({ value })}
          value={this.state.value}
        >
          <View>
            <Radio value="first" />
          </View>
          <View>
            <Radio value="second" />
          </View>
        </RadioGroup>
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

export default withTheme(RadioGroupExample);
