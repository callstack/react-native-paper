/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import color from 'color';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import withTheme from '../core/withTheme';
import { RadioButtonContext } from './RadioButtonGroup';
import type { Theme } from '../types';

type Props = {
  /**
   * Value of the radio button
   */
  value: string,
  /**
   * Whether radio is checked.
   */
  checked?: boolean,
  /**
   * Whether radio is disabled.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Custom color for radio.
   */
  color?: string,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Radio buttons allow the selection a single option from a set
 */
class RadioButton extends React.Component<Props> {
  render() {
    return (
      <RadioButtonContext.Consumer>
        {context => {
          const { disabled, onPress, theme, ...rest } = this.props;

          const checkedColor = disabled
            ? theme.colors.disabled
            : this.props.color || theme.colors.accent;

          let rippleColor;

          const checked = context
            ? context.value === this.props.value
            : this.props.checked;

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
              onPress={
                disabled
                  ? undefined
                  : () => {
                      context && context.onValueChange(this.props.value);
                      onPress && onPress();
                    }
              }
              style={styles.container}
            >
              <View style={{ opacity: checked ? 1 : 0 }}>
                <Icon
                  allowFontScaling={false}
                  name={checked && 'done'}
                  size={24}
                  color={checkedColor}
                />
              </View>
            </TouchableRipple>
          );
        }}
      </RadioButtonContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 6,
  },
});

export default withTheme(RadioButton);
