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
   * Optional icon size.
   */
  size?: number,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  style?: any,
};

/**
 * The ToolbarAction component is used for displaying an action item in the toolbar.
 */
export default class ToolbarAction extends React.Component<Props> {
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
      onPress,
      ...rest
    } = this.props;

    return (
      <TouchableIcon
        onPress={onPress}
        color={iconColor}
        source={icon}
        {...rest}
      />
    );
  }
}
