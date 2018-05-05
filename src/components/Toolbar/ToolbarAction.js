/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import color from 'color';

import { black, white } from '../../styles/colors';
import TouchableRipple from '../TouchableRipple';
import Icon from '../Icon';
import type { IconSource } from '../Icon';

type Props = {
  /**
   * A dark action icon will render a light icon and vice-versa.
   */
  dark?: boolean,
  /**
   *  Custom color for action icon.
   */
  color?: string,
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
    const {
      color: customColor,
      dark,
      icon,
      onPress,
      size,
      style,
      ...rest
    } = this.props;

    let iconColor;

    if (customColor) {
      iconColor = customColor;
    } else if (dark) {
      iconColor = white;
    } else {
      iconColor = color(black)
        .alpha(0.54)
        .rgb()
        .string();
    }

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
          TouchableRipple.supported
            ? { top: 10, left: 10, bottom: 10, right: 10 }
            : { top: 6, left: 6, bottom: 6, right: 6 }
        }
        style={[styles.container, style]}
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
  container: TouchableRipple.supported
    ? {
        height: 28,
        width: 28,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        borderRadius: 36 / 2,
        height: 36,
        width: 36,
        margin: 6,
        alignItems: 'center',
        justifyContent: 'center',
      },
});
