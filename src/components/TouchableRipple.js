/* @flow */

import * as React from 'react';
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform,
  View,
} from 'react-native';
import color from 'color';

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
   * Function to execute on press.
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
};

/**
 * Ripple provides components with a material "ink ripple" interaction effect.
 *
 * ## Usage
 * ```js
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
export default class TouchableRipple extends React.Component<Props, void> {
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
          <View style={style}>{React.Children.only(children)}</View>
        </TouchableNativeFeedback>
      );
    }

    return (
      /* $FlowFixMe */
      <TouchableHighlight
        {...rest}
        style={style}
        underlayColor={
          underlayColor != null
            ? underlayColor
            : color(rippleColor)
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
