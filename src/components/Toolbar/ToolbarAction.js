/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, ViewPropTypes } from 'react-native';
import color from 'color';

import { black, white } from '../../styles/colors';
import TouchableRipple from '../TouchableRipple';
import Icon from '../Icon';

const ANDROID_VERSION_LOLLIPOP = 21;

type Props = {
  dark?: boolean,
  icon: string,
  onPress?: Function,
  style?: any,
};

export default class ToolbarAction extends Component<void, Props, void> {
  static propTypes = {
    /**
     * Theme color for the action icon, a dark action icon will render a light icon and vice-versa
     */
    dark: PropTypes.bool,
    /**
     * Name of the icon to show
     */
    icon: PropTypes.string,
    /**
     * Function to execute on press
     */
    onPress: PropTypes.func,
    style: ViewPropTypes.style,
  };

  render() {
    const { dark, icon, onPress, style, ...rest } = this.props;

    const iconColor = dark ? white : color(black).alpha(0.54).rgbaString();
    const rippleColor = color(iconColor).alpha(0.32).rgbaString();

    return (
      <TouchableRipple
        borderless
        onPress={onPress}
        rippleColor={rippleColor}
        hitSlop={
          Platform.OS === 'android' &&
          Platform.Version >= ANDROID_VERSION_LOLLIPOP
            ? { top: 8, left: 8, bottom: 8, right: 8 }
            : { top: 4, left: 4, bottom: 4, right: 4 }
        }
        style={[styles.button, style]}
        {...rest}
      >
        <Icon color={iconColor} name={icon} size={24} />
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  button:
    Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP
      ? {
          height: 28,
          width: 28,
          marginHorizontal: 10,
          paddingHorizontal: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }
      : {
          height: 36,
          width: 36,
          // TODO add custom ios touchable for Toolbar to handle this
          // minWidth: 24,
          // maxWidth: 36,
          marginHorizontal: 6,
          paddingHorizontal: 2,
          borderRadius: 44 / 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
});
