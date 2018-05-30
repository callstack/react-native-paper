/* @flow */

import * as React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';

import ToolbarAction from './ToolbarAction';

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
    return (
      <ToolbarAction
        {...this.props}
        icon={
          Platform.OS === 'ios'
            ? ({ size, color }) => (
                <View style={[styles.wrapper, { width: size, height: size }]}>
                  <Image
                    source={require('../../assets/back-chevron.png')}
                    style={[styles.icon, { tintColor: color }]}
                  />
                </View>
              )
            : 'arrow-back'
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 21,
    width: 21,
    resizeMode: 'contain',
  },
});

export default ToolbarBackAction;
