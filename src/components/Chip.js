/* @flow */

import * as React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import color from 'color';
import Icon from './Icon';
import Surface from './Surface';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple';
import { withTheme } from '../core/theming';
import { black, white } from '../styles/colors';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = React.ElementConfig<typeof Surface> & {|
  /**
   * Mode of the chip.
   * - `flat` - flat chip without outline.
   * - `outlined` - chip with an outline.
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
   * Whether to style the chip as selected.
   */
  selected?: boolean,
  /**
   * Whether the chip is disabled. A disabled chip is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean,
  /**
   * Accessibility label for the chip. This is read by the screen reader when the user taps the chip.
   */
  accessibilityLabel?: string,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Function to execute on close button press. The close button appears only when this prop is specified.
   */
  onClose?: () => mixed,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
  /**
   * Pass down testID from chip props to touchable for Detox tests.
   */
  testID?: string,
|};

type State = {
  elevation: Animated.Value,
};

/**
 * Chips can be used to display entities in small blocks.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/chip-1.png" />
 *     <figcaption>Flat chip</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/chip-2.png" />
 *     <figcaption>Outlined chip</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Chip } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Chip icon="info" onPress={() => console.log('Pressed')}>Example Chip</Chip>
 * );
 *
 * export default MyComponent;
 * ```
 */
class Chip extends React.Component<Props, State> {
  static defaultProps = {
    mode: 'flat',
    disabled: false,
    selected: false,
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
      accessibilityLabel,
      onPress,
      onClose,
      style,
      theme,
      testID,
      ...rest
    } = this.props;
    const { dark, colors } = theme;

    const {
      backgroundColor = mode === 'outlined'
        ? colors.surface
        : dark
          ? '#383838'
          : '#ebebeb',
    } = StyleSheet.flatten(style) || {};

    const borderColor =
      mode === 'outlined'
        ? color(dark ? white : black)
            .alpha(0.29)
            .rgb()
            .string()
        : backgroundColor;
    const textColor = disabled
      ? colors.disabled
      : color(colors.text)
          .alpha(0.87)
          .rgb()
          .string();
    const iconColor = disabled
      ? colors.disabled
      : color(colors.text)
          .alpha(0.54)
          .rgb()
          .string();
    const selectedBackgroundColor = color(dark ? white : black)
      .alpha(mode === 'outlined' ? 0.12 : 0.24)
      .rgb()
      .string();

    const accessibilityTraits = ['button'];
    const accessibilityStates = [];

    if (selected) {
      accessibilityTraits.push('selected');
      accessibilityStates.push('selected');
    }

    if (disabled) {
      accessibilityTraits.push('disabled');
      accessibilityStates.push('disabled');
    }

    return (
      <Surface
        style={[
          styles.container,
          {
            elevation: Platform.OS === 'android' ? this.state.elevation : 0,
            backgroundColor: selected
              ? selectedBackgroundColor
              : backgroundColor,
            borderColor,
          },
          style,
        ]}
        {...rest}
      >
        <TouchableRipple
          borderless
          delayPressIn={0}
          style={styles.touchable}
          onPress={onPress}
          onPressIn={this._handlePressIn}
          onPressOut={this._handlePressOut}
          underlayColor={selectedBackgroundColor}
          disabled={disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityTraits={accessibilityTraits}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityStates={accessibilityStates}
          testID={testID}
        >
          <View style={styles.content}>
            {avatar && !icon ? (
              <View
                style={[styles.avatarWrapper, disabled && { opacity: 0.26 }]}
              >
                {React.isValidElement(avatar)
                  ? /* $FlowFixMe */
                    React.cloneElement(avatar, {
                      /* $FlowFixMe */
                      style: [styles.avatar, avatar.props.style],
                    })
                  : avatar}
              </View>
            ) : null}
            {icon || selected ? (
              <View
                style={[
                  styles.icon,
                  avatar ? [styles.avatar, styles.avatarSelected] : null,
                ]}
              >
                <Icon
                  source={icon || 'done'}
                  color={avatar ? white : iconColor}
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
                  marginRight: onClose ? 4 : 8,
                  marginLeft: avatar || icon || selected ? 4 : 8,
                },
              ]}
            >
              {(children: any)}
            </Text>
            {onClose ? (
              <TouchableWithoutFeedback
                onPress={onClose}
                accessibilityTraits="button"
                accessibilityComponentType="button"
              >
                <View style={styles.icon}>
                  <Icon source="cancel" size={16} color={iconColor} />
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </View>
        </TouchableRipple>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
  },
  touchable: {
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  icon: {
    padding: 4,
  },
  text: {
    height: 24,
    lineHeight: 24,
    textAlignVertical: 'center',
    marginVertical: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  avatarWrapper: {
    marginRight: 4,
  },
  avatarSelected: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, .29)',
  },
});

export default withTheme(Chip);
