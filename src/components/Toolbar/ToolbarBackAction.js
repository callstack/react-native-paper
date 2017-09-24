/* @flow */

import React from 'react';
import { Platform } from 'react-native';
import color from 'color';

import ToolbarAction from './ToolbarAction';
import Icon from '../Icon';
import { black, white } from '../../styles/colors';

const getBackIcon = Platform.select({
  ios: ({ dark }: Props) => {
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
  dark?: boolean,
  onPress?: Function,
  style?: any,
};

const ToolbarBackAction = (props: Props) => {
  const BackIcon = getBackIcon(props);
  return <ToolbarAction icon={BackIcon} {...props} />;
};

export default ToolbarBackAction;
