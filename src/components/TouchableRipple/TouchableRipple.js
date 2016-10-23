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
  onPress?: ?Function;
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
    onPress: PropTypes.func,
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
      onPress,
      rippleColor,
      style,
     } = this.props;

    return (
      <TouchableHighlight
        style={style}
        underlayColor={rippleColor}
        onPress={onPress}
      >
        {children}
      </TouchableHighlight>
    );
  }
}
