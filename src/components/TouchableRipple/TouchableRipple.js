/* @flow */

import React, {
  PureComponent,
  PropTypes,
} from 'react';
import {
  TouchableHighlight,
  View,
} from 'react-native';
import color from 'color';

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
  rippleColor: string;
}

export default class TouchableRipple extends PureComponent<DefaultProps, Props, void> {

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
      style,
     } = this.props;

    return (
      <TouchableHighlight
        style={style}
        underlayColor={color(rippleColor).clearer(0.5).rgbaString()}
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
