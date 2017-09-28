/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import color from 'color';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

type Props = {
  checked?: boolean,
  disabled?: boolean,
  onPress?: Function,
  color?: string,
  theme: Theme,
};

/**
 * Checkboxes allow the selection of multiple options from a set
 */
class Checkbox extends Component<void, Props, void> {
  static propTypes = {
    /**
     * Whether checkbox is checked
     */
    checked: PropTypes.bool.isRequired,
    /**
     * Whether checkbox is disabled
     */
    disabled: PropTypes.bool,
    /**
     * Function to execute on press
     */
    onPress: PropTypes.func,
    /**
     * Custom color for checkbox
     */
    color: PropTypes.string,
    theme: PropTypes.object.isRequired,
  };

  render() {
    const { checked, disabled, onPress, theme } = this.props;

    const checkedColor = this.props.color || theme.colors.accent;
    const uncheckedColor = 'rgba(0, 0, 0, .54)';

    let rippleColor, checkboxColor;

    if (disabled) {
      rippleColor = 'rgba(0, 0, 0, .16)';
      checkboxColor = 'rgba(0, 0, 0, .26)';
    } else {
      rippleColor = color(checkedColor)
        .clearer(0.32)
        .rgbaString();
      checkboxColor = checked ? checkedColor : uncheckedColor;
    }

    return (
      <TouchableRipple
        {...this.props}
        borderless
        rippleColor={rippleColor}
        onPress={disabled ? undefined : onPress}
        style={styles.container}
      >
        <View style={{ height: 36 }}>
          {checked && (
            <Icon
              allowFontScaling={false}
              name={checked && 'done'}
              size={24}
              style={[styles.icon, { color: checkboxColor }]}
            />
          )}
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },

  icon: {
    margin: 6,
  },
});

export default withTheme(Checkbox);
