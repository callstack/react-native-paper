/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Paragraph,
  Checkbox,
  Colors,
  TouchableRipple,
  withTheme,
  type Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  checkedNormal: boolean,
  checkedCustom: boolean,
  indeterminate: boolean,
};

class CheckboxExample extends React.Component<Props, State> {
  static title = 'Checkbox';

  state = {
    checkedNormal: true,
    checkedCustom: true,
    indeterminate: true,
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
        <TouchableRipple
          onPress={() =>
            this.setState(state => ({
              checkedNormal: !state.checkedNormal,
            }))
          }
        >
          <View style={styles.row}>
            <Paragraph>Normal</Paragraph>
            <View pointerEvents="none">
              <Checkbox
                status={this.state.checkedNormal ? 'checked' : 'unchecked'}
              />
            </View>
          </View>
        </TouchableRipple>

        <TouchableRipple
          onPress={() =>
            this.setState(state => ({
              checkedCustom: !state.checkedCustom,
            }))
          }
        >
          <View style={styles.row}>
            <Paragraph>Custom</Paragraph>
            <View pointerEvents="none">
              <Checkbox
                color={Colors.blue500}
                status={this.state.checkedCustom ? 'checked' : 'unchecked'}
              />
            </View>
          </View>
        </TouchableRipple>

        <TouchableRipple
          onPress={() =>
            this.setState(state => ({
              indeterminate: !state.indeterminate,
            }))
          }
        >
          <View style={styles.row}>
            <Paragraph>Indeterminate</Paragraph>
            <View pointerEvents="none">
              <Checkbox
                status={
                  this.state.indeterminate ? 'indeterminate' : 'unchecked'
                }
              />
            </View>
          </View>
        </TouchableRipple>

        <View style={styles.row}>
          <Paragraph>Checked (Disabled)</Paragraph>
          <Checkbox status="checked" disabled />
        </View>
        <View style={styles.row}>
          <Paragraph>Unchecked (Disabled)</Paragraph>
          <Checkbox status="unchecked" disabled />
        </View>
        <View style={styles.row}>
          <Paragraph>Indeterminate (Disabled)</Paragraph>
          <Checkbox status="indeterminate" disabled />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default withTheme(CheckboxExample);
