/* @flow */

import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import ToolbarAction from './ToolbarAction';
import Icon from '../Icon';

type Props = {
  /**
   * A dark action icon will render a light icon and vice-versa.
   */
  dark?: boolean,
  /**
   *  Custom color for back icon.
   */
  color?: string,
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
  const { style, ...rest } = props;

  const icon =
    Platform.OS === 'ios'
      ? ({ color }) => (
          <Icon name="keyboard-arrow-left" size={36} color={color} />
        )
      : 'arrow-back';

  return <ToolbarAction {...rest} icon={icon} style={[styles.action, style]} />;
};

const styles = StyleSheet.create({
  action: Platform.select({
    ios: {
      marginHorizontal: 0,
    },
  }),
});

export default ToolbarBackAction;
