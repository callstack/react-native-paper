/* @flow */

import * as React from 'react';
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform,
  View,
} from 'react-native';
import color from 'color';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

const ANDROID_VERSION_LOLLIPOP = 21;

type Props = {
  /**
   * Whether to render the ripple outside the view bounds.
   */
  borderless?: boolean,
  /**
   * Type of background drawabale to display the feedback.
   * https://facebook.github.io/react-native/docs/touchablenativefeedback.html#background
   */
  background?: Object,
  /**
   * Whether to prevent interaction with the touchable.
   */
  disabled?: boolean,
  /**
   * Function to execute on press. If not set, will cause the touchable to be disabled.
   */
  onPress?: ?Function,
  /**
   * Color of the ripple effect.
   */
  rippleColor?: string,
  /**
   * Color of the underlay for the highlight effect.
   */
  underlayColor?: string,
  /**
   * Content of the `TouchableRipple`.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * A wrapper for views that should respond to touches.
 * Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop).
 * On unsupported platforms, it falls back to a highlight effect.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Text, TouchableRipple } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <TouchableRipple
 *     onPress={() => console.log('Pressed')}
 *     rippleColor="rgba(0, 0, 0, .32)"
 *   >
 *     <Text>Press me</Text>
 *   </TouchableRipple>
 * );
 * ```
 */
class TouchableRipple extends React.Component<Props, void> {
  static defaultProps = {
    borderless: false,
  };

  /**
   * Whether ripple effect is supported.
   */
  static supported = Platform.OS === 'android' &&
  Platform.Version >= ANDROID_VERSION_LOLLIPOP;

  render() {
    const {
      style,
      background,
      borderless,
      disabled: disabledProp,
      rippleColor,
      underlayColor,
      children,
      theme,
      ...rest
    } = this.props;

    const { dark, colors } = theme;
    const disabled = disabledProp || !this.props.onPress;
    const calculatedRippleColor =
      rippleColor ||
      color(colors.text)
        .alpha(dark ? 0.32 : 0.2)
        .rgb()
        .string();

    if (TouchableRipple.supported) {
      return (
        <TouchableNativeFeedback
          {...rest}
          disabled={disabled}
          background={
            background != null
              ? background
              : TouchableNativeFeedback.Ripple(
                  calculatedRippleColor,
                  borderless
                )
          }
        >
          <View style={style}>{React.Children.only(children)}</View>
        </TouchableNativeFeedback>
      );
    }

    return (
      /* $FlowFixMe */
      <TouchableHighlight
        {...rest}
        disabled={disabled}
        style={style}
        underlayColor={
          underlayColor != null
            ? underlayColor
            : color(calculatedRippleColor)
                .fade(0.5)
                .rgb()
                .string()
        }
      >
        {React.Children.only(children)}
      </TouchableHighlight>
    );
  }
}

export default withTheme(TouchableRipple);
