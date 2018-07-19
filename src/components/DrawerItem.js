/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { grey300, grey700 } from '../styles/colors';
import withTheme from '../core/withTheme';
import Text from './Typography/Text';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  /**
   * The label text of the item.
   */
  label: string,
  /**
   * Icon to display for the `DrawerItem`.
   */
  icon?: IconSource,
  /**
   * Whether to highlight the drawer item as active.
   */
  active?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
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
 * DrawerItem is a component used to show an action item with an icon and a label in a navigation drawer.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DrawerItem } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <DrawerItem label="First Item" />
 * );
 * ```
 */
class DrawerItem extends React.Component<Props> {
  render() {
    const {
      color: activeColor,
      icon,
      label,
      active,
      theme,
      ...props
    } = this.props;
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
      <TouchableRipple {...props}>
        <View style={[styles.wrapper, { backgroundColor }]}>
          {icon && <Icon name={icon} size={24} color={iconColor} />}
          <Text
            numberOfLines={1}
            style={[
              {
                color: labelColor,
                fontFamily,
                marginLeft: labelMargin,
              },
              styles.label,
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    marginRight: 32,
  },
});

export default withTheme(DrawerItem);
