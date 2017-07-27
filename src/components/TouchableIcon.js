/* @flow */

import React from 'react';

import TouchableRipple from './TouchableRipple';
import Icon from './Icon';

type Props = {
  name: string,
  iconStyle?: any,
  onPress: Function,
};

const TouchableIcon = ({ name, iconStyle, onPress, ...rest }: Props) => {
  return (
    <TouchableRipple onPress={onPress} {...rest}>
      <Icon style={iconStyle} name={name} size={24} />
    </TouchableRipple>
  );
};

export default TouchableIcon;
