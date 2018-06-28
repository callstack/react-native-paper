/* @flow */

import * as React from 'react';
import color from 'color';
import { black } from '../../styles/colors';
import TouchableIcon from '../TouchableIcon';
import type { IconSource } from '../Icon';

type Props = {
  /**
   *  Custom color for action icon.
   */
  color?: string,
  /**
   * Name of the icon to show.
   */
  icon: IconSource,
  /**
   * Whether the icon should be RTL, The icon will be flliped if the device is RTL.
   */
  iconRtl?: boolean,
  /**
   * Optional icon size.
   */
  size?: number,
  /*
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  style?: any,
};

/**
 * A component used to display an action item in the appbar.
 */
export default class AppbarAction extends React.Component<Props> {
  static displayName = 'Appbar.Action';

  static defaultProps = {
    size: 24,
  };

  render() {
    const {
      color: iconColor = color(black)
        .alpha(0.54)
        .rgb()
        .string(),
      icon,
      iconRtl,
      onPress,
      accessibilityLabel,
      ...rest
    } = this.props;

    return (
      <TouchableIcon
        onPress={onPress}
        color={iconColor}
        source={icon}
        rtl={iconRtl}
        accessibilityLabel={accessibilityLabel}
        accessibilityTraits="button"
        accessibilityComponentType="button"
        {...rest}
      />
    );
  }
}
