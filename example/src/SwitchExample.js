/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Paragraph, Switch, Colors, TouchableRipple } from 'react-native-paper';

export default class SwitchExample extends Component {
  static title = 'Switch';

  state = {
    valueNormal: true,
    valueCustom: true,
  };

  render() {
    const switchValueNormalLabel = `switch ${this.state.valueNormal === true
      ? 'on'
      : 'off'}`;

    const switchValueCustomlLabel = `switch ${this.state.valueCustom === true
      ? 'on'
      : 'off'}`;

    return Platform.OS === 'android' ? (
      <View style={styles.container}>
        <TouchableRipple
          onPress={() =>
            this.setState(state => ({
              valueNormal: !state.valueNormal,
            }))}
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
            }))}
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
      <View style={styles.container}>
        <View style={styles.row}>
          <Paragraph>Normal {switchValueNormalLabel}</Paragraph>
          <View>
            <Switch
              value={this.state.valueNormal}
              onValueChange={() =>
                this.setState(state => ({
                  valueNormal: !state.valueNormal,
                }))}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Paragraph>Custom {switchValueCustomlLabel}</Paragraph>
          <View>
            <Switch
              value={this.state.valueCustom}
              onValueChange={() =>
                this.setState(state => ({
                  valueCustom: !state.valueCustom,
                }))}
              color={Colors.blue500}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Paragraph>Switch on (disabled)</Paragraph>
          <View>
            <Switch value disabled />
          </View>
        </View>
        <View style={styles.row}>
          <Paragraph>Switch off (disabled)</Paragraph>
          <View>
            <Switch value={false} disabled />
          </View>
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
