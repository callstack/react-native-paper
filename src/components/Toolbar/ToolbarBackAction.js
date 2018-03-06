/* @flow */

import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import color from 'color';

import ToolbarAction from './ToolbarAction';
import Icon from '../Icon';
import { black, white } from '../../styles/colors';

type Props = {
  /**
   * Theme color for the back icon, a dark action icon will render a light icon and vice-versa.
   */
  dark?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: Function,
  style?: any,
};

/**
 * The ToolbarBackAction component is used for displaying a back button in the toolbar.
 */
const ToolbarBackAction = (props: Props) => {
  const { dark, onPress, style } = props;

  let icon;

  if (Platform.OS === 'ios') {
    const iconColor = dark
      ? white
      : color(black)
          .alpha(0.54)
          .rgb()
          .string();

    icon = (
      <Icon name="keyboard-arrow-left" style={styles.icon} color={iconColor} />
    );
  } else {
    icon = 'arrow-back';
  }

  return (
    <ToolbarAction
      icon={icon}
      dark={dark}
      onPress={onPress}
      style={[styles.action, style]}
    />
  );
};

const styles = StyleSheet.create({
  action: Platform.select({
    ios: {
      marginHorizontal: 0,
    },
  }),
  icon: Platform.select({
    ios: {
      fontSize: 36,
      height: 36,
      width: 36,
    },
  }),
});

export default ToolbarBackAction;
