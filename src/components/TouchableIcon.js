/* @flow */

import React from 'react';
import { View } from 'react-native';

import TouchableRipple from './TouchableRipple';
import Icon from './Icon';
import type { IconSource } from './Icon';

type Props = {
  name: IconSource,
  iconStyle?: any,
  onPress: Function,
};

const TouchableIcon = ({ name, iconStyle, onPress, ...rest }: Props) => {
  return (
    <TouchableRipple onPress={onPress} {...rest}>
      <View>
        <Icon style={iconStyle} name={name} size={24} />
      </View>
    </TouchableRipple>
  );
};

export default TouchableIcon;
