/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  TouchableNativeFeedback,
  View,
  Platform,
} from 'react-native';

type Props = {
  borderless: boolean;
  delayPressIn?: number;
  onPress?: ?Function;
  onPressIn?: ?Function;
  onPressOut?: ?Function;
  rippleColor: string;
  children?: any;
  style?: any;
}

type DefaultProps = {
  borderless: boolean;
  rippleColor: string;
}

export default class TouchableRipple extends Component<DefaultProps, Props, void> {

  static propTypes = {
    children: PropTypes.element.isRequired,
    borderless: PropTypes.bool,
    delayPressIn: PropTypes.number,
    onPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    rippleColor: PropTypes.string,
    style: View.propTypes.style,
  };

  static defaultProps = {
    borderless: false,
    rippleColor: 'rgba(0, 0, 0, .32)',
  }

  render() {
    const {
      children,
      delayPressIn,
      onPress,
      onPressIn,
      onPressOut,
      rippleColor,
      borderless,
      style,
     } = this.props;

    return (
      <TouchableNativeFeedback
        delayPressIn={delayPressIn}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        background={Platform.Version >= 21 ?
          TouchableNativeFeedback.Ripple(rippleColor, borderless) :
          TouchableNativeFeedback.SelectableBackground()}
      >
        <View style={style}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  }
}
