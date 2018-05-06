/* @flow */

import * as React from 'react';
import color from 'color';

import { black, white } from '../../styles/colors';
import TouchableIcon from '../TouchableIcon';
import type { IconSource } from '../Icon';

type Props = {
  /**
   * A dark action icon will render a light icon and vice-versa.
   */
  dark?: boolean,
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
    const { color: customColor, dark, icon, onPress, ...rest } = this.props;

    let iconColor;

    if (customColor) {
      iconColor = customColor;
    } else if (dark) {
      iconColor = white;
    } else {
      iconColor = color(black)
        .alpha(0.54)
        .rgb()
        .string();
    }

    return (
      <TouchableIcon
        onPress={onPress}
        color={iconColor}
        name={icon}
        {...rest}
      />
    );
  }
}
