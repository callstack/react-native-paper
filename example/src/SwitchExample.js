/* @flow */

import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  Paragraph,
  Switch,
  Colors,
  TouchableRipple,
  withTheme,
  type Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  valueNormal: boolean,
  valueCustom: boolean,
};

class SwitchExample extends React.Component<Props, State> {
  static title = 'Switch';

  state = {
    valueNormal: true,
    valueCustom: true,
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    const switchValueNormalLabel = `switch ${
      this.state.valueNormal === true ? 'on' : 'off'
    }`;

    const switchValueCustomlLabel = `switch ${
      this.state.valueCustom === true ? 'on' : 'off'
    }`;

    return Platform.OS === 'android' ? (
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
              valueNormal: !state.valueNormal,
            }))
          }
        >
          <View style={styles.row}>
            <Paragraph>Normal {switchValueNormalLabel}</Paragraph>
            <View pointerEvents="none">
              <Switch value={this.state.valueNormal} />
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple
          onPress={() =>
            this.setState(state => ({
              valueCustom: !state.valueCustom,
            }))
          }
        >
          <View style={styles.row}>
            <Paragraph>Custom {switchValueCustomlLabel}</Paragraph>
            <View pointerEvents="none">
              <Switch value={this.state.valueCustom} color={Colors.blue500} />
            </View>
          </View>
        </TouchableRipple>
        <View style={styles.row}>
          <Paragraph>Switch on (disabled)</Paragraph>
          <Switch disabled value />
        </View>
        <View style={styles.row}>
          <Paragraph>Switch off (disabled)</Paragraph>
          <Switch disabled />
        </View>
      </View>
    ) : (
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}
      >
        <View style={styles.row}>
          <Paragraph>Normal {switchValueNormalLabel}</Paragraph>
          <Switch
            value={this.state.valueNormal}
            onValueChange={() =>
              this.setState(state => ({
                valueNormal: !state.valueNormal,
              }))
            }
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Custom {switchValueCustomlLabel}</Paragraph>
          <Switch
            value={this.state.valueCustom}
            onValueChange={() =>
              this.setState(state => ({
                valueCustom: !state.valueCustom,
              }))
            }
            color={Colors.blue500}
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Switch on (disabled)</Paragraph>
          <Switch value disabled />
        </View>
        <View style={styles.row}>
          <Paragraph>Switch off (disabled)</Paragraph>
          <Switch value={false} disabled />
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

export default withTheme(SwitchExample);
