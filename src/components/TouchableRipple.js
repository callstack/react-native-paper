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
  borderless?: boolean,
  background?: Object,
  onPress?: ?Function,
  rippleColor?: string,
  underlayColor?: string,
  children: React.Node,
  style?: any,
};

/**
 * Ripple provides components with a material "ink ripple" interaction effect
 *
 * **Usage:**
 * ```js
 * const MyComponent = () => (
 *   <TouchableRipple>
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
                .clearer(0.5)
                .rgbaString()
        }
      >
        {React.Children.only(children)}
      </TouchableHighlight>
    );
  }
}
