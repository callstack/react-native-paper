/* @flow */

import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import color from 'color';
import Icon from './Icon';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple';
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
   * Avatar to display for the `Chip`.
   */
  avatar?: React.Node,
  /**
   * Display the chip as selected.
   */
  selected?: boolean,
  /**
   * Disables the chip. `onPress` function won't execute.
   */
  disabled?: boolean,
  /**
   * Displays the chip as pressed.
   */
  pressed?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Function to execute on delete. The delete button appears only when this prop is specified.
   */
  onDelete?: () => mixed,
  /**
   * Displays chip with outline.
   */
  outlined?: boolean,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Chips can be used to display entities in small blocks.
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
  static defaultProps = {
    disabled: false,
    pressed: false,
    selected: false,
    style: {},
  };

  render() {
    const {
      children,
      icon,
      avatar,
      selected,
      disabled,
      pressed,
      onPress,
      onDelete,
      outlined,
      style,
      theme,
    } = this.props;
    const { dark, colors } = theme;

    const backgroundColor = outlined
      ? colors.background
      : color(colors.text)
          .alpha(disabled ? 0.05 : 0.12)
          .rgb()
          .string();
    const textColor = disabled
      ? colors.disabled
      : color(colors.text)
          .alpha(dark ? 0.7 : 0.87)
          .rgb()
          .string();
    const iconColor = disabled
      ? colors.disabled
      : color(colors.text)
          .alpha(dark ? 0.7 : 0.54)
          .rgb()
          .string();
    const pressedColor = color(colors.text)
      .alpha(outlined ? 0.1 : 0.3)
      .rgb()
      .string();

    return (
      <TouchableRipple
        style={styles.touchable}
        onPress={onPress}
        disabled={disabled}
      >
        <View
          style={[
            styles.content,
            {
              backgroundColor,
              borderColor: outlined ? colors.text : 'transparent',
            },
            style,
            pressed || selected
              ? {
                  backgroundColor: pressedColor,
                }
              : null,
          ]}
        >
          {icon || selected ? (
            /* $FlowFixMe */ <Icon
              source={selected ? 'done' : icon}
              color={iconColor}
              size={20}
            />
          ) : null}
          {avatar
            ? /* $FlowFixMe */
              React.cloneElement(avatar, {
                /* $FlowFixMe */
                style: [styles.avatar, avatar.props.style],
              })
            : null}
          <Text
            numberOfLines={1}
            style={[
              styles.text,
              {
                color: textColor,
                marginRight: onDelete ? 0 : 8,
              },
            ]}
          >
            {children}
          </Text>
          {onDelete ? (
            <TouchableWithoutFeedback onPress={onDelete}>
              <View style={styles.delete}>
                <Icon source="cancel" size={20} color={iconColor} />
              </View>
            </TouchableWithoutFeedback>
          ) : null}
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    margin: 4,
    borderRadius: 16,
  },
  content: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  delete: {
    padding: 6,
  },
  text: {
    margin: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

export default withTheme(Chip);
