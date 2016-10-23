// @flow
import React, {
  Component,
  PropTypes,
} from 'react';
import {
  TouchableHighlight,
} from 'react-native';

export default class Touchable extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    borderLess: PropTypes.bool,
    onPress: PropTypes.func,
    rippleColor: PropTypes.string,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
  };
  static defaultProps = {
    borderLess: false,
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
