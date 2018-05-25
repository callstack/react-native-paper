/* @flow */

import * as React from 'react';
import { Platform } from 'react-native';

import ToolbarAction from './ToolbarAction';
import Icon from '../Icon';

type Props = {
  /**
   *  Custom color for back icon.
   */
  color?: string,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  style?: any,
};

/**
 * A component used to display a back button in the toolbar.
 */
class ToolbarBackAction extends React.Component<Props> {
  static displayName = 'Toolbar.BackAction';

  render() {
    const icon =
      Platform.OS === 'ios'
        ? ({ color }) => (
            <Icon source="keyboard-arrow-left" size={36} color={color} />
          )
        : 'arrow-back';

    return <ToolbarAction {...this.props} size={24} icon={icon} />;
  }
}

export default ToolbarBackAction;
