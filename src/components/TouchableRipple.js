/* @flow */

import React, { Children, PureComponent } from 'react';
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform,
  View,
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
