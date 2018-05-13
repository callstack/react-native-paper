/* @flow */

import * as React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import color from 'color';
import Icon from './Icon';
import Surface from './Surface';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

type Props = {
  /**
   * Mode of the chip.
   * - `flat` - flat chip without outline
   * - `outlined` - chip with an outline
   */
  mode?: 'flat' | 'outlined',
  /**
   * Text content of the `Chip`.
   */
  children: React.Node,
  /**
   * Icon to display for the `Chip`. Both icon and avatar cannot be specified.
   */
  icon?: IconSource,
  /**
   * Avatar to display for the `Chip`. Both icon and avatar cannot be specified.
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

type State = {
  elevation: Animated.Value,
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
class Chip extends React.Component<Props, State> {
  static defaultProps = {
    mode: 'flat',
    disabled: false,
    selected: false,
    style: {},
  };

  state = {
    elevation: new Animated.Value(0),
  };

  _handlePressIn = () => {
    Animated.timing(this.state.elevation, {
      toValue: 4,
      duration: 200,
    }).start();
  };

  _handlePressOut = () => {
    Animated.timing(this.state.elevation, {
      toValue: 0,
      duration: 150,
    }).start();
  };

  render() {
    const {
      mode,
      children,
      icon,
      avatar,
      selected,
      disabled,
      onPress,
      onDelete,
      style,
      theme,
    } = this.props;
    const { dark, colors } = theme;

    const backgroundColor =
      mode === 'outlined'
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
    const selectedColor = color(colors.text)
      .alpha(mode === 'outlined' ? 0.1 : 0.3)
      .rgb()
      .string();

    return (
      <AnimatedSurface
        style={[
          styles.touchable,
          {
            elevation: this.state.elevation,
          },
          style,
        ]}
      >
        <TouchableRipple
          style={styles.touchable}
          onPress={onPress}
          onPressIn={this._handlePressIn}
          onPressOut={this._handlePressOut}
          underlayColor={selectedColor}
          disabled={disabled}
        >
          <View
            style={[
              styles.content,
              {
                backgroundColor,
                borderColor: mode === 'outlined' ? colors.text : 'transparent',
              },
              selected
                ? {
                    backgroundColor: selectedColor,
                  }
                : null,
            ]}
          >
            {avatar && !icon
              ? /* $FlowFixMe */
                React.cloneElement(avatar, {
                  /* $FlowFixMe */
                  style: [styles.avatar, avatar.props.style],
                })
              : null}
            {icon || selected ? (
              <View
                style={[styles.icon, avatar ? styles.avatarSelected : null]}
              >
                {/* $FlowFixMe */}
                <Icon
                  source={selected ? 'done' : icon}
                  color={avatar ? colors.background : iconColor}
                  size={18}
                />
              </View>
            ) : null}
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                {
                  color: textColor,
                  marginRight: onDelete ? 4 : 8,
                  marginLeft: avatar || icon || selected ? 4 : 8,
                },
              ]}
            >
              {children}
            </Text>
            {onDelete ? (
              <TouchableWithoutFeedback onPress={onDelete}>
                <View style={styles.delete}>
                  <Icon source="cancel" size={16} color={iconColor} />
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </View>
        </TouchableRipple>
      </AnimatedSurface>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
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
  icon: {
    paddingHorizontal: 4,
    paddingVertical: 7,
  },
  delete: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  text: {
    marginVertical: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
  },
  avatarSelected: {
    position: 'relative',
    left: -30,
    marginRight: -30,
  },
});

export default withTheme(Chip);
