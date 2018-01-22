/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Row,
  Checkbox,
  RadioButton,
  Colors,
  withTheme,
} from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  checked: boolean,
  index: number,
};

class RowExample extends React.Component<Props, State> {
  static title = 'Row';

  state = {
    checked: true,
    index: 0,
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    const { index, checked } = this.state;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}
      >
        <Row
          checked={checked}
          onPress={() =>
            this.setState(({ checked }) => ({ checked: !checked }))
          }
          label="Checkbox"
          color={Colors.blue500}
          renderComponent={props => <Checkbox {...props} />}
        />
        <Row
          onPress={() => this.setState({ index: 0 })}
          label="Radio (default color)"
          checked={index === 0}
          renderComponent={props => <RadioButton {...props} />}
        />
        <Row
          onPress={() => this.setState({ index: 1 })}
          label="Radio (custom color)"
          checked={index === 1}
          color={Colors.blue500}
          renderComponent={props => <RadioButton {...props} />}
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

export default withTheme(RowExample);
