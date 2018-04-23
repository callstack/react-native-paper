/* @flow */

import color from 'color';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Paper from './Paper';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  /**
   *  Whether FAB is mini-sized, used to create visual continuity with other elements.
   */
  small?: boolean,
  /**
   * Icon color of button, a dark button will render light text and vice-versa.
   */
  dark?: boolean,
  /**
   * Name of the icon. Can be a string (name of `MaterialIcon`),
   * an object of shape `{ uri: 'https://path.to' }`,
   * a local image: `require('../path/to/image.png')`,
   * or a valid React Native component.
   */
  icon: IconSource,
  /**
   * Custom color for the FAB.
   */
  color?: string,
  /**
   * Function to execute on press.
   */
  onPress?: Function,
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
 *   <img src="screenshots/fab.png" />
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
      color: iconColor,
      onPress,
      theme,
      style,
      ...rest
    } = this.props;
    const backgroundColor = theme.colors.accent;
    const isDark =
      typeof dark === 'boolean' ? dark : !color(backgroundColor).light();
    const textColor = iconColor || (isDark ? white : 'rgba(0, 0, 0, .54)');
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <Paper
        {...rest}
        style={[
          { backgroundColor, elevation: 12 },
          styles.content,
          small ? styles.small : styles.standard,
          style,
        ]}
      >
        <TouchableRipple
          borderless
          onPress={onPress}
          rippleColor={rippleColor}
          style={[styles.content, small ? styles.small : styles.standard]}
        >
          <View>
            <Icon name={icon} size={24} color={textColor} />
          </View>
        </TouchableRipple>
      </Paper>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  standard: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  small: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

export default withTheme(FAB);
