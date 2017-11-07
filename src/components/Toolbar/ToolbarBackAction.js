/* @flow */

import * as React from 'react';
import { Platform } from 'react-native';
import color from 'color';

import ToolbarAction from './ToolbarAction';
import Icon from '../Icon';
import { black, white } from '../../styles/colors';

const getBackIcon = Platform.select({
  ios: (dark?: boolean) => {
    const iconColor = dark
      ? white
      : color(black)
          .alpha(0.54)
          .rgbaString();
    return <Icon name="keyboard-arrow-left" size={36} color={iconColor} />;
  },
  android: () => 'arrow-back',
});

type Props = {
  /**
   * Theme color for the back icon, a dark action icon will render a light icon and vice-versa
   */
  dark?: boolean,
  /**
   * Function to execute on press
   */
  onPress?: Function,
  style?: any,
};

const ToolbarBackAction = (props: Props) => {
  const { dark, onPress, style } = props;
  const BackIcon = getBackIcon(dark);
  return (
    <ToolbarAction
      icon={BackIcon}
      dark={dark}
      onPress={onPress}
      style={style}
    />
  );
};

export default ToolbarBackAction;
