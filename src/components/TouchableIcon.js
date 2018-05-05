/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';

import TouchableRipple from './TouchableRipple';
import Icon from './Icon';
import type { IconSource } from './Icon';

type Props = {
  name: IconSource,
  color: string,
  size?: number,
  onPress: ?Function,
  style?: any,
};

const TouchableIcon = ({
  name,
  color: iconColor,
  size = 24,
  onPress,
  style,
  ...rest
}: Props) => {
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
        <Icon color={iconColor} name={name} size={size} />
      </View>
    </TouchableRipple>
  );
};

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

export default TouchableIcon;
