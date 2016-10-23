// @flow
import React, {
  Component,
  PropTypes,
} from 'react';
import {
  TouchableNativeFeedback,
  View,
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
      borderLess,
      style,
     } = this.props;
    return (
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple(rippleColor, borderLess)}
        >
          <View style={style}>
            {children}
          </View>
        </TouchableNativeFeedback>
    );
  }
}
