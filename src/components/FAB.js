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
   *  Whether FAB is mini-sized, used to create visual continuity with other elements
   */
  small?: boolean,
  /**
   * Icon color of button, a dark button will render light text and vice-versa
   */
  dark?: boolean,
  /**
   * Custom color for the icon
   */
  icon: IconSource,
  /**
   * Function to execute on press
   */
  color?: string,
  /**
   * Function to execute on press
   */
  onPress?: Function,
  theme: Theme,
  style?: any,
};

/**
 * A floating action button represents the primary action in an application
 *
 * **Usage:**
 * ```js
 * const MyComponent = () => (
 *   <FAB
 *     small
 *     icon="add"
 *     onPress={() => {}}
 *   />
 * );
 * ```
 */
const FAB = (props: Props) => {
  const { small, dark, icon, color: iconColor, onPress, theme, style } = props;
  const backgroundColor = theme.colors.accent;
  const isDark =
    typeof dark === 'boolean' ? dark : !color(backgroundColor).light();
  const textColor = iconColor || (isDark ? white : 'rgba(0, 0, 0, .54)');
  const rippleColor = color(textColor)
    .alpha(0.32)
    .rgbaString();

  return (
    <Paper
      {...props}
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
          <Icon name={icon} size={24} style={{ color: textColor }} />
        </View>
      </TouchableRipple>
    </Paper>
  );
};

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
