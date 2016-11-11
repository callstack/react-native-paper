/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  TouchableHighlight,
  View,
} from 'react-native';

type Props = {
  borderless: boolean;
  delayPressIn?: number;
  onPress?: ?Function;
  onPressIn?: ?Function;
  onPressOut?: ?Function;
  rippleColor?: string;
  children?: any;
  style?: any;
}

type DefaultProps = {
  borderless: boolean;
}

export default class TouchableRipple extends Component<DefaultProps, Props, void> {

  static propTypes = {
    borderless: PropTypes.bool,
    delayPressIn: PropTypes.number,
    onPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    rippleColor: PropTypes.string,
    children: PropTypes.element.isRequired,
    style: View.propTypes.style,
  };

  static defaultProps = {
    borderless: false,
  }

  render() {
    const {
      children,
      delayPressIn,
      onPress,
      onPressIn,
      onPressOut,
      rippleColor,
      style,
     } = this.props;

    return (
      <TouchableHighlight
        style={style}
        underlayColor={rippleColor}
        delayPressIn={delayPressIn}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {children}
      </TouchableHighlight>
    );
  }
}
