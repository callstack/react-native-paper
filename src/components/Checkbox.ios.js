/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import color from 'color';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

type Props = {
  /**
   * Whether checkbox is checked.
   */
  checked?: boolean,
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Custom color for checkbox.
   */
  color?: string,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Checkboxes allow the selection of multiple options from a set.
 */
class Checkbox extends React.Component<Props> {
  render() {
    const { checked, disabled, onPress, theme, ...rest } = this.props;

    const checkedColor = disabled
      ? theme.colors.disabled
      : this.props.color || theme.colors.accent;

    let rippleColor;

    if (disabled) {
      rippleColor = color(theme.colors.text)
        .alpha(0.16)
        .rgb()
        .string();
    } else {
      rippleColor = color(checkedColor)
        .fade(0.32)
        .rgb()
        .string();
    }

    return (
      <TouchableRipple
        {...rest}
        borderless
        rippleColor={rippleColor}
        onPress={disabled ? undefined : onPress}
        style={styles.container}
      >
        <View style={{ opacity: checked ? 1 : 0 }}>
          <Icon
            allowFontScaling={false}
            name="done"
            size={24}
            color={checkedColor}
          />
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 6,
  },
});

export default withTheme(Checkbox);
