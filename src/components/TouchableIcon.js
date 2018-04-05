/* @flow */

import * as React from 'react';
import { View } from 'react-native';

import TouchableRipple from './TouchableRipple';
import Icon from './Icon';
import type { IconSource } from './Icon';

type Props = {
  name: IconSource,
  color: string,
  onPress: Function,
  iconStyle?: any,
};

const TouchableIcon = ({ name, color, onPress, iconStyle, ...rest }: Props) => (
  <TouchableRipple onPress={onPress} {...rest}>
    <View>
      <Icon color={color} style={iconStyle} name={name} size={24} />
    </View>
  </TouchableRipple>
);

export default TouchableIcon;
