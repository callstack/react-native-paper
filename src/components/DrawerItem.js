/* @flow */

import color from 'color';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { grey300, grey700 } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  /**
   * The label text of the item.
   */
  label: string,
  /**
   * Name of the icon. Can be a string (name of `MaterialIcon`),
   * an object of shape `{ uri: 'https://path.to' }`,
   * a local image: `require('../path/to/image.png')`,
   * or a valid React Native component.
   */
  icon?: IconSource,
  /**
   * Whether to highlight the drawer item as active.
   */
  active?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: Function,
  /**
   * Custom color for the drawer text and icon.
   */
  color?: string,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Item from drawer's list which navigates to specific location.
 *
 * ## Usage
 * ```js
 * const MyComponent = () => (
 *   <DrawerItem label="First Item" />
 * );
 * ```
 */
const DrawerItem = ({
  color: activeColor,
  icon,
  label,
  active,
  onPress,
  theme,
  ...props
}: Props) => {
  const { colors, dark } = theme;
  const backgroundColor = active ? (dark ? grey700 : grey300) : 'transparent';
  const labelColor = active
    ? activeColor || colors.text
    : color(colors.text)
        .alpha(0.54)
        .rgb()
        .string();
  const iconColor = active
    ? activeColor || colors.text
    : color(colors.text)
        .alpha(0.54)
        .rgb()
        .string();
  const fontFamily = theme.fonts.medium;
  const labelMargin = icon ? 32 : 0;
  return (
    <TouchableRipple {...props} onPress={onPress}>
      <View style={[styles.wrapper, { backgroundColor }]}>
        {icon && <Icon name={icon} size={24} color={iconColor} />}
        <Text
          numberOfLines={1}
          style={{
            color: labelColor,
            fontFamily,
            marginLeft: labelMargin,
            marginRight: 32,
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 48,
  },
});

export default withTheme(DrawerItem);
