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
  children: string | Array<string>,
  icon?: IconSource,
  onPress?: Function,
  onDelete?: Function,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * The Chip component displays entities in small blocks.
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
    const fontFamily = theme.fonts.light;

    const textColor = theme.dark ? white : black;
    const iconColor = theme.dark
      ? color(white)
          .alpha(0.3)
          .rgb()
          .string()
      : color(black)
          .alpha(0.26)
          .rgb()
          .string();
    const deleteColor = theme.dark
      ? color(white)
          .alpha(0.7)
          .rgb()
          .string()
      : color(black)
          .alpha(0.54)
          .rgb()
          .string();
    const backgroundColor = color(black)
      .alpha(0.12)
      .rgb()
      .string();

    const paddingLeft = icon ? 0 : 12;
    const paddingRight = onDelete ? 4 : 12;

    const content = (
      <View
        style={[
          styles.content,
          { backgroundColor, paddingLeft, paddingRight },
          style,
        ]}
      >
        {icon ? (
          <View style={[{ backgroundColor: iconColor }, styles.iconWrapper]}>
            <Icon name={icon} color={textColor} style={styles.icon} size={32} />
          </View>
        ) : null}
        <Text numberOfLines={1} style={[{ fontFamily }, styles.text]}>
          {children}
        </Text>
        {onDelete ? (
          <Icon
            name="cancel"
            size={18}
            color={deleteColor}
            onPress={onDelete}
            style={styles.delete}
          />
        ) : null}
      </View>
    );

    return onPress ? (
      <TouchableWithoutFeedback onPress={onPress}>
        {content}
      </TouchableWithoutFeedback>
    ) : (
      content
    );
  }
}

const styles = StyleSheet.create({
  content: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  delete: {
    padding: 4,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  icon: {
    borderRadius: 16,
  },
  text: {
    marginVertical: 8,
  },
});

export default withTheme(Chip);
