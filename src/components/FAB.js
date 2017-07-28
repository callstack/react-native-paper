/* @flow */

import color from 'color';
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Paper from './Paper';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';
import type { IconSource } from './Icon';

type Props = {
  small?: boolean,
  dark?: boolean,
  icon: IconSource,
  color?: string,
  onPress?: Function,
  theme: Theme,
  style?: any,
};

/**
 * A floating action button represents the primary action in an application
 */
const FAB = (props: Props) => {
  const { small, dark, icon, color: iconColor, onPress, theme, style } = props;
  const backgroundColor = theme.colors.accent;
  const isDark =
    typeof dark === 'boolean' ? dark : !color(backgroundColor).light();
  const textColor = iconColor || (isDark ? white : 'rgba(0, 0, 0, .54)');
  const rippleColor = color(textColor).alpha(0.32).rgbaString();

  return (
    <Paper
      {...props}
      style={[
        { backgroundColor },
        styles.content,
        small ? styles.small : styles.standard,
        style,
      ]}
      elevation={12}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        rippleColor={rippleColor}
        style={[styles.content, small ? styles.small : styles.standard]}
      >
        <Icon name={icon} size={24} style={{ color: textColor }} />
      </TouchableRipple>
    </Paper>
  );
};

FAB.propTypes = {
  /**
   *  Whether FAB is mini-sized, used to create visual continuity with other elements
   */
  small: PropTypes.bool,
  /**
   * Icon color of button, a dark button will render light text and vice-versa
   */
  dark: PropTypes.bool,
  /**
   * Name of the icon to show
   */
  icon: PropTypes.string,
  /**
   * Custom color for the icon
   */
  color: PropTypes.string,
  /**
   * Function to execute on press
   */
  onPress: PropTypes.func,
  style: Paper.propTypes.style,
  theme: PropTypes.object.isRequired,
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
