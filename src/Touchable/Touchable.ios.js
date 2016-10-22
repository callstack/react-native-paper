// @flow
// @flow
import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableOpacity,
} from 'react-native';

export default class Touchable extends Component{

  static propTypes = {
    children: PropTypes.element.isRequired,
    onPress: PropTypes.func,
    rippleColor: PropTypes.string
  };

  static contextTypes = {
    theme: PropTypes.object,
  };

  render() {
    const {
      children,
      onPress,
      rippleColor
     } = this.props;
    return (
        <TouchableOpacity
          onPress={onPress}>
          {children}
        </TouchableOpacity>
    );
  }
}
