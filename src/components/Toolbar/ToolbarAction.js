/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import color from 'color';

import { black, white } from '../../styles/colors';
import TouchableRipple from '../TouchableRipple';
import Icon from '../Icon';
import type { IconSource } from '../Icon';

const ANDROID_VERSION_LOLLIPOP = 21;

type Props = {
  /**
   * Theme color for the action icon, a dark action icon will render a light icon and vice-versa.
   */
  dark?: boolean,
  /**
   * Name of the icon to show.
   */
  icon: IconSource,
  /**
   * Optional icon size, defaults to 24.
   */
  size?: number,
  /**
   * Function to execute on press.
   */
  onPress?: Function,
  style?: any,
};

/**
 * The ToolbarAction component is used for displaying an action item in the toolbar.
 */
export default class ToolbarAction extends React.Component<Props> {
  render() {
    const { dark, icon, onPress, size, style, ...rest } = this.props;

    const iconColor = dark
      ? white
      : color(black)
          .alpha(0.54)
          .rgb()
          .string();
    const rippleColor = color(iconColor)
      .alpha(0.32)
      .rgb()
      .string();

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
        <View>
          <Icon color={iconColor} name={icon} size={size || 24} />
        </View>
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
          borderRadius: 44 / 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
});
