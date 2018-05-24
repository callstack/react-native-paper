/* @flow */

import color from 'color';
import * as React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Paper from './Paper';
import CrossFadeIcon from './CrossFadeIcon';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple';
import { white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

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
   *  Whether FAB is mini-sized, used to create visual continuity with other elements. This has no effect if `label` is specified.
   */
  small?: boolean,
  /**
   * Icon color of button, a dark button will render light text and vice-versa.
   */
  dark?: boolean,
  /**
   * Custom color for the `FAB`.
   */
  color?: string,
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
class FAB extends React.Component<Props> {
  render() {
    const {
      small,
      dark,
      icon,
      label,
      color: iconColor,
      onPress,
      theme,
      style,
      ...rest
    } = this.props;

    const { backgroundColor = theme.colors.accent } =
      StyleSheet.flatten(style) || {};
    const isDark =
      typeof dark === 'boolean' ? dark : !color(backgroundColor).light();
    const textColor = iconColor || (isDark ? white : 'rgba(0, 0, 0, .54)');
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <AnimatedPaper
        {...rest}
        style={[{ backgroundColor, elevation: 12 }, styles.container, style]}
      >
        <TouchableRipple
          borderless
          onPress={onPress}
          rippleColor={rippleColor}
          style={styles.container}
        >
          <View
            style={[
              styles.content,
              label ? styles.extended : small ? styles.small : styles.standard,
            ]}
            pointerEvents="none"
          >
            <CrossFadeIcon source={icon} size={24} color={textColor} />
            {label ? (
              <Text
                style={[
                  styles.label,
                  { color: textColor, fontFamily: theme.fonts.medium },
                ]}
              >
                {label.toUpperCase()}
              </Text>
            ) : null}
          </View>
        </TouchableRipple>
      </AnimatedPaper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
});

export default withTheme(FAB);
