/* @flow */
import * as React from 'react';

import { grey400, grey800, grey50, white, black } from '../styles/colors';
import { Switch as NativeSwitch, Platform } from 'react-native';
import withTheme from '../core/withTheme';
import setColor from 'color';
import type { Theme } from '../types';

type Props = {
  /**
   * Disable toggling the switch.
   */
  disabled?: boolean,
  /**
   * Switch value- true or false.
   */
  value?: boolean,
  /**
   * Custom color for checkbox.
   */
  color?: string,
  /**
   * Invoked with the new value when the value changes.
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
 *   <div>
 *     <img src="screenshots/switch.android.enabled.png" />
 *     <span>Android (enabled)</span>
 *   </div>
 *   <div>
 *     <img src="screenshots/switch.android.disabled.png" />
 *     <span>Android (disabled)</span>
 *   </div>
 *   <div>
 *     <img src="screenshots/switch.ios.enabled.png" />
 *     <span>iOS (enabled)</span>
 *   </div>
 *   <div>
 *     <img src="screenshots/switch.ios.disabled.png" />
 *     <span>iOS (disabled)</span>
 *   </div>
 * </div>
 *
 * ## Usage
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
          ? theme.dark ? grey800 : grey400
          : value ? checkedColor : theme.dark ? grey400 : grey50;

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
