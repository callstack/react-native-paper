/* @flow */

import * as React from 'react';
import IconButton from '../IconButton';
import type { IconSource } from '../Icon';
import type { Theme } from '../../types';
import { withTheme } from '../../core/theming';

type Props = React.ElementConfig<typeof IconButton> & {|
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
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean,
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

/**
 * A component used to display an action item in the appbar.
 */
class AppbarAction extends React.Component<Props> {
  static displayName = 'Appbar.Action';

  static defaultProps = {
    size: 24,
  };

  render() {
    const {
      color: iconColor,
      icon,
      disabled,
      onPress,
      accessibilityLabel,
      theme: { colors },
      ...rest
    } = this.props;

    return (
      <IconButton
        onPress={onPress}
        color={iconColor || colors.typography.secondary}
        icon={icon}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        animated
        {...rest}
      />
    );
  }
}

export default withTheme(AppbarAction);
