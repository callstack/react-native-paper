/* @flow */

import * as React from 'react';
import { grey400, grey50 } from '../styles/colors';
import { View, Switch, Platform } from 'react-native';
import withTheme from '../core/withTheme';
import setColor from 'color';
import type { Theme } from '../types';

type Props = {
  /**
   * Disable toggling the switch
   */
  disabled?: boolean,
  /**
   * Switch value- true or false
   */
  value?: boolean,
  /**
   * Custom color for checkbox
   */
  color?: string,
  /**
   * Invoked with the new value when the value changes
   */
  onValueChange?: Function,
  style?: any,
  theme: Theme,
};

/**
 * Switch is a visual toggle between two mutually exclusive states—on and off
 *
 * **Usage:**
 * ```js
 * export default class MyComponent extends Component {
 *   state = {
 *     isSwitchOn: false,
 *   };
 *
 *   render() {
 *     const { isSwitchOn } = this.state;
 *     return (
 *       <Switch
 *         value={isSwitchOn}
 *         onValueChange={() =>
 *           { this.setState({ isSwitchOn: !isSwitchOn }); }
 *         }
 *       />
 *     );
 *   }
 * }
 * ```
 */
class SwitchRow extends React.Component<Props> {
  render() {
    const {
      value,
      disabled,
      onValueChange,
      color,
      theme,
      ...props
    } = this.props;

    const checkedColor = color || theme.colors.accent;

    const trackTintColor =
      Platform.OS === 'ios'
        ? checkedColor
        : disabled
          ? setColor(grey400)
              .alpha(0.38)
              .rgbaString()
          : setColor(checkedColor)
              .alpha(0.38)
              .rgbaString();

    const trackThumbTintColor =
      Platform.OS === 'ios'
        ? undefined
        : disabled ? grey400 : value ? checkedColor : grey50;

    return (
      <View>
        <Switch
          {...props}
          value={value}
          disabled={disabled}
          onTintColor={trackTintColor}
          thumbTintColor={trackThumbTintColor}
          onValueChange={disabled ? undefined : onValueChange}
        />
      </View>
    );
  }
}

export default withTheme(SwitchRow);
