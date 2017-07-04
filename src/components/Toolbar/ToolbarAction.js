/* @flow */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import color from 'color';

import { black, white } from '../../styles/colors';
import TouchableRipple from '../TouchableRipple';
import Icon from '../Icon';

type Props = {
  dark?: boolean,
  icon: string,
  onPress?: () => void,
  style?: any,
};

export default class ToolbarAction extends Component<void, Props, void> {
  render() {
    const { dark, icon, onPress, style } = this.props;

    const iconColor = dark ? white : color(black).alpha(0.54).rgbaString();
    const rippleColor = color(iconColor).alpha(0.32).rgbaString();

    return (
      <TouchableRipple
        borderless
        delayPressIn={0}
        onPress={onPress}
        rippleColor={rippleColor}
        style={style}
      >
        <Icon color={iconColor} name={icon} size={24} style={styles.icon} />
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    paddingHorizontal: 8,
  },
});
