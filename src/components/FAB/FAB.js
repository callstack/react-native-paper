/* @flow */

import color from 'color';
import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import FABGroup from './FABGroup';
import Surface from '../Surface';
import CrossFadeIcon from '../CrossFadeIcon';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple';
import { black, white } from '../../styles/colors';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';
import type { IconSource } from './../Icon';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

type Props = {
  /**
   * Icon to display for the `FAB`.
   */
  icon: IconSource,
  /**
   * Optional label for extended `FAB`.
   */
  label?: string,
  /**
   * Accessibility label for the FAB. This is read by the screen reader when the user taps the FAB.
   * Uses `label` by default if specified.
   */
  accessibilityLabel?: string,
  /**
   *  Whether FAB is mini-sized, used to create visual continuity with other elements. This has no effect if `label` is specified.
   */
  small?: boolean,
  /**
   * Custom color for the `FAB`.
   */
  color?: string,
  /**
   * Whether `FAB` is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
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
 * A floating action button represents the primary action in an application.
 *
 * <div class="screenshots">
 *   <img src="screenshots/fab-1.png" />
 *   <img src="screenshots/fab-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { FAB } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <FAB
 *     small
 *     icon="add"
 *     onPress={() => {}}
 *   />
 * );
 * ```
 */
class FAB extends React.Component<Props, State> {
  // @component ./FABGroup.js
  static Group = FABGroup;

  state = {
    elevation: new Animated.Value(6),
  };

  _handlePressIn = () => {
    Animated.timing(this.state.elevation, {
      toValue: 12,
      duration: 200,
    }).start();
  };

  _handlePressOut = () => {
    Animated.timing(this.state.elevation, {
      toValue: 6,
      duration: 150,
    }).start();
  };

  render() {
    const {
      small,
      icon,
      label,
      accessibilityLabel = label,
      color: customColor,
      disabled,
      onPress,
      theme,
      style,
      ...rest
    } = this.props;

    const { elevation } = this.state;

    const disabledColor = color(theme.dark ? white : black)
      .alpha(0.12)
      .rgb()
      .string();
    const { backgroundColor = disabled ? disabledColor : theme.colors.accent } =
      StyleSheet.flatten(style) || {};

    let foregroundColor;

    if (typeof customColor !== 'undefined') {
      foregroundColor = customColor;
    } else {
      foregroundColor = !color(backgroundColor).light()
        ? white
        : 'rgba(0, 0, 0, .54)';
    }

    const rippleColor = color(foregroundColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <AnimatedSurface
        {...rest}
        style={[
          { backgroundColor },
          { elevation },
          styles.container,
          disabled && styles.disabled,
          style,
        ]}
      >
        <TouchableRipple
          borderless
          onPress={onPress}
          onPressIn={this._handlePressIn}
          onPressOut={this._handlePressOut}
          rippleColor={rippleColor}
          disabled={disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityTraits="button"
          accessibilityComponentType="button"
          style={styles.touchable}
        >
          <View
            style={[
              styles.content,
              label ? styles.extended : small ? styles.small : styles.standard,
            ]}
            pointerEvents="none"
          >
            <CrossFadeIcon source={icon} size={24} color={foregroundColor} />
            {label ? (
              <Text
                style={[
                  styles.label,
                  { color: foregroundColor, fontFamily: theme.fonts.medium },
                ]}
              >
                {label.toUpperCase()}
              </Text>
            ) : null}
          </View>
        </TouchableRipple>
      </AnimatedSurface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
  },
  touchable: {
    borderRadius: 28,
  },
  standard: {
    height: 56,
    width: 56,
  },
  small: {
    height: 40,
    width: 40,
  },
  extended: {
    height: 48,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginHorizontal: 8,
  },
  disabled: {
    elevation: 0,
  },
});

export default withTheme(FAB);
