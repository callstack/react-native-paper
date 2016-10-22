// @flow
import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableHighlight,
} from 'react-native';

export default class Touchable extends Component{

  static propTypes = {
    children: PropTypes.element.isRequired,
    borderLess: PropTypes.bool,
    onPress: PropTypes.func,
    rippleColor: PropTypes.string,
    contentStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ])
  };
  static defaultProps = {
    borderLess: false,
  }

  render() {
    const {
      children,
      onPress,
      rippleColor,
      borderLess,
      contentStyle
     } = this.props;
    return (
        <TouchableHighlight
          style={contentStyle}
          underlayColor={rippleColor}
          onPress={onPress}>
          {children}
        </TouchableHighlight>
    );
  }
}
