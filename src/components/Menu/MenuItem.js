/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '../Icon';
import TouchableRipple from '../TouchableRipple';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import { black, white } from '../../styles/colors';
import type { Theme } from '../../types';
import type { IconSource } from '../Icon';

type Props = {
  /**
   * Title text for the `MenuItem`.
   */
  title: React.Node,
  /**
   * Icon to display for the `MenuItem`.
   */
  icon?: IconSource,
  /**
   * Whether the `MenuItem` is disabled. A disabled `MenuItem` is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

/**
 * A component to show list of options inside a Menu.
 *
 */

class MenuItem extends React.Component<Props> {
  static displayName = 'Menu.Item';

  render() {
    const { icon, title, disabled, onPress, theme, style } = this.props;

    let titleColor = color(theme.colors.text)
      .alpha(0.87)
      .rgb()
      .string();
    let iconColor = color(theme.colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    if (disabled) {
      iconColor = titleColor = color(theme.dark ? white : black)
        .alpha(0.32)
        .rgb()
        .string();
    }

    return (
      <TouchableRipple
        style={[styles.container, style]}
        onPress={onPress}
        disabled={disabled}
      >
        <View style={styles.row}>
          {icon ? (
            <View style={[styles.item, styles.icon]} pointerEvents="box-none">
              <Icon source={icon} size={24} color={iconColor} />
            </View>
          ) : null}
          <View
            style={[styles.item, styles.content, icon && styles.widthWithIcon]}
            pointerEvents="none"
          >
            <Text
              numberOfLines={1}
              style={[styles.title, { color: titleColor }]}
            >
              {title}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    );
  }
}

const minWidth = 112;
const maxWidth = 280;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    minWidth,
    maxWidth,
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    width: 40,
  },
  title: {
    fontSize: 16,
  },
  item: {
    margin: 8,
  },
  content: {
    justifyContent: 'center',
    minWidth: minWidth - 16,
    maxWidth: maxWidth - 16,
  },
  widthWithIcon: {
    maxWidth: maxWidth - (8 * 6 + 40),
  },
});

export default withTheme(MenuItem);
