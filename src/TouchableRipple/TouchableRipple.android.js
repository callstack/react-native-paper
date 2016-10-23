// @flow
import React, {
  Component,
  PropTypes,
  Platform,
} from 'react';
import {
  TouchableNativeFeedback,
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
      borderless,
      style,
     } = this.props;
    return (
        <TouchableNativeFeedback
          onPress={onPress}
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
