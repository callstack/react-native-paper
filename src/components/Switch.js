/* @flow */
import * as React from 'react';

import { grey400, grey800, grey50, white, black } from '../styles/colors';
import { Switch as NativeSwitch, Platform } from 'react-native';
import setColor from 'color';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

type Props = {
  /**
   * Disable toggling the switch.
   */
  disabled?: boolean,
  /**
   * Value of the switch, true means 'on', false means 'off'.
   */
  value?: boolean,
  /**
   * Custom color for switch.
   */
  color?: string,
  /**
   * Callback called with the new value when it changes.
   */
  onValueChange?: Function,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Switch is a visual toggle between two mutually exclusive states — on and off.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/switch-enabled.android.png" />
 *     <figcaption>Android (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/switch-disabled.android.png" />
 *     <figcaption>Android (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/switch-enabled.ios.png" />
 *     <figcaption>iOS (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/switch-disabled.ios.png" />
 *     <figcaption>iOS (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Switch } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
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
class Switch extends React.Component<Props> {
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
          ? theme.dark
            ? setColor(white)
                .alpha(0.1)
                .rgb()
                .string()
            : setColor(black)
                .alpha(0.12)
                .rgb()
                .string()
          : setColor(checkedColor)
              .alpha(0.5)
              .rgb()
              .string();

    const thumbTintColor =
      Platform.OS === 'ios'
        ? undefined
        : disabled
          ? theme.dark
            ? grey800
            : grey400
          : value
            ? checkedColor
            : theme.dark
              ? grey400
              : grey50;

    return (
      <NativeSwitch
        {...props}
        value={value}
        disabled={disabled}
        onTintColor={trackTintColor}
        thumbTintColor={thumbTintColor}
        onValueChange={disabled ? undefined : onValueChange}
      />
    );
  }
}

export default withTheme(Switch);
