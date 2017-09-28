/* @flow */

import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform,
  View,
  ViewPropTypes,
} from 'react-native';
import color from 'color';

const ANDROID_VERSION_LOLLIPOP = 21;

type Props = {
  borderless: boolean,
  background?: Object,
  onPress?: ?Function,
  rippleColor: string,
  underlayColor?: string,
  children?: any,
  style?: any,
};

type DefaultProps = {
  borderless: boolean,
  rippleColor: string,
};

export default class TouchableItem extends PureComponent<
  DefaultProps,
  Props,
  void
> {
  static propTypes = {
    borderless: PropTypes.bool,
    background: PropTypes.object,
    onPress: PropTypes.func,
    rippleColor: PropTypes.string,
    underlayColor: PropTypes.string,
    children: PropTypes.element.isRequired,
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    borderless: false,
    rippleColor: 'rgba(0, 0, 0, .32)',
  };

  render() {
    const {
      style,
      background,
      borderless,
      rippleColor,
      underlayColor,
      children,
      ...rest
    } = this.props;

    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      return (
        <TouchableNativeFeedback
          {...rest}
          background={
            background != null
              ? background
              : TouchableNativeFeedback.Ripple(rippleColor, borderless)
          }
        >
          <View style={style}>{Children.only(children)}</View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableHighlight
        {...rest}
        style={style}
        underlayColor={
          underlayColor != null
            ? underlayColor
            : color(rippleColor)
                .clearer(0.5)
                .rgbaString()
        }
      >
        {Children.only(children)}
      </TouchableHighlight>
    );
  }
}
