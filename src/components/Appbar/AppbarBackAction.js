/* @flow */

import * as React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';

import AppbarAction from './AppbarAction';

type Props = {
  /**
   *  Custom color for back icon.
   */
  color?: string,
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
 * A component used to display a back button in the appbar.
 */
class AppbarBackAction extends React.Component<Props> {
  static displayName = 'Appbar.BackAction';

  static defaultProps = {
    accessibilityLabel: 'Back',
  };

  render() {
    return (
      <AppbarAction
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

export default AppbarBackAction;
