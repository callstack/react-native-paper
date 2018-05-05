/* @flow */

import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import color from 'color';
import Icon from './Icon';
import Text from './Typography/Text';
import { black, white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  /**
   * Text content of the `Chip`.
   */
  children: React.Node,
  /**
   * Icon to display for the `Chip`.
   */
  icon?: IconSource,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Function to execute on delete. The delete button appears only when this prop is specified.
   */
  onDelete?: () => mixed,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * A Chip can be used to display entities in small blocks.
 *
 * <div class="screenshots">
 *   <img src="screenshots/chip-1.png" />
 *   <img src="screenshots/chip-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Chip } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Chip icon="info" onPress={() => {}}>Example Chip</Chip>
 * );
 * ```
 */
class Chip extends React.Component<Props> {
  render() {
    const { children, icon, onPress, onDelete, style, theme } = this.props;
    const { dark, colors } = theme;

    const backgroundColor = color(dark ? white : black)
      .alpha(0.12)
      .rgb()
      .string();
    const textColor = dark
      ? colors.text
      : color(colors.text)
          .alpha(0.87)
          .rgb()
          .string();
    const iconColor = color(colors.text)
      .alpha(dark ? 0.7 : 0.54)
      .rgb()
      .string();

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.content, { backgroundColor }, style]}>
          {icon ? <Icon name={icon} color={iconColor} size={32} /> : null}
          <Text
            numberOfLines={1}
            style={[
              styles.text,
              {
                color: textColor,
                marginLeft: icon ? 8 : 12,
                marginRight: onDelete ? 0 : 12,
              },
            ]}
          >
            {children}
          </Text>
          {onDelete ? (
            <TouchableWithoutFeedback onPress={onDelete}>
              <View style={styles.delete}>
                <Icon name="cancel" size={20} color={iconColor} />
              </View>
            </TouchableWithoutFeedback>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 4,
  },
  delete: {
    padding: 6,
  },
  text: {
    marginVertical: 8,
  },
});

export default withTheme(Chip);
