// @flow
import React, {
  Component,
  PropTypes,
} from 'react';
import {
  TouchableHighlight,
  View,
} from 'react-native';

export default class TouchableRipple extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    borderless: PropTypes.bool,
    onPress: PropTypes.func,
    rippleColor: PropTypes.string,
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
