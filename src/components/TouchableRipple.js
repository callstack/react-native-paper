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
 * Ripple provides components with a material "ink ripple" interaction effect.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Paragraph, TouchableRipple } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <TouchableRipple
 *     onPress={() => {}}
 *     borderless
 *     rippleColor="rgba(0, 0, 0, .32)"
 *   >
 *     <View>
 *       <Paragraph>Press me</Paragrpah>
 *     </View>
 *   </TouchableRipple>
 * );
 * ```
 */
class TouchableRipple extends React.Component<Props, void> {
  static defaultProps = {
    borderless: false,
  };

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

    const { dark: isDarkTheme } = theme;
    const disabled = disabledProp || !this.props.onPress;
    const calculatedRippleColor =
      rippleColor ||
      (isDarkTheme ? 'rgba(255, 255, 255, .20)' : 'rgba(0, 0, 0, .32)');

    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
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
